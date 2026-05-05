# Gym Zone Gym App

Application web complète pour le gym Gym Zone — React + Vite (frontend) + Express + MongoDB (backend).

---

## 📁 Structure du projet

```
Gym Zone/
├── frontend/          # React + Vite + Tailwind CSS
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── Footer.jsx
│       └── pages/
│           ├── Home.jsx
│           ├── Services.jsx
│           ├── Abonnements.jsx
│           ├── Inscription.jsx
│           └── Contact.jsx
└── backend/           # Express + MongoDB
    ├── models/
    │   ├── User.js
    │   ├── Subscription.js
    │   └── Registration.js
    ├── routes/
    │   ├── registration.js
    │   └── contact.js
    ├── server.js
    └── .env
```

---

## 🚀 Installation & Démarrage

### Prérequis
- Node.js >= 18
- MongoDB installé localement (ou MongoDB Atlas)

---

### 1. Backend

```bash
cd Gym Zone/backend

# Installer les dépendances
npm install

# Configurer .env (déjà créé, modifier si besoin)
# MONGODB_URI=mongodb://localhost:27017/Gym Zone
# PORT=5000

# Démarrer
npm start
```

Le serveur tourne sur: http://localhost:5000

---

### 2. Frontend

```bash
cd Gym Zone/frontend

# Installer les dépendances
npm install

# Démarrer en développement
npm run dev
```

L'app tourne sur: http://localhost:5173

---

## 🗄️ Base de données MongoDB

### Modèles

#### User
| Champ | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Identifiant unique |
| `name` | String | Nom complet |
| `email` | String | Email unique |
| `password` | String | Mot de passe hashé (bcrypt) |
| `phone` | String | Numéro de téléphone |
| `createdAt` | Date | Date de création |

#### Subscription
| Champ | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Identifiant unique |
| `userId` | ObjectId | Référence User |
| `plan` | String | Basic / Pro / Elite |
| `status` | String | active / expired |
| `startDate` | Date | Date de début |
| `endDate` | Date | Date de fin |

#### Registration
| Champ | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Identifiant unique |
| `name` | String | Nom complet |
| `email` | String | Email |
| `phone` | String | Téléphone |
| `selectedPlan` | String | Basic / Pro / Elite |
| `createdAt` | Date | Date d'inscription |

---

## 🔌 API Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/health` | Vérification serveur + DB |
| `POST` | `/api/register` | Créer une inscription |
| `GET` | `/api/register` | Lister toutes les inscriptions |
| `POST` | `/api/contact` | Envoyer un message de contact |

### Exemple POST /api/register
```json
{
  "name": "Mohammed Alami",
  "email": "m.alami@gmail.com",
  "phone": "+212 612 345 678",
  "selectedPlan": "Pro"
}
```

### Exemple POST /api/contact
```json
{
  "name": "Sara Benali",
  "email": "sara@gmail.com",
  "message": "Je souhaite en savoir plus sur le coaching personnalisé."
}
```

---

## 🌐 Pages de l'application

| Page | Route | Description |
|------|-------|-------------|
| Accueil | `/` | Hero + features bento grid |
| Services | `/services` | Présentation des services |
| Abonnements | `/abonnements` | Plans Basic / Pro / Elite |
| Inscription | `/inscription` | Formulaire d'inscription |
| Contact | `/contact` | Formulaire de contact + infos |

---

## 🛠️ Stack technique

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, Mongoose
- **Base de données**: MongoDB
- **Sécurité**: bcryptjs (hash des mots de passe)
- **Fonts**: Space Grotesk + Manrope (Google Fonts)
- **Icônes**: Material Symbols Outlined

---

## ☁️ MongoDB Atlas (optionnel)

Pour utiliser MongoDB Atlas au lieu de local, remplacez dans `.env`:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/Gym Zone
```
