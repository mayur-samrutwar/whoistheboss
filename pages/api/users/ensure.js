import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ message: 'Address is required' });
  }

  try {
    const { db } = await connectToDatabase();
    
    // Try to find the user
    const user = await db.collection('users').findOne({ address });

    if (user) {
      // User already exists
      return res.status(200).json({ message: 'User already exists', isNewUser: false });
    } else {
      // User doesn't exist, so add them
      const result = await db.collection('users').insertOne({
        address,
        createdAt: new Date(),
        // Add any other initial user data here
      });

      return res.status(201).json({ message: 'User added successfully', isNewUser: true, userId: result.insertedId });
    }
  } catch (error) {
    console.error('Error ensuring user in database:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

