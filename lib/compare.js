import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function compareImages(todaysImageUrl, generatedImageUrl) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI trained to compare images and provide a closeness score between 0 and 100."
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Compare these two images and provide a closeness score between 0 and 100, where 100 is a perfect match and 0 is no similarity. Consider content(30%), color palette(20%), texture(15%), structural similarity(15%), semantic similarity(10%), and edge matching(10%). Return only the numeric score without any additional text or explanation." },
            { type: "image_url", image_url: { url: todaysImageUrl } },
            { type: "image_url", image_url: { url: generatedImageUrl } }
          ]
        }
      ],
      max_tokens: 300
    });

    const closenessScore = parseInt(response.choices[0].message.content);
    return closenessScore;
  } catch (error) {
    console.error('Error comparing images:', error);
    throw error;
  }
}
