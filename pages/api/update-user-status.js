import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { contestId, staked } = req.body;

  if (!contestId || staked === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const today = new Date().toLocaleDateString('en-GB').split('/').reverse().join('');
    if (contestId !== today) {
      return res.status(400).json({ message: 'Invalid contest ID' });
    }

    const result = await usersCollection.updateOne(
      { 
        address: session.address,
        'contests.contestId': { $ne: contestId }
      },
      {
        $push: {
          contests: {
            contestId,
            staked: staked,
            promptsRemaining: 3,
            prompts: []
          }
        }
      },
      { upsert: true }
    );

    if (result.modifiedCount === 0 && result.upsertedCount === 0) {
      return res.status(404).json({ message: 'User not found or contest already exists' });
    }

    res.status(200).json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
