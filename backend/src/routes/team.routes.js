const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

const ok = (res, data, message) => res.json({ success: true, data, message });
const fail = (res, code, message) => res.status(code).json({ success: false, message });

// ============================================================
// Helper: Get the user's agency_id (if any)
// ============================================================
const getUserAgency = async (userId) => {
  const { data, error } = await supabase
    .from('agency_members')
    .select('agency_id, role, agencies(id, name, slug, logo_url, owner_id)')
    .eq('user_id', userId)
    .limit(1)
    .single();

  if (error || !data) return null;
  return { ...data.agencies, userRole: data.role };
};

// GET /api/team — Current user's agency + members
router.get('/', async (req, res) => {
  try {
    const agency = await getUserAgency(req.user.id);
    
    if (!agency) {
      // Direct check: list memberships to see if they exist but are hidden by RLS
      const { data: check } = await supabase.from('agency_members').select('id').eq('user_id', req.user.id);
      if (check && check.length > 0) {
        console.warn(`[Team] User ${req.user.id} has ${check.length} memberships but getUserAgency returned null (RLS issue likely)`);
      }
      return ok(res, null, 'User is not part of any team');
    }

    // Fetch all members with profiles
    const { data: members, error } = await supabase
      .from('agency_members')
      .select(`
        id, role, joined_at,
        profiles(id, full_name, email, avatar_url)
      `)
      .eq('agency_id', agency.id)
      .order('joined_at', { ascending: true });

    if (error) {
      console.error('[Team] Get members error:', error);
      return fail(res, 400, error.message);
    }

    return ok(res, {
      agency: {
        id: agency.id,
        name: agency.name,
        slug: agency.slug,
        logo_url: agency.logo_url,
        owner_id: agency.owner_id,
      },
      userRole: agency.userRole,
      members: (members || []).map(m => ({
        id: m.id,
        role: m.role,
        joined_at: m.joined_at,
        user: m.profiles
      }))
    }, 'Team fetched');
  } catch (err) {
    console.error('Get Team Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

// ============================================================
// POST /api/team/create — Create a new agency/workspace
// ============================================================
router.post('/create', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return fail(res, 400, 'Agency name is required');

    // Check if user already has an agency
    const existing = await getUserAgency(req.user.id);
    if (existing) return fail(res, 409, 'You are already part of a team. Leave first.');

    // Create slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // 1. Create agency
    const { data: agency, error: agencyError } = await supabase
      .from('agencies')
      .insert({ name, slug, owner_id: req.user.id })
      .select()
      .single();

    if (agencyError) return fail(res, 400, agencyError.message);

    // 2. Add creator as owner member
    const { error: memberError } = await supabase
      .from('agency_members')
      .insert({ agency_id: agency.id, user_id: req.user.id, role: 'owner' });

    if (memberError) {
      console.error('Member insert error:', memberError);
    }

    // 3. Update creator's profile
    await supabase
      .from('profiles')
      .update({ agency_id: agency.id, role: 'owner' })
      .eq('id', req.user.id);

    // 4. Migrate existing clients to the agency
    const { error: migrateError } = await supabase
      .from('clients')
      .update({ agency_id: agency.id })
      .eq('user_id', req.user.id)
      .is('agency_id', null);

    if (migrateError) {
      console.error('Client migration error:', migrateError);
    }

    return res.status(201).json({
      success: true,
      data: agency,
      message: 'Team workspace created! Your existing clients have been migrated.'
    });
  } catch (err) {
    console.error('Create Agency Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

// ============================================================
// POST /api/team/invite — Invite member by email
// ============================================================
router.post('/invite', async (req, res) => {
  try {
    const { email, role = 'member' } = req.body;
    if (!email) return fail(res, 400, 'Email is required');

    // Get inviter's agency
    const agency = await getUserAgency(req.user.id);
    if (!agency) return fail(res, 403, 'You must be part of a team to invite');
    if (!['owner', 'admin'].includes(agency.userRole)) {
      return fail(res, 403, 'Only owners and admins can invite members');
    }

    // Find user by email in profiles
    const { data: targetProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('email', email)
      .single();

    if (profileError || !targetProfile) {
      return fail(res, 404, 'No registered user found with that email. They must sign up first.');
    }

    // Check if already a member
    const { data: existingMember } = await supabase
      .from('agency_members')
      .select('id')
      .eq('agency_id', agency.id)
      .eq('user_id', targetProfile.id)
      .single();

    if (existingMember) return fail(res, 409, 'This user is already a team member');

    // Add member
    const { data: member, error: insertError } = await supabase
      .from('agency_members')
      .insert({
        agency_id: agency.id,
        user_id: targetProfile.id,
        role: role,
        invited_by: req.user.id
      })
      .select()
      .single();

    if (insertError) return fail(res, 400, insertError.message);

    // Update their profile
    await supabase
      .from('profiles')
      .update({ agency_id: agency.id, role: role })
      .eq('id', targetProfile.id);

    // Migrate their personal clients to the agency too
    await supabase
      .from('clients')
      .update({ agency_id: agency.id })
      .eq('user_id', targetProfile.id)
      .is('agency_id', null);

    // Log activity
    await supabase.from('activity_log').insert({
      agency_id: agency.id,
      user_id: req.user.id,
      action: 'member_invited',
      entity_type: 'team',
      metadata: { invited_email: email, invited_name: targetProfile.full_name, role }
    });

    return res.status(201).json({
      success: true,
      data: { ...member, user: targetProfile },
      message: `${targetProfile.full_name || email} has been added to the team!`
    });
  } catch (err) {
    console.error('Invite Member Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

// ============================================================
// GET /api/team/members — List all agency members
// ============================================================
router.get('/members', async (req, res) => {
  try {
    const agency = await getUserAgency(req.user.id);
    if (!agency) return ok(res, [], 'Not part of a team');

    const { data: members, error } = await supabase
      .from('agency_members')
      .select(`
        id, role, joined_at, user_id,
        profiles:user_id(id, full_name, email, avatar_url)
      `)
      .eq('agency_id', agency.id)
      .order('joined_at', { ascending: true });

    if (error) return fail(res, 400, error.message);

    return ok(res, (members || []).map(m => ({
      id: m.id,
      user_id: m.user_id,
      role: m.role,
      joined_at: m.joined_at,
      user: m.profiles
    })), 'Members fetched');
  } catch (err) {
    console.error('Get Members Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

// ============================================================
// PUT /api/team/members/:id/role — Update member role
// ============================================================
router.put('/members/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'member', 'viewer'].includes(role)) {
      return fail(res, 400, 'Invalid role. Use: admin, member, or viewer');
    }

    const agency = await getUserAgency(req.user.id);
    if (!agency || !['owner', 'admin'].includes(agency.userRole)) {
      return fail(res, 403, 'Permission denied');
    }

    const { data, error } = await supabase
      .from('agency_members')
      .update({ role })
      .eq('id', id)
      .eq('agency_id', agency.id)
      .select()
      .single();

    if (error) return fail(res, 400, error.message);
    return ok(res, data, 'Role updated');
  } catch (err) {
    console.error('Update Role Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

// ============================================================
// DELETE /api/team/members/:id — Remove a member
// ============================================================
router.delete('/members/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const agency = await getUserAgency(req.user.id);
    if (!agency || !['owner', 'admin'].includes(agency.userRole)) {
      return fail(res, 403, 'Permission denied');
    }

    // Prevent removing the owner
    const { data: targetMember } = await supabase
      .from('agency_members')
      .select('role, user_id')
      .eq('id', id)
      .single();

    if (targetMember?.role === 'owner') {
      return fail(res, 403, 'Cannot remove the workspace owner');
    }

    const { error } = await supabase
      .from('agency_members')
      .delete()
      .eq('id', id)
      .eq('agency_id', agency.id);

    if (error) return fail(res, 400, error.message);

    // Clear their profile agency_id
    if (targetMember) {
      await supabase
        .from('profiles')
        .update({ agency_id: null, role: 'owner' })
        .eq('id', targetMember.user_id);
    }

    return ok(res, { id }, 'Member removed');
  } catch (err) {
    console.error('Remove Member Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

// ============================================================
// GET /api/team/activity — Shared activity feed
// ============================================================
router.get('/activity', async (req, res) => {
  try {
    const agency = await getUserAgency(req.user.id);
    if (!agency) return ok(res, [], 'Not part of a team');

    const { data: activities, error } = await supabase
      .from('activity_log')
      .select(`
        id, action, entity_type, entity_id, metadata, created_at,
        profiles:user_id(id, full_name, email, avatar_url)
      `)
      .eq('agency_id', agency.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) return fail(res, 400, error.message);

    return ok(res, activities || [], 'Activity feed fetched');
  } catch (err) {
    console.error('Get Activity Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

// ============================================================
// GET /api/team/comments/:clientId — Get comments for a client
// ============================================================
router.get('/comments/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;

    const agency = await getUserAgency(req.user.id);
    if (!agency) return ok(res, [], 'Not part of a team');

    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        id, content, mentions, created_at, updated_at,
        profiles:user_id(id, full_name, email, avatar_url)
      `)
      .eq('client_id', clientId)
      .eq('agency_id', agency.id)
      .order('created_at', { ascending: true });

    if (error) return fail(res, 400, error.message);
    return ok(res, comments || [], 'Comments fetched');
  } catch (err) {
    console.error('Get Comments Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

// ============================================================
// POST /api/team/comments/:clientId — Add a comment
// ============================================================
router.post('/comments/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { content, mentions = [] } = req.body;

    if (!content || !content.trim()) return fail(res, 400, 'Comment content is required');

    const agency = await getUserAgency(req.user.id);
    if (!agency) return fail(res, 403, 'Must be part of a team to comment');

    // Get the client name for the activity log
    const { data: client } = await supabase
      .from('clients')
      .select('name')
      .eq('id', clientId)
      .single();

    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        client_id: clientId,
        agency_id: agency.id,
        user_id: req.user.id,
        content: content.trim(),
        mentions
      })
      .select(`
        id, content, mentions, created_at, updated_at,
        profiles:user_id(id, full_name, email, avatar_url)
      `)
      .single();

    if (error) return fail(res, 400, error.message);

    // Log activity
    await supabase.from('activity_log').insert({
      agency_id: agency.id,
      user_id: req.user.id,
      action: 'comment_added',
      entity_type: 'client',
      entity_id: clientId,
      metadata: {
        client_name: client?.name || 'Unknown',
        preview: content.trim().substring(0, 80)
      }
    });

    return res.status(201).json({ success: true, data: comment, message: 'Comment added' });
  } catch (err) {
    console.error('Add Comment Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

// ============================================================
// DELETE /api/team/leave — Leave the current agency
// ============================================================
router.delete('/leave', async (req, res) => {
  try {
    const agency = await getUserAgency(req.user.id);
    if (!agency) return fail(res, 404, 'You are not in a team');

    if (agency.userRole === 'owner') {
      return fail(res, 403, 'Owners cannot leave the workspace. Transfer ownership or delete the team instead.');
    }

    const { error } = await supabase
      .from('agency_members')
      .delete()
      .eq('agency_id', agency.id)
      .eq('user_id', req.user.id);

    if (error) return fail(res, 400, error.message);

    // Update profile
    await supabase
      .from('profiles')
      .update({ agency_id: null, role: 'owner' })
      .eq('id', req.user.id);

    // Log activity
    await supabase.from('activity_log').insert({
      agency_id: agency.id,
      user_id: req.user.id,
      action: 'member_left',
      metadata: { user_name: req.user.email }
    });

    return ok(res, null, 'You have left the team workspace');
  } catch (err) {
    console.error('Leave Team Error:', err);
    return fail(res, 500, 'Internal server error');
  }
});

module.exports = router;
