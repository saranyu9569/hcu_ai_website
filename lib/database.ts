import mysql, { Pool, PoolOptions } from 'mysql2/promise';
import bcrypt from 'bcryptjs';

type Env = {
  DB_HOST: string;
  DB_USER: string;
  DB_NAME: string;
  DB_PASSWORD: string;
  DB_PORT: number;
};

// --- Minimal env validation ---
function getEnv(): Env {
  const port = Number(process.env.DB_PORT ?? '3306');
  if (Number.isNaN(port)) {
    throw new Error('Invalid DB_PORT: must be a number');
  }
  const env: Env = {
    DB_HOST: process.env.DB_HOST ?? 'localhost:3306',
    DB_USER: process.env.DB_USER ?? 'leafin_digitech',
    DB_NAME: process.env.DB_NAME ?? 'leafin_digitech',
    DB_PASSWORD: process.env.DB_PASSWORD ?? '',
    DB_PORT: port
  };
  return env;
}

const ENV = getEnv();

// --- Create a singleton pool (สำคัญมากใน Next dev) ---
declare global {
  // eslint-disable-next-line no-var
  var __MYSQL_POOL__: Pool | undefined;
}

function createPool(): Pool {
  const opts: PoolOptions = {
    host: ENV.DB_HOST,
    user: ENV.DB_USER,
    database: ENV.DB_NAME,
    password: ENV.DB_PASSWORD,
    port: ENV.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    // กันปัญหา BIGINT/DECIMAL กลายเป็น number แล้วพัง
    supportBigNumbers: true,
    bigNumberStrings: true,

    // กัน timezone/Date แปลงเพี้ยนใน Node: รับเป็น string ไปก่อน
    dateStrings: true
  };

  const p = mysql.createPool(opts);
  // optional: ลองเชื่อมครั้งแรก (จะ throw เร็ว ถ้า config ผิด)
  // ไม่ต้อง await ที่นี่เพื่อหลีกเลี่ยง block import; ค่อย ping ตอนใช้จริง
  return p;
}

export const pool: Pool = global.__MYSQL_POOL__ ?? createPool();
if (!global.__MYSQL_POOL__) {
  global.__MYSQL_POOL__ = pool;
}

// --- health check ---
export async function pingDB(): Promise<boolean> {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    return true;
  } catch (e) {
    console.error('[DB][PING_FAIL]', (e as Error).message);
    return false;
  }
}

// --- safe query helper ---
// ใช้แทน pool.execute โดยตรง จะได้มี requestId และ error log ที่อ่านง่าย
export async function query<T = any>(sql: string, params?: any[], requestId?: string): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params);
    // rows เป็น any[] อยู่แล้ว (dateStrings/bigNumberStrings เปิดไว้ด้านบน)
    return rows as T[];
  } catch (e: any) {
    console.error('[DB][QUERY_FAIL]', {
      requestId,
      message: e?.message,
      code: e?.code,
      errno: e?.errno,
      sqlState: e?.sqlState,
      sqlMessage: e?.sqlMessage
    });
    throw e;
  }
}

// --- ตัวอย่างฟังก์ชันที่คุณมี (ขอทำให้แน่นขึ้น) ---
export async function getAllEvents() {
  // แนะนำให้เรียกใช้ helper query() เพื่อ log ครบ
  const reqId = crypto.randomUUID();
  const ok = await pingDB();
  if (!ok) {
    // โยน error ให้ route.ts ตัดสินใจตอบ 500 เอง
    throw new Error('DB_UNREACHABLE');
  }

  // ถ้าชื่อคอลัมน์ `date` เป็นคำสงวน ให้ใส่ backtick
  const sql = 'SELECT * FROM `events` ORDER BY `event_date` DESC';
  return await query(sql, [], reqId);
}

// export default pool; // ถ้าต้องการ default export ด้วยก็ได้

// --- Basic Admin stubs to fix TS errors ---
export async function authenticateAdmin(username: string, pass: string): Promise<any> {
  const users = await query<any>('SELECT * FROM admin_users WHERE username = ? LIMIT 1', [username]);
  if (users.length === 0) return null;
  const user = users[0];
  const valid = await bcrypt.compare(pass, user.password);
  return valid ? user : null;
}

export async function createSession(userId: number, token: string, expiresAt: Date): Promise<boolean> {
  await query('INSERT INTO admin_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)', [userId, token, expiresAt]);
  return true;
}

export async function deleteSession(token: string): Promise<boolean> {
  await query('DELETE FROM admin_sessions WHERE session_token = ?', [token]);
  return true;
}

export async function validateSession(token: string): Promise<any> {
  const sessions = await query(
    `SELECT s.user_id, u.username, u.role, u.full_name
     FROM admin_sessions s
     JOIN admin_users u ON u.id = s.user_id
     WHERE s.session_token = ? AND s.expires_at > NOW()
     LIMIT 1`,
    [token]
  );
  if (sessions.length > 0) return sessions[0];
  return null;
}
