require('dotenv').config();
const express = require('express');
const path = require('path');
const Game = require('./game.js');

const PORT = process.env.PORT || 3030;

const app = express();
const game = new Game();
const session = require('express-session');

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 86400000 }
}));

// TABLE
let scoresTable = [];

for (let i = 1; i <= 1000; i++) {
    let pseudo = `Joueur ${i}`;
    let score = Math.floor(Math.random() * 1000);
    scoresTable.push({ pseudo, score });
}
sortAndLimitScores();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

function sortAndLimitScores() {
    scoresTable.sort((a, b) => b.score - a.score);
    scoresTable = scoresTable.slice(0, 1000);
}

let scoreAlreadySaved = false;
app.post('/addTestData', (req, res) => {
    const { pseudo, score } = req.body;

    if (!pseudo || !score || isNaN(score)) {
        return res.status(400).json({ error: "Pseudo ou score invalide" });
    }

    scoresTable.push({ pseudo, score: Number(score) });

    sortAndLimitScores();

    return res.json({ success: true, topScores: scoresTable });
});

app.get('/', (req, res) => {
    let game;
    if (!req.session.gameData) {
        game = new Game();
        game.chooseWord();
        req.session.gameData = game.toJSON();
    } else {
        game = Game.fromJSON(req.session.gameData);
    }

    const hasWon = game.hasWon();
    const hasLost = game.hasLost();

    const errorMessage = null;

    const showPseudoInput = hasWon && !req.session.scoreAlreadySaved;

    res.render('pages/index', {
        game: game.print(),
        word: hasWon || hasLost ? game.word : null,
        numberOfTries: game.getNumberOfTries(),
        guessedLetters: game.getGuessedLetters(),
        score: game.getScore(),
        hasWon,
        endTime: game.endTime,
        hasLost,
        startTime: game.startTime,
        wrongGuesses: game.wrongGuesses,
        showPseudoInput,
        errorMessage,
        topScores: scoresTable
    });
});

app.get('/updateScore', (req, res) => {
    if (!req.session.gameData) {
        return res.status(400).json({ error: "Aucune partie en cours." });
    }

    const game = Game.fromJSON(req.session.gameData);
    const hasWon = game.hasWon();
    const hasLost = game.hasLost();

    game.updateScoreWithTime();
    req.session.gameData = game.toJSON();

    res.json({ score: game.getScore(), end: false });
});
app.post('/saveScore', async (req, res) => {
    const { pseudo } = req.body;

    if (!pseudo || pseudo.trim() === "") {
        return res.json({ error: "Veuillez entrer un pseudo pour enregistrer votre score." });
    }
    if (pseudo.trim().length > 20 || pseudo.trim().length < 4) {
        return res.json({ error: "Le pseudo doit être compris entre 4 et 20 caractères." });
    }

    if (req.session.scoreAlreadySaved) {
        return res.json({ error: "Le score a déjà été sauvegardé." });
    }

    let game;

    game = Game.fromJSON(req.session.gameData);

    const score = game.getScore();
    scoresTable.push({
        pseudo: pseudo,
        score: score,
    });

    sortAndLimitScores();
    req.session.scoreAlreadySaved = true;

    res.json({ success: true, topScores: scoresTable });
});



app.post('/', (req, res) => {
    let game;
    if (!req.session.gameData) {
        game = new Game();
        game.chooseWord();
        req.session.gameData = game.toJSON();
    } else {
        game = Game.fromJSON(req.session.gameData);
    }

    let errorMessage = null;

    try {
        if (req.body.reset) {
            if (req.session.hasPlayed) {
                errorMessage = "Vous avez déjà joué. Revenez demain pour un nouveau mot.";
            } else {
                game.reset();
                req.session.scoreAlreadySaved = false;
            }
        } else if (req.body.word) {
            const userInput = req.body.word.trim();

            if (userInput.length !== 1) {
                errorMessage = "Vous ne pouvez entrer qu'une seule lettre.";
            } else {
                game.guess(userInput);
            }
        }

        const hasWon = game.hasWon();
        const hasLost = game.hasLost();
        const showPseudoInput = hasWon && !req.session.scoreAlreadySaved;

        req.session.gameData = game.toJSON();

        res.render('pages/index', {
            game: game.print(),
            word: hasWon || hasLost ? game.word : null,
            numberOfTries: game.getNumberOfTries(),
            guessedLetters: game.getGuessedLetters(),
            score: game.getScore(),
            hasWon,
            hasLost,
            endTime: game.endTime,
            showPseudoInput,
            startTime: game.startTime,
            wrongGuesses: game.wrongGuesses,
            errorMessage,
            topScores: scoresTable
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Une erreur est survenue : " + error.message);
    }
});

module.exports = app;
