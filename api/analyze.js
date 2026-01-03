export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { file_content } = req.body;

    if (!file_content) {
      return res.status(400).json({ error: 'Missing file content' });
    }

    const response = await fetch(process.env.LANGFLOW_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LANGFLOW_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input_value: file_content,
        input_type: "text",
        output_type: "json"
      })
    });

    const data = await response.json();

    return res.status(200).json({
      what_happened: data.what_happened || "No data detected",
      why_it_matters: data.why_it_matters || "N/A",
      risk_level: data.risk_level || "Low",
      recommended_action: data.recommended_action || "No action suggested"
    });

  } catch (error) {
    return res.status(500).json({ error: 'AI analysis failed' });
  }
}
