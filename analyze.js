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
        'Authorization': process.env.LANGFLOW_API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input_value: file_content,
        input_type: "text",
        output_type: "json"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
