const nodemailer = require('nodemailer');

// Konfigurasi Transporter (Gunakan email pengirim sistem Anda)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Email pengirim (dari .env)
    pass: process.env.EMAIL_PASS  // App Password (dari .env)
  }
});

exports.sendContactMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validasi input
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Mohon lengkapi semua data." });
  }

  // Isi Email yang akan dikirim ke Admin
  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`, // Pengirim (Sistem)
    to: 'sigma.medic.dom@gmail.com', // 🔥 EMAIL TUJUAN ADMIN
    replyTo: email, // Agar admin bisa langsung reply ke user
    subject: `[KONTAK WEB] ${subject || 'Pesan Baru'}`,
    html: `
      <h3>Pesan Baru dari Website Sigma Medic</h3>
      <p><strong>Nama:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subjek:</strong> ${subject}</p>
      <hr/>
      <p><strong>Pesan:</strong></p>
      <p>${message}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Pesan berhasil dikirim!" });
  } catch (error) {
    console.error("Gagal kirim email kontak:", error);
    res.status(500).json({ message: "Gagal mengirim pesan. Coba lagi nanti." });
  }
};