const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');

async function generatePatientQR(patientId, ttlMinutes = 10) {
  const payload = { patientId, type: 'patient_qr' };
  const token = jwt.sign(payload, process.env.QR_JWT_SECRET, { expiresIn: `${ttlMinutes}m` });
  const dataUrl = await QRCode.toDataURL(token); // base64 png
  return { token, dataUrl };
}

module.exports = { generatePatientQR };
