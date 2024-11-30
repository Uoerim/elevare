import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env.development.local' });

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM elevare_users WHERE token = $1', [token]);
      if (result.rows.length > 0) {
        return res.status(200).json({ message: 'Token is valid' });
      } else {
        return res.status(401).json({ error: 'Invalid token' });
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}