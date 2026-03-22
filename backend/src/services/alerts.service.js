const supabase = require('../config/supabase');

exports.getAlertsForUser = async (userId) => {
  const { data, error } = await supabase
    .from('alerts')
    .select(`
      *,
      clients!inner (
        name,
        contact_name,
        user_id
      )
    `)
    .eq('clients.user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }

  return data;
};

exports.markAsRead = async (alertId) => {
  const { data, error } = await supabase
    .from('alerts')
    .update({ read: true })
    .eq('id', alertId)
    .select();

  if (error) {
    console.error('Error marking alert as read:', error);
  }

  return data;
};

exports.dismissAlert = async (alertId) => {
  const { error } = await supabase
    .from('alerts')
    .delete()
    .eq('id', alertId);

  if (error) {
    console.error('Error dismissing alert:', error);
  }
};

exports.getUnreadCount = async (userId) => {
  const { count, error } = await supabase
    .from('alerts')
    .select(`
      id,
      clients!inner (
        user_id
      )
    `, { count: 'exact', head: true })
    .eq('clients.user_id', userId)
    .eq('read', false);

  if (error) {
    console.error('Error getting unread alert count:', error);
    return 0;
  }

  return count;
};
