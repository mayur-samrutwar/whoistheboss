export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // For now, we're returning a static image URL
  const todaysImageUrl = 'https://images.unsplash.com/photo-1610177498573-78deaa4a797b';

  res.status(200).json({ imageUrl: todaysImageUrl });
}
