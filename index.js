const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  password: 'rohitPen15',
  host: '127.0.0.1',
  port: 5432,
  database: 'shortListingIntern'
});


pool.connect()
  .then(client => {
    console.log(' PostgreSQL connected successfully!');
    client.release();
  })
  .catch(err => {
    console.error(' Connection failed:', err);
    process.exit(1);
  });



app.get('/api/listings', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM listing');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});



app.post('/api/listings/:id/shortlist', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE listing SET is_shortlisted = true WHERE id = $1 RETURNING *',
      [id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to shortlist listing' });
  }
});



app.post('/api/listings/:id/unshortlist', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE listing SET is_shortlisted = false WHERE id = $1 RETURNING *',
      [id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to unshortlist listing' });
  }
});



app.get('/api/shortlisted', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM listing WHERE is_shortlisted = true');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shortlisted listings' });
  }
});


// 🔚 Start Server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
