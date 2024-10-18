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

  const { promptText, imageUrl } = req.body;

  if (!promptText || !imageUrl) {
    return res.status(400).json({ message: 'Missing prompt text or image URL' });
  }

  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');

    // Find the user and get their current contest status
    const user = await usersCollection.findOne(
      { 
        address: session.address,
        'contests.contestId': today
      },
      { projection: { 'contests.$': 1 } }
    );

    if (!user || !user.contests || user.contests.length === 0) {
      return res.status(404).json({ message: 'No contest found for today' });
    }

    const todayContest = user.contests[0];

    if (todayContest.promptsRemaining <= 0) {
      return res.status(400).json({ message: 'No prompts remaining for today' });
    }

    // Generate a random closeness score (0-100)
    const closenessScore = Math.floor(Math.random() * 101);

    // Update the user's prompts and decrement promptsRemaining
    const result = await usersCollection.updateOne(
      { 
        address: session.address,
        'contests.contestId': today
      },
      {
        $push: {
          'contests.$.prompts': {
            promptText,
            closenessScore,
            imageUrl
          }
        },
        $inc: {
          'contests.$.promptsRemaining': -1
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Failed to update user prompts' });
    }

    res.status(200).json({ 
      message: 'User prompts updated successfully',
      promptsRemaining: todayContest.promptsRemaining - 1,
      closenessScore
    });
  } catch (error) {
    console.error('Error updating user prompts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
