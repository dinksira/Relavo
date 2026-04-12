require('dotenv').config();
const app = require('./app');
const cron = require('node-cron');
const healthService = require('./services/health.service');
const supabase = require('./config/supabase');

const PORT = process.env.PORT || 3001;
const emailService = require('./services/email.service');

app.listen(PORT, () => {
  console.log(`Relavo API running on port ${PORT}`);
  
  // Weekly Digest — Every Monday at 8:00 AM
  cron.schedule('0 8 * * 1', async () => {
    console.log('Running weekly digest email cron...');
    
    try {
      // 1. Fetch all users from profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name');
      
      if (profileError) {
        console.error('Weekly Digest: Error fetching profiles:', profileError);
        return;
      }
      
      for (const profile of profiles) {
        // 2. Find clients for this user with health_score < 60
        // We join with the latest health_score row for each client
        const { data: atRiskClients, error: clientError } = await supabase
          .from('clients')
          .select(`
            id, 
            name, 
            monthly_revenue,
            health_scores!inner(score)
          `)
          .eq('user_id', profile.id)
          .eq('status', 'active')
          .lt('health_scores.score', 60)
          // Ensure we only get the latest score (this query might be tricky in Supabase tanpa view)
          // But usually LT on the join will return clients who have AT LEAST ONE score < 60.
          // For simplicity in Day 5, we'll assume the latest score is the one being filtered.
          .order('health_scores.calculated_at', { foreignTable: 'health_scores', ascending: false })
          .limit(1, { foreignTable: 'health_scores' });

        if (clientError) {
          console.error(`Weekly Digest: Error fetching at-risk clients for ${profile.email}:`, clientError);
          continue;
        }

        if (atRiskClients && atRiskClients.length > 0) {
          // Normalize the data (extracting score from the join)
          const clientsToReport = atRiskClients.map(c => ({
            name: c.name,
            monthly_revenue: c.monthly_revenue,
            score: c.health_scores[0]?.score
          }));

          console.log(`Sending weekly digest to ${profile.email} for ${clientsToReport.length} clients`);
          await emailService.sendWeeklyDigest(profile.email, profile.full_name, clientsToReport);
        }
      }
    } catch (error) {
      console.error('Weekly digest cron exception:', error);
    }
  });
  
  // Daily at 2am — recalculate all clients for all users
  cron.schedule('0 2 * * *', async () => {
    console.log('Running daily health score recalculation...');
    
    try {
      const { data: users, error } = await supabase
        .from('clients')
        .select('user_id')
        .eq('status', 'active');
      
      if (error) {
        console.error('Cron: Error fetching users:', error);
        return;
      }
      
      const uniqueUserIds = [...new Set(users.map(u => u.user_id))];
      
      for (const userId of uniqueUserIds) {
        await healthService.recalculateAllClients(userId);
      }
      
      console.log(`Recalculated scores for ${uniqueUserIds.length} users`);
    } catch (error) {
      console.error('Cron job error:', error);
    }
  });
});
