const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔄 Starting database migration...');
    
    // Read schema.sql file
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute migration
    await pool.query(schemaSql);
    
    console.log('✅ Database migration completed successfully!');
    
    // Verify migration
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'bookings'
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Verified: bookings table exists');
    } else {
      console.error('❌ Warning: bookings table not found after migration');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
