import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  console.log('Entering get-user-status handler');

  if (req.method !== 'GET') {
    console.log(`Method not allowed: ${req.method}`);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    console.log('Unauthorized: No session found');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  console.log(`Session found for address: ${session.address}`);

  try {
    const { db } = await connectToDatabase();
    console.log('Connected to database');

    const usersCollection = db.collection('users');
    console.log('Accessing users collection');

    const user = await usersCollection.findOne({ address: session.address });
    if (!user) {
      console.log(`User not found for address: ${session.address}`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`User found: ${JSON.stringify(user)}`);

    const today = new Date().toLocaleDateString('en-GB').split('/').reverse().join('');
    console.log(`Today's date: ${today}`);

    let canPlay = true;
    let promptsRemaining = 3; // Default value
    let hasStaked = false;

    if (user.contests && Array.isArray(user.contests)) {
      const currentContest = user.contests.find(contest => contest.contestId === today);
      if (currentContest) {
        promptsRemaining = currentContest.promptsRemaining || 0;
        canPlay = promptsRemaining > 0;
        hasStaked = currentContest.staked || false;
      }
    }

    const response = {
      canPlay: canPlay,
      promptsRemaining: promptsRemaining,
      hasStaked: hasStaked,
      needsToStake: canPlay && !hasStaked
    };

    console.log(`Response: ${JSON.stringify(response)}`);

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching user status:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
