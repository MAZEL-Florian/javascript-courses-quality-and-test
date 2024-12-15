const tools = require('./tools.js');
const csv = require('csv-parser');
const fs = require('fs');

class Game {

    static listOfWords = [];

    constructor() {
        this.numberOfTry = 5;
        this.word = '';
        this.wrongGuesses = 0;
        this.unknowWord = '';
        this.guessedLetters = new Set();
        this.score = 1000;
        this.startTime = new Date();
        this.endTime = null;
    }

    static loadWords() {
        return new Promise((resolve, reject) => {
            if (Game.listOfWords.length > 0) {
                resolve();
            } else {
                fs.createReadStream('words_fr.txt')
                    .on('data', (data) => {
                        Game.listOfWords = data.toString().split('\n').map(word => word.toLowerCase());
                    })
                    .on('end', () => {
                        console.log('Fichier de mots chargé avec succès');
                        resolve();
                    })
                    .on('error', reject);
            }
        });
    }

    chooseWord() {
        if (Game.listOfWords.length > 0) {
            const date = new Date();
            const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
            const index = dayOfYear % Game.listOfWords.length;
            this.word = Game.listOfWords[index];
            this.unknowWord = this.word.replace(/./g, '#');
            this.score = 1000;
            this.startTime = new Date();
        } else {
            throw new Error("No words available to choose from.");
        }
    }

    guess(oneLetter) {
        if (!this.word) {
            throw new Error("The word has not been set. Please ensure that the game has been initialized properly.");
        }
        if (this.numberOfTry < 0 || this.numberOfTry > 5) {
            throw new Error("The number of tries must be between 0 and 5");
        }
    
        oneLetter = oneLetter.toLowerCase();
    
        if (oneLetter.length !== 1 || !/[a-z]/.test(oneLetter) || this.guessedLetters.has(oneLetter)) {
            return false;
        }
    
        this.updateScoreWithTime();
        this.guessedLetters.add(oneLetter);
    
        if (this.word.includes(oneLetter)) {
            for (let i = 0; i < this.word.length; i++) {
                if (this.word[i] === oneLetter) {
                    this.unknowWord = tools.replaceAt(this.unknowWord, i, oneLetter);
                }
            }
            console.log(`Guessed correctly: ${oneLetter}, Updated unknown word: ${this.unknowWord}`);
            return true;
        }
    
        this.numberOfTry--;
        this.wrongGuesses++;
        return false;
    }

    updateScoreWithTime() {
        if (this.score <= 0) {
            this.score = 0;
            return;
        }        const currentTime = this.endTime || new Date();
        const timeDiff = Math.floor((currentTime - this.startTime) / 1000);
        this.score = Math.max(0, 1000 - timeDiff - this.wrongGuesses * 50);
    }
    
    print() {
        return this.unknowWord;
    }

    getScore() {
        this.updateScoreWithTime();
        return this.score;
    }
    
    getNumberOfTries() {
        return this.numberOfTry;
    }

    getGuessedLetters() {
        return Array.from(this.guessedLetters).join(', ');
    }
    setUsername(username) {
        const regex = /^[a-zA-Z0-9]+$/;
        if (username.length > 20) {
            throw new Error("Username must not exceed 20 characters");
        }
        if (!regex.test(username)) {
            throw new Error("Username must not contain special characters");
        }
        this.username = username;
    }
    
    reset() {
        this.numberOfTry = 5;
        this.guessedLetters.clear();
        this.score = 1000;
        this.chooseWord();
        return this.numberOfTry;
    }

    hasWon() {
        return this.unknowWord === this.word;
    }

    hasLost() {
        return this.numberOfTry <= 0;
    }
    
    toJSON() {
        return {
            numberOfTry: this.numberOfTry,
            word: this.word,
            unknowWord: this.unknowWord,
            guessedLetters: Array.from(this.guessedLetters),
            score: this.score,
            wrongGuesses: this.wrongGuesses,
            startTime: this.startTime,
            endTime: this.endTime ? this.endTime.toISOString() : null,
        };
    }

    static fromJSON(data) {
        const game = new Game();
        game.numberOfTry = data.numberOfTry;
        game.word = data.word;
        game.unknowWord = data.unknowWord;
        game.guessedLetters = new Set(data.guessedLetters);
        game.score = data.score;
        game.wrongGuesses = data.wrongGuesses;
        game.endTime = data.endTime ? new Date(data.endTime) : null;
        game.startTime = new Date(data.startTime);
    
        return game;
    }
}

module.exports = Game;