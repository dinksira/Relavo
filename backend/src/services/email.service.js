const { Resend } = require('resend');

// Initialize Resend only if API key exists to prevent startup crash
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

if (!resend) {
  console.warn('[Email] RESEND_API_KEY is missing. Emails will not be sent.');
}

const FROM_EMAIL = 'onboarding@resend.dev'; // Use raw email for higher delivery success in sandbox
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://relavo.xyz';

/**
 * Send a team invitation email
 */
const sendTeamInvitation = async ({ email, agencyName, inviterName, role, token }) => {
  console.log(`[Email] Attempting to send invite to: ${email}`);
  
  if (!resend) {
    console.error('[Email] Cannot send: Resend is not initialized (missing API key)');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const inviteLink = `${FRONTEND_URL}/signup?invite=${token}&email=${encodeURIComponent(email)}`;
    console.log(`[Email] Generated link: ${inviteLink}`);
    
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Join ${inviterName} on ${agencyName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a202c;">
          <h2 style="color: #2b6cb0;">You're Invited!</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            <strong>${inviterName}</strong> has invited you to join the <strong>${agencyName}</strong> workspace on Relavo.
          </p>
          <p style="font-size: 14px; color: #718096; margin-bottom: 24px;">
            You will have <strong>${role}</strong> access to help manage client relationships and AI insights.
          </p>
          <a href="${inviteLink}" style="display: inline-block; background-color: #3182ce; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
            Join Workspace
          </a>
          <hr style="margin: 32px 0; border: 0; border-top: 1px solid #e2e8f0;" />
          <p style="font-size: 12px; color: #a0aec0;">
            If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      `
    });

    if (error) {
      console.error('[Email] Resend API Error:', error);
      return { success: false, error };
    }

    console.log(`[Email] Successfully sent invite to ${email}. ID: ${data?.id}`);
    return { success: true, data };
  } catch (err) {
    console.error('[Email] Exception:', err);
    return { success: false, error: err.message };
  }
};

module.exports = {
  sendTeamInvitation
};
