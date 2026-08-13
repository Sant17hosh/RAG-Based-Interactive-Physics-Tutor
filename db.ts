import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Use DATABASE_URL from environment
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("WARNING: DATABASE_URL is not set in environment variables! Database operations will fail.");
}

export const pool = new Pool({
  connectionString,
});

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}

export async function initDB() {
  console.log("Initializing PostgreSQL Database...");
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'admin')),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create index on email for fast logins
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    // 2. Create student_profiles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        roll_number VARCHAR(100) NOT NULL,
        college VARCHAR(255) NOT NULL,
        class_name VARCHAR(100) NOT NULL,
        preferred_language VARCHAR(50) DEFAULT 'English',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Create exam_attempts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS exam_attempts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        exam_type VARCHAR(100) NOT NULL,
        chapter VARCHAR(255) NOT NULL,
        total_marks INTEGER NOT NULL,
        obtained_marks NUMERIC(5,2) NOT NULL,
        percentage NUMERIC(5,2) NOT NULL,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_exam_attempts_user_id ON exam_attempts(user_id);
    `);

    // 4. Create answers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS answers (
        id SERIAL PRIMARY KEY,
        attempt_id INTEGER NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
        question_id VARCHAR(100) NOT NULL,
        answer_text TEXT NOT NULL,
        marks_awarded NUMERIC(5,2) NOT NULL,
        feedback TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Create mcq_attempts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS mcq_attempts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        chapter VARCHAR(255) NOT NULL,
        total_questions INTEGER NOT NULL,
        correct_answers INTEGER NOT NULL,
        score INTEGER NOT NULL,
        percentage NUMERIC(5,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_mcq_attempts_user_id ON mcq_attempts(user_id);
    `);

    // 6. Create learning_progress table
    await client.query(`
      CREATE TABLE IF NOT EXISTS learning_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        chapter VARCHAR(255) NOT NULL,
        topic VARCHAR(255) NOT NULL,
        completion_percentage NUMERIC(5,2) NOT NULL,
        last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, chapter, topic)
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_learning_progress_user_id ON learning_progress(user_id);
    `);

    // 7. Create performance table
    await client.query(`
      CREATE TABLE IF NOT EXISTS performance (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        chapter VARCHAR(255) NOT NULL,
        bloom_level VARCHAR(100) NOT NULL,
        score INTEGER DEFAULT 0,
        attempt_count INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, chapter, bloom_level)
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_performance_user_id ON performance(user_id);
    `);

    // 8. Create tutor_history table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tutor_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        chapter VARCHAR(255) NOT NULL,
        bloom_level VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tutor_history_user_id ON tutor_history(user_id);
    `);

    // Check if admin user exists, if not seed one
    const usersCount = await client.query("SELECT COUNT(*) FROM users");
    const count = parseInt(usersCount.rows[0].count);
    
    if (count === 0) {
      console.log("Database is empty. Seeding default administrator account...");
      const email = 'admin@tim-physics.org';
      const name = 'System Administrator';
      const password = 'AdminPassword123';
      const hash = await bcrypt.hash(password, 10);
      
      const insertUserRes = await client.query(
        "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id",
        [name, email, hash, 'admin']
      );
      
      const adminId = insertUserRes.rows[0].id;
      
      // Insert profile for admin
      await client.query(
        "INSERT INTO student_profiles (user_id, roll_number, college, class_name) VALUES ($1, $2, $3, $4)",
        [adminId, 'ADMIN-001', 'REVA University', 'Class 11 Physics Admin']
      );
      
      console.log(`Default administrator seeded successfully.`);
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
    }

    await client.query('COMMIT');
    console.log("Database tables verified/created successfully.");
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("CRITICAL error initializing PostgreSQL database tables:", err);
    throw err;
  } finally {
    client.release();
  }
}
