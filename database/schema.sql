-- 建立預約資料表
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  time VARCHAR(20) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  people_count INTEGER NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date, time)
);

-- 建立索引以加速查詢
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_date_time ON bookings(date, time);
