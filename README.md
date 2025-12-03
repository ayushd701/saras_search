# Saras Finance — Vue.js Search Tool

A clean, modular, and responsive search interface built with **Vue 3 + Vite** as part of the Saras Finance Frontend Developer Assignment.

---

## Features

- 🔍 Real-time search with debounce  
- 🌗 Light/Dark mode toggle (persistent)  
- 📱 Fully responsive UI  
- 🎛 Reusable components  
- 🎞 Smooth Vue transitions  
- ⌨ Keyboard navigation (Up/Down/Enter/Esc)   

---

## Tech Stack

- **Vue 3** (Composition API + `<script setup>`)
- **Vite**
- **Plain CSS** (custom themes + responsiveness)
- **JavaScript**
- **Dummy API**

---

## Project Structure

```
saras_search/
├── public/
├── src/
│   ├── components/
│   ├── utils/
│   ├── services/
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── index.html
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ayushd701/saras_search.git
cd saras_search
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:5173
```

##How It Works

### 🔎 `SearchBar.vue`
- Manages user input
- Debouncing to reduce frequent API calls
- Emits search events upward

### 🧩 `App.vue`
- Maintains central state
- Triggers simulated API requests
- Passes results to child components

### 📋 `SearchResultList.vue`
- Displays results in a responsive list
- Supports full keyboard navigation

### 📌 `SearchResultItem.vue`
- Expand/collapse result details
- Smooth transitions + metadata display

### ⏳ `Loader.vue`
- Shows a spinner while data is being fetched

### 🛠️ `api.js`
- Fake API call with random delay
- Returns dynamically generated results

## Author

- Ayush Dixit
