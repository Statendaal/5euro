const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'schulden',
  user: 'marc',
  password: '',
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL 18');
    
    const versionResult = await client.query('SELECT version()');
    console.log('\nPostgreSQL Version:');
    console.log(versionResult.rows[0].version);
    
    const tablesResult = await client.query("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('\n✅ Total tables:', tablesResult.rows[0].count);
    
    const debtsResult = await client.query('SELECT COUNT(*) as total FROM debts');
    console.log('✅ Total debts:', debtsResult.rows[0].total);
    
    client.release();
    await pool.end();
    console.log('\n✅ Database test successful!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error connecting to database:', err);
    process.exit(1);
  }
}

testConnection();
