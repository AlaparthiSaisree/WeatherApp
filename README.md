# 🌤️ Weather App

A full-stack weather web application built with **HTML, CSS, JavaScript (frontend)** and **Node.js, Express, MongoDB (backend)**. This app allows users to search the current weather and a 5-day forecast for any location, save results, and manage stored weather records with full CRUD functionality.

---

## ✅ Features

### 📍 Location-Based Weather:

* Search by city, ZIP code, landmark, or GPS coordinates
* Fetches real-time weather data from the **OpenWeather API**

### 📆 Forecast:

* Displays a clean 5-day forecast at noon for each day

### 📦 CRUD Functionality:

* **Create**: Save weather info by entering a location and date range
* **Read**: View previously saved weather records
* **Update**: Edit saved date ranges for a location
* **Delete**: Remove stored records

### 🌍 Optional Enhancements (Supported):

* Responsive UI with minimal styling
* Weather icons/images

---

## 🛠 Tech Stack

### Frontend:

* HTML5 + CSS3
* Vanilla JavaScript

### Backend:

* Node.js + Express
* MongoDB with Mongoose

### API:

* [OpenWeatherMap API](https://openweathermap.org/api)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/weather-app.git
cd weather-app
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

#### Create a `.env` file with:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
API_KEY= your_api_key
```

#### Run Backend:

```bash
node server.mjs
```

### 3. Set Up the Frontend

```bash
cd ../frontend
Open index.html in a browser
```

> 🔐 Make sure to replace the `apiKey` in `script.js` with your OpenWeather API key.

---

## 📁 Project Structure

```
weather-app/
├── backend/
│   ├── models/
|   ├── routes/
|   ├── .env
│   ├── db.mjs
│   └── server.mjs
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── README.md
```

---

## 🧪 Future Improvements

* Export weather data as CSV/JSON/PDF
* Embed Google Maps or show nearby landmarks
* Add user authentication
* Deploy with MongoDB Atlas and Vercel/Render

---

## 🤝 Contact

Saisree Alaparthi
[LinkedIn](https://www.linkedin.com/in/saisreealaparthi)
[saisree.alaparthi@gmail.com](mailto:saisree.alaparthi@gmail.com)

---

> **Note**: This project was created for a technical assessment. All data is real-time from the OpenWeather API and stored in MongoDB.
