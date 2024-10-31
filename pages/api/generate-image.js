import { OpenAI } from 'openai';
import { compareImages } from '@/lib/compare';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Generate the image using OpenAI API
    const openaiResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024"
    });

    const imageUrl = openaiResponse.data[0].url;

    // Comment out Livepeer API call
    /*
    // Generate the image using Livepeer API
    const livepeerResponse = await fetch("https://dream-gateway.livepeer.cloud/text-to-image", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_id: "SG161222/RealVisXL_V4.0_Lightning",
        prompt: prompt,
        width: 1024,
        height: 1024
      })
    });

    if (!livepeerResponse.ok) {
      throw new Error(`Livepeer API error: ${livepeerResponse.statusText}`);
    }

    const livepeerData = await livepeerResponse.json();
    const imageUrl = livepeerData.images[0].url;
    */

    // Get today's image URL
    const todaysImageResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/get-todays-image`);
    const todaysImageData = await todaysImageResponse.json();
    const todaysImageUrl = todaysImageData.imageUrl;

    // Compare images and get closeness score
    const closenessScore = await compareImages(todaysImageUrl, imageUrl);

    // Now update the user's prompts with the generated image URL and closeness score
    const updateResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/update-user-prompts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.cookie // Forward the session cookie
      },
      body: JSON.stringify({ 
        promptText: prompt,
        imageUrl: imageUrl,
        closenessScore: closenessScore
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
      closenessScore: closenessScore
    });
  } catch (error) {
    console.error('Detailed error in generate-image:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Error generating image', details: error.message });
  }
}
