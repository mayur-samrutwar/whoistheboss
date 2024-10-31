import { randomUUID } from 'crypto';
import { connectToDatabase } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check for authorization token
  const authToken = req.headers.authorization;
  if (!authToken || authToken !== process.env.API_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('contestIds');

    // Generate new UUIDs for each contest
    const contestIds = {
      begineer: randomUUID(),
      advanced: randomUUID(), 
      pro: randomUUID(),
      updatedAt: new Date()
    };

    // Try to update existing document, if none exists create new one
    const result = await collection.updateOne(
      {}, // empty filter to match any document
      { $set: contestIds },
      { upsert: true } // creates new doc if none exists
    );

    return res.status(200).json({
      message: 'Contest IDs updated successfully',
      contestIds
    });

  } catch (error) {
    console.error('Error setting contest IDs:', error);
    return res.status(500).json({ 
      message: 'Error setting contest IDs',
      error: error.message 
    });
  }
}
