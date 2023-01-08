const generateAction = async (req, res) => {
    console.log('Received request');
    const input = JSON.parse(req.body).input;
    const response = await fetch(
        `https://api-inference.huggingface.co/models/therachelplan/sd-firstgen-rachel`,
        {
          headers: {
            Authorization: `Bearer ${process.env.HF_AUTH_KEY}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            inputs: input,
          }),
        }
      );
      if (response.ok) {
        const buffer = await response.buffer();
        const base64 = bufferToBase64(buffer);
        res.status(200).json({ image: base64 });
      } else if (response.status === 503) {
        const json = await response.json();
        res.status(503).json(json);
      } else {
        const json = await response.json();
        res.status(response.status).json({ error: response.statusText });
      }
}

const bufferToBase64 = (buffer) => {
    const base64 = buffer.toString('base64');
    return `data:image/png;base64,${base64}`;
  };
  
export default generateAction;