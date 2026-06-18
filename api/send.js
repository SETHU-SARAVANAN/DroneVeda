// Vercel Serverless function to forward contact form to Resend
const RESEND_API = 'https://api.resend.com/emails';

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Mailer not configured' });

    const from = process.env.RESEND_FROM || 'hello@droneveda.com';
    const to = process.env.CONTACT_RECEIVER || 'contact@droneveda.com';

    const html = `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br/>')}</p>
    `;

    const payload = {
      from,
      to,
      subject: `Website query from ${name}`,
      html
    };

    const r = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) return res.status(r.status).json({ error: data.error || data, details: data });

    return res.status(200).json({ ok: true, id: data.id || null });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
