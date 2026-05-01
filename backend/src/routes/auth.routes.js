const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, agency } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password, and name are required" });
    }

    // Call supabase.auth.admin.createUser()
    const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name: name },
      email_confirm: true
    });

    if (createError) {
      return res.status(createError.status || 400).json({ error: createError.message });
    }

    // To get a token, we need to sign in after creation
    const { data: { session }, error: signinError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signinError) {
      return res.status(signinError.status || 400).json({ error: signinError.message });
    }

    // 3. Create a profile in the 'profiles' table (public schema)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
         id: user.id,
         full_name: name,
         email: email,
         company_name: agency || ''
      });

    if (profileError) {
       console.error('Profile creation error:', profileError);
       // We don't fail registration if profile creation fails, but it's good to log
    }

    // 4. Auto-create agency workspace if agency name was provided
    let agencyData = null;
    if (agency && agency.trim()) {
      try {
        const slug = agency.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        const { data: newAgency, error: agencyError } = await supabase
          .from('agencies')
          .insert({ name: agency.trim(), slug, owner_id: user.id })
          .select()
          .single();

        if (agencyError) {
          console.error('Agency creation error:', agencyError);
        } else {
          agencyData = newAgency;

          // Add user as owner member
          await supabase
            .from('agency_members')
            .insert({ agency_id: newAgency.id, user_id: user.id, role: 'owner' });

          // Update profile with agency_id
          await supabase
            .from('profiles')
            .update({ agency_id: newAgency.id, role: 'owner' })
            .eq('id', user.id);
        }
      } catch (agencyErr) {
        console.error('Agency setup error (non-fatal):', agencyErr);
      }
    }

    res.status(201).json({ user, token: session.access_token, agency: agencyData });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(error.status || 401).json({ error: "Invalid credentials" });
    }

    res.json({ user, token: session.access_token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
