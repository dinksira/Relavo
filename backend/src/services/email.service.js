const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'Relavo <onboarding@resend.dev>'; // Default Resend test domain
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://relavo.xyz';

/**
 * Send a team invitation email
 */
const sendTeamInvitation = async ({ email, agencyName, inviterName, role, token }) => {
  try {
    const inviteLink = `${FRONTEND_URL}/signup?invite=${token}&email=${encodeURIComponent(email)}`;
    
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
      console.error('Resend Error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Email Service Exception:', err);
    return { success: false, error: err.message };
  }
};

module.exports = {
  sendTeamInvitation
};
