const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Send welcome email
  async sendWelcomeEmail(userEmail, username) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: userEmail,
      subject: 'Welcome to EtherPets! 🐾',
      html: this.getWelcomeTemplate(username),
    };

    return await this.sendEmail(mailOptions);
  }

  // Send notification email
  async sendNotificationEmail(userEmail, notification) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: userEmail,
      subject: `EtherPets Notification: ${notification.title}`,
      html: this.getNotificationTemplate(notification),
    };

    return await this.sendEmail(mailOptions);
  }

  // Send password reset email
  async sendPasswordResetEmail(userEmail, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: userEmail,
      subject: 'Reset Your EtherPets Password',
      html: this.getPasswordResetTemplate(resetUrl),
    };

    return await this.sendEmail(mailOptions);
  }

  // Generic email sender
  async sendEmail(mailOptions) {
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  }

  // Email templates
  getWelcomeTemplate(username) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to EtherPets! 🎉</h1>
          </div>
          <div class="content">
            <h2>Hello ${username},</h2>
            <p>Welcome to the magical world of EtherPets! We're thrilled to have you join our community of pet lovers and blockchain enthusiasts.</p>
            
            <h3>What's Next?</h3>
            <ul>
              <li>🐾 Create your first magical pet</li>
              <li>🎮 Explore fun activities and games</li>
              <li>🏆 Compete in seasonal leaderboards</li>
              <li>🛍️ Visit the marketplace for rare items</li>
            </ul>

            <p>Ready to start your adventure?</p>
            <a href="${process.env.FRONTEND_URL}" class="button">Start Playing Now</a>

            <p>If you have any questions, feel free to reply to this email!</p>
            
            <p>Happy gaming,<br>The EtherPets Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getNotificationTemplate(notification) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4ECDC4; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 EtherPets Notification</h1>
          </div>
          <div class="content">
            <h2>${notification.title}</h2>
            <p>${notification.message}</p>
            
            ${notification.actionUrl ? `
            <p><a href="${notification.actionUrl}" style="background: #4ECDC4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Take Action</a></p>
            ` : ''}

            <p><small>You can manage your notification preferences in your account settings.</small></p>
            
            <p>Best regards,<br>The EtherPets Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getPasswordResetTemplate(resetUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #FF6B6B; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { background: #FF6B6B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password for your EtherPets account.</p>
            <p>Click the button below to create a new password:</p>
            
            <a href="${resetUrl}" class="button">Reset Password</a>

            <p>If you didn't request this reset, you can safely ignore this email.</p>
            <p><small>This link will expire in 1 hour for security reasons.</small></p>
            
            <p>Best regards,<br>The EtherPets Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();