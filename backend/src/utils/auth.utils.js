const supabase = require('../config/supabase');

/**
 * Shared helper: verify user can access a client (own OR via agency)
 */
const verifyClientAccess = async (clientId, userId) => {
  // 1. Check if user belongs to an agency
  const { data: membership } = await supabase
    .from('agency_members')
    .select('agency_id')
    .eq('user_id', userId)
    .limit(1)
    .single();

  // 2. Query client with OR condition
  let query = supabase.from('clients').select('id, name, agency_id').eq('id', clientId);

  if (membership?.agency_id) {
    query = query.or(`user_id.eq.${userId},agency_id.eq.${membership.agency_id}`);
  } else {
    query = query.eq('user_id', userId);
  }

  const { data: client, error } = await query.single();
  return { client, error };
};

module.exports = {
  verifyClientAccess
};
