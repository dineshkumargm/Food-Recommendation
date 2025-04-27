# 🥗 NutriGlow - Food Recommendation App

Welcome to **NutriGlow**, your personalized guide to healthy eating and smart recipe recommendations!

> Live Demo: [NutriGlow](http://3.111.246.217/)

---

## 📚 Overview
**NutriGlow** is a full-stack web application that helps users discover healthy recipes, manage pantry inventories, interact socially, and get smart, AI-driven meal suggestions. Whether you're hitting the gym or sticking to a diet plan, NutriGlow ensures you always have the right meal inspiration!

---

## 💻 Tech Stack

**Frontend:**
- React.js
- Redux
- Tailwind CSS

**Backend:**
- Node.js
- Express.js

**Database:**
- MongoDB (Self-hosted)

**Authentication:**
- JWT (JSON Web Tokens)

**Hosting:**
- Deployed on an AWS EC2 instance

---

## 💪 Features

### ✨ Core Features:
- **User Authentication:** Secure login and registration using JWT.
- **Recipe Management:** Create, browse, search, and like healthy recipes.
- **Inventory Management:**
  - Track pantry ingredients.
  - Monitor expiration dates.
  - Plan smart shopping lists (upcoming).
- **Social Features:**
  - Search for users.
  - Follow and unfollow functionality.
- **AI-Powered Chatbot:**
  - Suggests recipes based on inventory and diet goals.
  - Decrements ingredients after selecting a recipe.
  - Considers user's gym/diet status.
- **Real-Time Search:** Instant search for users with debounce effect.
- **Beautiful UI:** Responsive, sleek design with Tailwind CSS.

### 🔄 Planned Enhancements:
- Barcode scanning for inventory updates.
- Smart substitutions for missing ingredients.
- Weekly meal planner.
- Mood-based meal planning.

---

## 📚 Project Structure

```bash
frontend/         # React frontend (pages, components, Redux store)
backend/          # Node.js Express backend (routes, controllers, models)
```

---

## 🔧 Installation Guide

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

> Make sure your MongoDB server is running.

---

## 📱 Pages & Navigation
- **Home Dashboard:** View all available recipes.
- **Login/Register:** Authenticate your account.
- **Search Users:** Follow or unfollow users.
- **Inventory:** Manage your pantry and track expiration dates.
- **Chatbot:** Get smart, AI-generated meal suggestions!

---

## 🚀 Live URL
- [http://3.111.246.217/](http://3.111.246.217/)

---

## 🛠️ How It Works
1. **Register or Login** to your account.
2. **Browse Recipes** or **Search for Users**.
3. **Manage Inventory** with ingredients you currently have.
4. **Use the Chatbot** to find recipes that fit your goals and available ingredients.
5. **Follow Friends**, **Like Recipes**, and **Glow with NutriGlow!**

---

## 👨‍💼 Developer Notes
- Usernames are case-sensitive and trimmed to avoid accidental spaces.
- Recipes are liked only once by the same user.
- Real-time search with debounce makes the experience super smooth.
- Token-based authentication ensures security.

---

## 💕 Special Thanks
Thanks for checking out **NutriGlow**! Stay tuned for more updates, features, and enhancements to make healthy eating even easier!

---

# ✨ Happy Cooking and Stay Healthy with NutriGlow!

