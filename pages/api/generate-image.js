import { OpenAI } from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Generate the image first
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;

    // Use a fallback URL if NEXTAUTH_URL is not set
    const baseUrl = process.env.NEXTAUTH_URL || `http://localhost:${process.env.PORT || 3003}`;
    console.log('Base URL:', baseUrl); // For debugging

    // Now update the user's prompts with the generated image URL
    const updateResponse = await fetch(`${baseUrl}/api/update-user-prompts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.cookie // Forward the session cookie
      },
      body: JSON.stringify({ 
        promptText: prompt,
        imageUrl: imageUrl
      })
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      return res.status(updateResponse.status).json({ error: errorData.message });
    }

    const updateData = await updateResponse.json();

    res.status(200).json({ 
      imageUrl,
      promptsRemaining: updateData.promptsRemaining,
      closenessScore: updateData.closenessScore
    });
  } catch (error) {
    console.error('Detailed error in generate-image:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Error generating image', details: error.message });
  }
}
