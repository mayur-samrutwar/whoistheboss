import { connectToDatabase } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { contestType } = req.query;

  if (!contestType || !['begineer', 'advanced', 'pro'].includes(contestType)) {
    return res.status(400).json({ 
      message: 'Invalid contest type. Must be one of: begineer, advanced, pro'
    });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('contestIds');

    // Get the most recent contest IDs document
    const contestIdsDoc = await collection.findOne({}, {
      sort: { updatedAt: -1 }
    });

    if (!contestIdsDoc) {
      return res.status(404).json({
        message: 'No contest IDs found'
      });
    }

    return res.status(200).json({
      contestId: contestIdsDoc[contestType],
      updatedAt: contestIdsDoc.updatedAt
    });

  } catch (error) {
    console.error('Error getting contest ID:', error);
    return res.status(500).json({
      message: 'Error getting contest ID',
      error: error.message
    });
  }
}
