// Check if the environment is NOT production
if (process.env.NODE_ENV !== "production") {
  // Use an async IIFE to load environment variables
  (async () => {
    // Dynamically import the dotenv package
    const dotenv = await import("dotenv");
    // Load environment variables from .env file
    dotenv.config();
  })();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not allowed" });
  }

  // console.log(req.body);
  const { text, target } = req.body;

  if (!text || !target) {
    return res.status(400).json({ error: "Missing text or language" });
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        target,
      }),
    });

    if (!response.ok) {
      const textError = await response.text();
      return res.status(response.status).json({ error: textError });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("API CALL ERROR :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
