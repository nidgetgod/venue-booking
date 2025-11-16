# Venue Booking System

場地預約系統

## 功能特色

- ✅ 場地預約管理（單次/連續預約）
- ✅ 日曆式時段選擇
- ✅ PostgreSQL 資料庫儲存
- ✅ PWA 支援（可離線安裝）
- ✅ 響應式設計
- ✅ 即時預約狀態

## 環境需求

- Node.js >= 20.9.0
- PostgreSQL >= 12
- npm 或 yarn

## 安裝步驟

### 1. 安裝相依套件

```bash
npm install
```

### 2. 設定資料庫

建立 PostgreSQL 資料庫：

```bash
createdb venue_booking
```

執行資料庫 schema：

```bash
psql -d venue_booking -f database/schema.sql
```

### 3. 設定環境變數

複製範例檔案並填入資料庫連線資訊：

```bash
cp .env.local.example .env.local
```

編輯 `.env.local`：

```env
DATABASE_URL=postgresql://username:password@localhost:5432/venue_booking
```

### 4. 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問：http://localhost:3000

## 測試

### 執行單元測試

```bash
npm test
```

### 執行測試並生成覆蓋率報告

```bash
npm test -- --coverage
```

### 執行特定測試檔案

```bash
npm test src/components/__tests__/BookingForm.test.tsx
```

### 測試覆蓋率

專案包含 23 個測試套件，135 個測試案例，覆蓋率達 82.78%：

- **Components**: 81.59% 覆蓋率
- **Hooks**: 76.66% 覆蓋率  
- **Utils**: 100% 覆蓋率
- **API Routes**: 完整測試覆蓋

測試涵蓋：
- ✅ React 元件渲染與互動
- ✅ 自訂 Hooks 邏輯
- ✅ API 路由處理
- ✅ 工具函數
- ✅ 表單驗證
- ✅ 日期與時間處理

## 資料庫結構

```sql
CREATE TABLE bookings (
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
```

## License

MIT

