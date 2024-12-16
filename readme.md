# 🔎 Pendutix 📜 - Jeu du Pendu Quotidien

![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Express](https://img.shields.io/badge/Express-4.x-green)
![EJS](https://img.shields.io/badge/EJS-Templating-red)
![Daily Challenge](https://img.shields.io/badge/Daily-Challenge-blue)

## 📝 Description du Projet

Pendutix est un jeu du pendu quotidien unique qui défie votre vocabulaire français et votre rapidité. Chaque jour à minuit, un nouveau mot est généré aléatoirement à partir du dictionnaire français, vous invitant à un défi linguistique renouvelé.

### 🎯 Caractéristiques Uniques

- 🇫🇷 Mots 100% français
- 🕰️ Mot renouvelé quotidiennement à minuit
- 🏆 Système de score dynamique et compétitif
- 📊 Tableau des meilleurs scores
- 🌐 Partage de résultats sur les réseaux sociaux

## 🎮 Règles du Jeu

### 🌟 Objectif
Devinez le mot du jour avec le moins d'erreurs possibles et le plus rapidement possible !

### 🎲 Règles Détaillées

- Le mot est choisi **aléatoirement** dans le dictionnaire français
- **5 essais maximum** pour deviner le mot
- Démarrez avec un **score initial de 1000 points**
- Système de scoring unique :
  - **-1 point par seconde** écoulée
  - **-50 points** pour chaque mauvaise lettre
  - L'objectif : maximiser votre score !

### 🏅 Score et Classement

- Score initial : 1000 points
- Perdez 1 point chaque seconde
- Chaque erreur de lettre coûte 50 points
- Votre score final dépend de votre rapidité et précision

## 🛠 Technologies

- Node.js
- Express.js
- EJS (Templating)
- UIkit (Frontend Framework)
- JavaScript côté client

## 🚀 Installation

```bash
# Clonez le dépôt
git clone https://github.com/votre-username/pendutix.git
cd pendutix

# Installez les dépendances
npm install

# Configurez les variables d'environnement
cp .env.example .env

# Lancez le serveur
npm start
```

🌐 Accédez au jeu : [http://localhost:3030](http://localhost:3030)


## ✨ Fonctionnalités Additionnelles

- 🏆 Système de classement des meilleurs scores
- 📱 Interface responsive
- 🐦 Partage de score sur Twitter
- 📋 Copie du score dans le presse-papier

## 🚧 Roadmap

- [ ] Mode multijoueurs
- [ ] Support international
- [ ] Personnalisation des difficultés
- [ ] Intégration de nouveaux dictionnaires

## 🤝 Contribution

1. Forkez le projet
2. Créez une branche de fonctionnalité
3. Commitez vos modifications
4. Poussez votre branche
5. Ouvrez une Pull Request

## 📜 Licence

Distribué sous licence MIT.

---

**⭐ Relevez le défi quotidien de Pendutix !**