export default async function handler(req, res) {

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Your secret key lives HERE — safe on the server, never visible to anyone
  const API_KEY = process.env.DEBITO_SECRET_KEY;

  const body = req.body;

  try {
    const response = await fetch(
      'https://gyqoaningqhurhvdugne.supabase.co/functions/v1/payment-orchestrator',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: 'Payment service unavailable. Please try again.' 
    });
  }
}