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

  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const today = new Date().toLocaleString('en-GB', { timeZone: 'GMT', day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('');

    const result = await usersCollection.updateOne(
      { 
        address: session.address,
        'contests.contestId': today
      },
      { 
        $set: { 'contests.$.scoreSubmitted': true }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'User or contest not found' });
    }

    res.status(200).json({ message: 'Score submitted successfully' });
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
