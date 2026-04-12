const { Resend } = require('resend');

let resend;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (e) {
  console.error('[Relavo] Failed to initialize Resend:', e.message);
}

const EMAIL_FROM = process.env.EMAIL_FROM || 'Relavo <onboarding@resend.dev>';

/**
 * Sends a weekly digest email to the user
 * @param {string} userEmail 
 * @param {Array} atRiskClients 
 */
exports.sendWeeklyDigest = async (userEmail, userName, atRiskClients) => {
  if (!resend) {
    console.warn('RESEND_API_KEY not set or invalid. Skipping email send.');
    return;
  }

  const atRiskCount = atRiskClients.length;
  const atRiskRevenue = atRiskClients.reduce((sum, c) => sum + (c.monthly_revenue || 0), 0);

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155;">
      <h2 style="color: #0f172a;">Good morning, ${userName || 'there'}!</h2>
      <p>Here is your weekly Relavo summary of at-risk accounts that need attention.</p>
      
      <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <h3 style="margin: 0; color: #dc2626; font-size: 18px;">At-Risk Overview</h3>
        <div style="display: flex; gap: 40px; margin-top: 15px;">
          <div>
            <p style="margin: 0; font-size: 12px; font-weight: bold; text-transform: uppercase; color: #991b1b;">Clients at Risk</p>
            <p style="margin: 5px 0 0; font-size: 24px; font-weight: bold; color: #dc2626;">${atRiskCount}</p>
          </div>
          <div>
            <p style="margin: 0; font-size: 12px; font-weight: bold; text-transform: uppercase; color: #991b1b;">Revenue at Risk</p>
            <p style="margin: 5px 0 0; font-size: 24px; font-weight: bold; color: #dc2626;">$${atRiskRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <h3 style="color: #0f172a; margin-top: 32px;">At-Risk Clients</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr style="text-align: left; border-bottom: 2px solid #f1f5f9;">
            <th style="padding: 10px 0; font-size: 13px; color: #64748b;">Client Name</th>
            <th style="padding: 10px 0; font-size: 13px; color: #64748b;">Health Score</th>
            <th style="padding: 10px 0; font-size: 13px; color: #64748b;">Monthly Rev</th>
          </tr>
        </thead>
        <tbody>
          ${atRiskClients.map(client => `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; font-weight: 600; color: #0f172a;">${client.name}</td>
              <td style="padding: 12px 0;">
                <span style="color: ${client.score < 40 ? '#dc2626' : '#d97706'}; font-weight: bold;">
                  ${client.score}/100
                </span>
              </td>
              <td style="padding: 12px 0;">$${(client.monthly_revenue || 0).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9; text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" 
           style="background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
          View All Alerts in Dashboard
        </a>
      </div>
      
      <p style="margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center;">
        Relavo AI Client Retention Platform
      </p>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [userEmail],
      subject: `Weekly Client Health Digest — ${atRiskCount} Accounts at Risk`,
      html: html,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Resend Exception:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Sends a generic email
 */
exports.sendEmail = async ({ to, subject, html, text }) => {
  if (!resend) {
    throw new Error('Email service not configured. Please add RESEND_API_KEY.');
  }

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text
    });

    if (error) {
      console.error('Resend Error:', error);
      throw error;
    }
    return data;
  } catch (err) {
    console.error('sendEmail Exception:', err);
    throw err;
  }
};
