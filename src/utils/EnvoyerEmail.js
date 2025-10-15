const nodemailer = require("nodemailer");

exports.envoyerEmail = async (utilisateurAEnvoyer, resetToken) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: utilisateurAEnvoyer.email,
      subject: "Réinitialiser votre mot de passe - ESihha Connect",
      html: `
        <h2>Réinitialisation de mot de passe</h2>
        <p>Bonjour ${utilisateurAEnvoyer.prenom} ${utilisateurAEnvoyer.nom},</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <a href="${process.env.APP_URL}/reset-password/${resetToken}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Réinitialiser le mot de passe</a>
        <p>Ce lien expire dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Erreur envoi email:", error);
        reject(error);
      } else {
        console.log("Email envoyé:", info.response);
        resolve(info);
      }
    });
  });
};
