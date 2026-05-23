<p align="center">
  <img src="app/static/images/logo.png" alt="Pygestor Logo" width="120px" style="border-radius: 20px; box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);"/>
</p>

<h1 align="center">Pygestor</h1>

<p align="center">
  <strong>A Premium, Minimalist Task Manager Built with Python, Flask, & Vanilla CSS.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12+-blue?style=for-the-badge&logo=python&logoColor=white" alt="Python Badge"/>
  <img src="https://img.shields.io/badge/Flask-3.1+-lightgrey?style=for-the-badge&logo=flask&logoColor=white" alt="Flask Badge"/>
  <img src="https://img.shields.io/badge/Docker-Supported-cyan?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Badge"/>
  <img src="https://img.shields.io/badge/UI--UX-Premium--Glassmorphism-purple?style=for-the-badge" alt="UI UX Badge"/>
</p>

---

## 🌟 Overview

**Pygestor** is a modern, high-fidelity Kanban-style task manager designed for professionals. Built from scratch with Python (Flask) and SQLite, it features a custom-built, premium **Glassmorphism Dark Theme** using Vanilla CSS, complete with elegant micro-animations and glowing neon accents. 

It demonstrates solid software engineering patterns including user authentication, SQLite database relations, internationalization (i18n), and containerized deployment with Docker.

---

## ✨ Features

- **🔐 Robust Authentication:** Secure User Sign-In and Registration powered by `Flask-Login` and `Werkzeug` (using secure `pbkdf2:sha256` password hashing).
- **💼 Data Isolation:** Each user has their own private workspace. Tasks are fully secure and isolated by user ID database relationships.
- **🌐 Dual-Language Support (i18n):** Professionally translated using `Flask-Babel`. Toggle between **English** (default) and **Spanish** dynamically with a single click.
- **📊 Interactive Kanban Board:** Tasks are organized into visual columns (*Pending*, *In Progress*, and *Completed*) with quick-action status updates.
- **🎨 Ultra-Premium UI:** No heavy external CSS frameworks. Hand-crafted with modern Vanilla CSS, featuring:
  - Futuristic glassmorphism card components (`backdrop-filter`).
  - Subtle interactive micro-animations (logo hover glow, smooth transitions).
  - Clean typography using Google's *Outfit* font family.
- **🐳 Production Ready (Docker):** Comes pre-configured with a custom `Dockerfile` and `docker-compose.yml` for instant, containerized hosting.

---

## 🛠️ Tech Stack

- **Backend:** Python 3.12+, Flask 3.1, Flask-SQLAlchemy, Flask-Login, Flask-Babel
- **Database:** SQLite (default) / supports any SQL engine via connection string
- **Server:** Gunicorn (production WSGI server)
- **Frontend:** HTML5, Vanilla CSS3 (custom CSS variables & gradients)
- **DevOps:** Docker, Docker Compose

---

## 🚀 Getting Started

You can run **Pygestor** either locally in a Python virtual environment or using Docker.

### Option A: Running with Docker (Recommended for Hosting)

Pygestor is fully containerized and includes a volume mount for persistent database storage.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Pygestor.git
   cd Pygestor
   ```

2. **Configure your environment:**
   Create a `.env` file in the root directory (based on `.env.example` or just copy the keys):
   ```env
   SECRET_KEY=your_super_secret_random_key
   ```

3. **Launch the app:**
   ```bash
   docker compose up -d --build
   ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:8090`.

---

### Option B: Local Development (Manual Setup)

1. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Compile translations (Babel):**
   ```bash
   pybabel compile -d app/translations
   ```

4. **Run the development server:**
   ```bash
   python run.py
   ```

5. **Access the application:**
   Navigate to `http://127.0.0.1:5000` in your web browser.

---

## 📂 Project Structure

```
Pygestor/
│
├── app/
│   ├── static/
│   │   ├── css/
│   │   │   └── styles.css          # Custom premium CSS styling
│   │   └── images/
│   │       └── logo.png            # Textless brandmark logo
│   │
│   ├── templates/                  # Jinja2 HTML templates
│   │   ├── base.html
│   │   ├── index.html
│   │   ├── login.html
│   │   └── register.html
│   │
│   ├── translations/               # Babel compiled translation binary (.mo) & PO catalog
│   │
│   ├── __init__.py                 # Flask App factory & initialization
│   ├── models.py                   # SQLAlchemy Models (User, Task)
│   └── routes.py                   # View controller routes & business logic
│
├── Dockerfile                      # Production build instructions
├── docker-compose.yml              # Container orchestration & volume bindings
├── babel.cfg                       # Babel translation extraction rules
├── requirements.txt                # Python package list
├── run.py                          # Server entrypoint
└── README.md                       # This document!
```

---

## 🔒 Security & Best Practices

- **Sensitive Data:** All secrets (`SECRET_KEY`) are kept in a local `.env` file which is ignored by `.gitignore`.
- **Database Security:** Direct SQL queries are avoided. Database interactions are fully structured using SQLAlchemy ORM to prevent SQL Injection.
- **Passcodes:** User passwords are never saved in plain text. They are hashed using robust cryptographic algorithms.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
