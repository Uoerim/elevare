import { NextApiRequest, NextApiResponse } from 'next';
import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';
dotenv.config({ path: '../.env.development.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT token FROM elevare_users WHERE username = $1 AND password = $2', [username, password]);
        if (result.rows.length > 0) {
          res.status(200).json({ token: result.rows[0].token });
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}