require('dotenv').config();
const app = require('./app');
const cron = require('node-cron');
const healthService = require('./services/health.service');
const supabase = require('./config/supabase');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Relavo API running on port ${PORT}`);
  
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
