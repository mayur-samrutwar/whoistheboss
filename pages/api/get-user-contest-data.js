import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
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

    const user = await usersCollection.findOne(
      { address: session.address },
      { projection: { [`contests.${today}`]: 1 } }
    );

    if (!user || !user.contests || !user.contests[today]) {
      return res.status(404).json({ message: 'No contest found for today' });
    }

    const todayContest = user.contests[today];

    res.status(200).json({
      promptsRemaining: todayContest.promptsRemaining,
      prompts: todayContest.prompts || []
    });
  } catch (error) {
    console.error('Error fetching user contest data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
