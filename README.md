# 🏢 Company Listings API

A simple Node.js + Express backend with PostgreSQL to manage company listings, supporting features like listing retrieval, shortlisting, and demo data.

---

## 🔧 Tech Stack

- Node.js
- Express
- PostgreSQL
- pg (Node.js PostgreSQL client)
- CORS
- REST API

---

## 📂 Folder Structure

```
project-root/
├── index.js          # Express server
├── package.json      # Dependencies and scripts
└── README.md         # Project documentation
```

---

## 🗄️ PostgreSQL Setup

### ✅ Create Database

```sql
CREATE DATABASE company_listings;
```

### ✅ Switch to Database

```sql
\c company_listings
```

### ✅ Create Table

```sql
CREATE TABLE listing (
  id SERIAL PRIMARY KEY,
  company_name TEXT NOT NULL,
  description TEXT,
  years_of_experience INTEGER,
  amount NUMERIC(10, 2),
  stars INTEGER CHECK (stars >= 0 AND stars <= 5),
  is_shortlisted BOOLEAN DEFAULT FALSE,
  phone_number VARCHAR(15)
);
```

### ✅ Insert Demo Data

```sql
INSERT INTO listing (company_name, description, years_of_experience, amount, stars, is_shortlisted, phone_number)
VALUES
  ('GreenHarvest Ltd.', 'Experts in organic farming machinery.', 5, 125000.00, 4, false, '9876543210'),
  ('AgroFuture Pvt. Ltd.', 'Provides solar-powered irrigation tools.', 8, 210000.00, 5, false, '9123456789'),
  ('EcoGrow Solutions', 'Affordable tractors and support.', 3, 85000.00, 3, false, '9988776655');
```

---

## 🚀 Running the Server

### 🛠 Install Dependencies

```bash
npm install
```

### ▶️ Start the Server

```bash
node index.js
```

Server runs on: `http://localhost:3000`

---

## 📡 API Endpoints

| Method | Route                          | Description                        |
|--------|--------------------------------|------------------------------------|
| GET    | `/api/listings`                | Get all company listings           |
| GET    | `/api/shortlisted`             | Get only shortlisted listings      |
| POST   | `/api/listings/:id/shortlist`  | Mark a listing as shortlisted      |
| POST   | `/api/listings/:id/unshortlist`| Remove listing from shortlisted    |

---

## 📞 Sample Listing Object

```json
{
  "id": 1,
  "company_name": "GreenHarvest Ltd.",
  "description": "Experts in organic farming machinery.",
  "years_of_experience": 5,
  "amount": 125000.00,
  "stars": 4,
  "is_shortlisted": false,
  "phone_number": "9876543210"
}
```

---

## 🧑‍💻 Author

Made with ❤️ by [Rohit Ganguly]

---

## 📜 License

This project is licensed under the MIT License.

