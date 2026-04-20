# TipFlow

TipFlow is a full-stack web application built for restaurant workers to track tips, hours worked, wage earned, and personal performance in a practical and structured way.

It was created around a real-world problem: servers and bartenders often know they are making money, but they do not have a clean system to understand **how much they are really earning per shift, per hour, per week, or per month**.

---

## Why TipFlow exists

Income in the restaurant industry is highly variable.

A worker may remember a “good night” or a “bad night,” but memory is not enough to improve performance over time. TipFlow helps turn daily work into usable data:

- log each shift
- calculate hours worked
- estimate wage earned
- track total tips
- review stats by period
- generate AI-based insight from shift history

This project is being developed as a real product inspired by real restaurant operations.

---

## Current Features

### Authentication
- User registration
- User login
- JWT-based protected routes
- Frontend session persistence with local storage

### Shift Tracking
- Create a shift with:
  - shift date
  - start time
  - end time
  - break minutes
  - total tips
  - role multiplier
- Automatic hours calculation
- Support for shifts that cross midnight
- Automatic wage calculation based on user day rate
- Tip distribution logic using weighted points

### Dashboard
- Total tips earned today
- Total shifts tracked
- Total amount earned in tips
- Recent shifts list
- AI insight block

### Stats
- Performance view by:
  - week
  - month
  - year
- Total tips
- Total hours
- Average per hour
- Total wage earned
- Daily breakdown

### AI Insight
- Backend endpoint for AI-generated shift analysis
- Designed to provide a short motivational and practical insight based on historical shift data
- Requires `ANTHROPIC_API_KEY` in backend environment variables

---

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios

### Backend
- Python
- Flask
- Flask-JWT-Extended
- Flask-SQLAlchemy
- Flask-CORS
- Flask-Limiter

### Database
- SQLite (current development setup)

---

## Project Structure

```text
TipFlow/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── config.py
│   │   ├── db.py
│   │   └── app.py
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── .env.example
├── .gitignore
└── README.md