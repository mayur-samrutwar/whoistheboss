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

  const { promptText, imageUrl, closenessScore } = req.body;

  if (!promptText || !imageUrl || closenessScore === undefined) {
    return res.status(400).json({ message: 'Missing prompt text, image URL, or closeness score' });
  }

  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const today = new Date().toLocaleString('en-GB', { timeZone: 'GMT', day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('');

    // Find the user and get their current contest status
    const user = await usersCollection.findOne(
      { address: session.address },
      { projection: { [`contests.${today}`]: 1 } }
    );

    if (!user || !user.contests || !user.contests[today]) {
      return res.status(404).json({ message: 'No contest found for today' });
    }

    const todayContest = user.contests[today];

    if (todayContest.promptsRemaining <= 0) {
      return res.status(400).json({ message: 'No prompts remaining for today' });
    }

    // Update the user's prompts and decrement promptsRemaining
    const result = await usersCollection.updateOne(
      { address: session.address },
      {
        $push: {
          [`contests.${today}.prompts`]: {
            promptText,
            closenessScore,
            imageUrl
          }
        },
        $inc: {
          [`contests.${today}.promptsRemaining`]: -1
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
