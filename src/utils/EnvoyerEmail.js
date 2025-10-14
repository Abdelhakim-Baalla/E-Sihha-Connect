const nodemailer = require("nodemailer");

exports.envoyerEmail = async (utilisateurAEnvoyer, resetToken) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: utilisateurAEnvoyer.email,
    subject: "Reseter Votre mot de passe - ESihha Connect",
    text: `Clicker Sur ce lien pour reinitialiser Votre mot de passe: ${process.env.APP_URL}/api/v1/reset-password?token=${resetToken}`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) return res.status(500).json("Erreur lors de l'envoi");
    res.json("L'email de restoration de mot du passe a été envoyer");
  });
  
};
