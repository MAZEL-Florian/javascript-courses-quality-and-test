const Game = require('../game.js');

let game;

beforeAll(async () => {
    game = new Game();
    await Game.loadWords();
    game.word = "roulade";
    game.unknowWord = "######";
});

describe("Game test", () => {

    test("The word must be 'roulade'", () => {
        expect(game.word).toBe("roulade");
    });

    test("Should throw error if `numberOfTry` is less than 0", () => {
        game.numberOfTry = -1;
        expect(() => game.guess("a")).toThrow("The number of tries must be between 0 and 5");
    });

    test("Should throw error if `numberOfTry` is higher than 5", () => {
        game.numberOfTry = 6;
        expect(() => game.guess("a")).toThrow("The number of tries must be between 0 and 5");
    });

    test("Should throw error if `numberOfTry` is between 0 and 5", () => {
        for (let i = 0; i <= 5; i++) {
            game.numberOfTry = i;
            expect(() => game.guess("a")).not.toThrow();
        }
    });

    test("Should resolve immediately if listOfWords is already populated", async () => {
        Game.listOfWords = ['test', 'word'];

        await expect(Game.loadWords()).resolves.not.toThrow();

        expect(Game.listOfWords).toEqual(['test', 'word']);
    });

    test("Should be 5 tries at the beginning of the game", () => {
        expect(game.getNumberOfTries()).toBe(5);
    });

    test("Test the try mechanic with a correct guess", () => {
        game.guess("a");
        expect(game.getNumberOfTries()).toBe(5);
    });

    test("Test the try mechanic with an incorrect guess", () => {
        game.guess("z");
        expect(game.getNumberOfTries()).toBe(4);
    });

    test("Reset the game, so the number of tries should be 5", () => {
        game.reset();
        expect(game.getNumberOfTries()).toBe(5);
        game.word = "roulade";
        game.unknowWord = "#######";
    });

    test("Should show only 'a' letter after a correct guess", () => {
        game.word = "roulade";
        game.unknowWord = "#######";
        game.guess("a");
        expect(game.print()).toBe("####a##")
    });

    test("Should replace all occurrences of the guessed letter 'e'", () => {
        game.word = "elephant";
        game.unknowWord = "########";
        game.guess("e");
        expect(game.print()).toBe("e#e#####");
    });

    test("Should decrement number of tries after an incorrect guess", () => {
        game.word = "apple";
        game.unknowWord = "#####";
        game.guess("x");
        expect(game.getNumberOfTries()).toBe(4);
    });
    test("Should update unknown word correctly after one guess", () => {
        game.reset();
        game.word = "apple";
        game.unknowWord = "#####";
        game.guess("a");
        expect(game.print()).toBe("a####");
    });

    test("Should show all occurrences of letter 'p' in 'apple'", () => {
        game.word = "apple";
        game.unknowWord = "#####";
        game.guess("p");
        expect(game.print()).toBe("#pp##");
    });

    test("Should show full word if all letters guessed", () => {
        game.reset();
        game.word = "apple";
        game.unknowWord = "#####";
        game.guess("a");
        game.guess("p");
        game.guess("l");
        game.guess("e");
        expect(game.print()).toBe("apple");
    });

    test("Should throw an error if no words are available", () => {
        Game.listOfWords = [];
        expect(() => game.chooseWord()).toThrow("No words available to choose from.");
    });

    test("Should throw an error if guess is called without a word being set", () => {
        const newGame = new Game();
        expect(() => newGame.guess("a")).toThrow("The word has not been set. Please ensure that the game has been initialized properly.");
    });

    test("Should reset game with a new word and reset tries", () => {
        Game.listOfWords = ["apple", "banana", "cherry"];
        game.numberOfTry = 2;
        game.reset();
        expect(game.getNumberOfTries()).toBe(5);
        expect(game.word).toBeTruthy();
    });


    test("Should select the same word for all players on the same day", () => {
        const mockDate = new Date(2024, 9, 1);
        jest.useFakeTimers('modern').setSystemTime(mockDate);

        const player1 = new Game();
        const player2 = new Game();

        player1.listOfWords = ["apple", "banana", "cherry"];
        player2.listOfWords = ["apple", "banana", "cherry"];

        player1.chooseWord();
        player2.chooseWord();

        expect(player1.word).toBe(player2.word);
        jest.useRealTimers();
    });

    test("Should return the same word for the same day even after reset", () => {
        const mockDate = new Date(2024, 9, 1);
        jest.useFakeTimers('modern').setSystemTime(mockDate);

        Game.listOfWords = ["apple", "banana", "cherry"];
        game.chooseWord();
        const wordBeforeReset = game.word;

        game.reset();
        expect(game.word).toBe(wordBeforeReset);

        jest.useRealTimers();
    });

    test("Should return a different word the next day", () => {
        const mockDate = new Date(2024, 9, 1);
        jest.useFakeTimers('modern').setSystemTime(mockDate);

        Game.listOfWords = ["apple", "banana", "cherry"];
        game.chooseWord();
        const wordForFirstDay = game.word;

        const nextDay = new Date(2024, 9, 2);
        jest.setSystemTime(nextDay);
        game.chooseWord();
        const wordForNextDay = game.word;

        expect(wordForNextDay).not.toBe(wordForFirstDay);

        jest.useRealTimers();
    });

    test("Should initialize score to 1000", () => {
        expect(game.score).toBe(1000);
    });

    test("Should decrement score with time", () => {
        jest.useFakeTimers();
        game.startTime = new Date();
        jest.advanceTimersByTime(5000);
        game.updateScoreWithTime();
        expect(game.getScore()).toBeLessThan(1000);
        jest.useRealTimers();
    });

    test("Should not allow negative score", () => {
        jest.useFakeTimers();
        game.startTime = new Date();
        jest.advanceTimersByTime(1000000);
        game.updateScoreWithTime();
        expect(game.getScore()).toBe(0);
        jest.useRealTimers();
    });

    test("Should reset score to 1000 after game reset", () => {
        game.score = 500;
        game.reset();
        expect(game.score).toBe(1000);
    });

    test("Should reset guessed letters after reset", () => {
        game.guess("a");
        expect(game.getGuessedLetters()).toContain("a");
        game.reset();
        expect(game.getGuessedLetters()).toBe("");
    });

    test("hasWon should return true if the word is fully guessed", () => {
        game.word = "apple";
        game.unknowWord = "apple";
        expect(game.hasWon()).toBe(true);
    });

    test("hasWon should return false if the word is not fully guessed", () => {
        game.word = "apple";
        game.unknowWord = "app##";
        expect(game.hasWon()).toBe(false);
    });

    test("hasLost should return true if no tries are left", () => {
        game.numberOfTry = 0;
        expect(game.hasLost()).toBe(true);
    });

    test("hasLost should return false if there are still tries left", () => {
        game.numberOfTry = 3;
        expect(game.hasLost()).toBe(false);
    });

    test("Should win the game after guessing all letters correctly", () => {
        game.word = "apple";
        game.unknowWord = "#####";

        game.guess("a");
        game.guess("p");
        game.guess("l");
        game.guess("e");

        expect(game.hasWon()).toBe(true);
    });

    test("Should lose the game after running out of tries", () => {
        game.word = "apple";
        game.numberOfTry = 1;

        game.guess("x");

        expect(game.hasLost()).toBe(true);
    });

    test("The number of tries should always be between 0 and 5", () => {
        game.reset();
        game.guess("z");
        expect(game.getNumberOfTries()).toBeGreaterThanOrEqual(0);
        expect(game.getNumberOfTries()).toBeLessThanOrEqual(5);
    });


    test("Score should always be between 0 and 1000", () => {
        game.score = 1500;
        game.updateScoreWithTime();
        expect(game.getScore()).toBeLessThanOrEqual(1000);

        game.score = -50;
        game.updateScoreWithTime();
        expect(game.getScore()).toBeGreaterThanOrEqual(0);
    });

    test("Score should not decrement below 0 when timer continues", () => {
        game.score = 0;
        jest.useFakeTimers();
        game.startTime = new Date();
        jest.advanceTimersByTime(10000);
        game.updateScoreWithTime();
        expect(game.getScore()).toBe(0);
        jest.useRealTimers();
    });

    test("The word should reset every day at midnight", () => {
        const mockDate = new Date(2024, 9, 1, 23, 59, 59);
        jest.useFakeTimers('modern').setSystemTime(mockDate);

        Game.listOfWords = ["apple", "banana", "cherry", "date", "elderberry"];
        game.chooseWord();
        const wordBeforeMidnight = game.word;

        const nextDay = new Date(2024, 9, 3, 0, 0, 1);
        jest.setSystemTime(nextDay);
        game.chooseWord();
        const wordAfterMidnight = game.word;

        expect(wordAfterMidnight).not.toBe(wordBeforeMidnight);

        jest.useRealTimers();
    });

    test("Username should not be longer than 20 characters", () => {
        const username = "aVeryLongUsernameMoreThan20Chars";
        expect(() => game.setUsername(username)).toThrow("Username must not exceed 20 characters");
    });

    test("Username should not contain special characters", () => {
        const invalidUsername = "user@name";
        expect(() => game.setUsername(invalidUsername)).toThrow("Username must not contain special characters");

        const validUsername = "username";
        expect(() => game.setUsername(validUsername)).not.toThrow();
    });

    test("toJSON should return the correct game state", () => {
        game.reset();
        game.word = "test";
        game.unknowWord = "####";
        game.guessedLetters = new Set(["t", "e"]);
        game.score = 900;
        game.wrongGuesses = 1;
        game.startTime = new Date("2024-11-01T10:00:00Z");
        game.endTime = new Date("2024-11-01T10:05:00Z");

        const expectedJSON = {
            numberOfTry: 5,
            word: "test",
            unknowWord: "####",
            guessedLetters: ["t", "e"],
            score: 900,
            wrongGuesses: 1,
            startTime: new Date("2024-11-01T10:00:00Z"),
            endTime: new Date("2024-11-01T10:05:00Z").toISOString(),
        };

        expect(game.toJSON()).toEqual(expectedJSON);
    });

    test("fromJSON should restore the correct game state", () => {
        const jsonData = {
            numberOfTry: 3,
            word: "apple",
            unknowWord: "a##l#",
            guessedLetters: ["a", "l"],
            score: 800,
            wrongGuesses: 2,
            startTime: "2024-11-01T10:00:00.000Z",
            endTime: "2024-11-01T10:05:00.000Z",
        };

        const restoredGame = Game.fromJSON(jsonData);

        expect(restoredGame.numberOfTry).toBe(3);
        expect(restoredGame.word).toBe("apple");
        expect(restoredGame.unknowWord).toBe("a##l#");
        expect(restoredGame.guessedLetters).toEqual(new Set(["a", "l"]));
        expect(restoredGame.score).toBe(800);
        expect(restoredGame.wrongGuesses).toBe(2);
        expect(restoredGame.startTime.toISOString()).toBe("2024-11-01T10:00:00.000Z");
        expect(restoredGame.endTime.toISOString()).toBe("2024-11-01T10:05:00.000Z");
    });
    
    test("toJSON should return the correct game state as an object", () => {
        game.numberOfTry = 3;
        game.word = "banana";
        game.unknowWord = "b#n#n#";
        game.guessedLetters = new Set(["b", "n"]);
        game.score = 750;
        game.wrongGuesses = 2;
        game.startTime = new Date("2024-11-01T09:00:00.000Z");
        game.endTime = new Date("2024-11-01T09:05:00.000Z");

        const json = game.toJSON();

        expect(json.numberOfTry).toBe(3);
        expect(json.word).toBe("banana");
        expect(json.unknowWord).toBe("b#n#n#");
        expect(json.guessedLetters).toEqual(["b", "n"]);
        expect(json.score).toBe(750);
        expect(json.wrongGuesses).toBe(2);
        expect(json.startTime.toISOString()).toBe("2024-11-01T09:00:00.000Z");
        expect(json.endTime).toBe("2024-11-01T09:05:00.000Z");
    });

    test("toJSON should return the correct object when endTime is set", () => {
        game.numberOfTry = 3;
        game.word = "apple";
        game.unknowWord = "a##l#";
        game.guessedLetters = new Set(["a", "l"]);
        game.score = 800;
        game.wrongGuesses = 2;
        game.startTime = new Date("2024-11-01T10:00:00.000Z");
        game.endTime = new Date("2024-11-01T10:05:00.000Z");

        const jsonData = game.toJSON();

        expect(jsonData.numberOfTry).toBe(3);
        expect(jsonData.word).toBe("apple");
        expect(jsonData.unknowWord).toBe("a##l#");
        expect(jsonData.guessedLetters).toEqual(["a", "l"]);
        expect(jsonData.score).toBe(800);
        expect(jsonData.wrongGuesses).toBe(2);
        expect(jsonData.startTime.toISOString()).toBe("2024-11-01T10:00:00.000Z");
        expect(jsonData.endTime).toBe("2024-11-01T10:05:00.000Z");
    });

    test("toJSON should return null for endTime when it is not set", () => {
        game.endTime = null;

        const jsonData = game.toJSON();

        expect(jsonData.endTime).toBeNull();
    });

    test("fromJSON should handle null endTime correctly", () => {
        const jsonData = {
            numberOfTry: 3,
            word: "banana",
            unknowWord: "b####a",
            guessedLetters: ["b", "a"],
            score: 750,
            wrongGuesses: 1,
            startTime: "2024-11-02T12:00:00.000Z",
            endTime: null,
        };

        const restoredGame = Game.fromJSON(jsonData);

        expect(restoredGame.numberOfTry).toBe(3);
        expect(restoredGame.word).toBe("banana");
        expect(restoredGame.unknowWord).toBe("b####a");
        expect(restoredGame.guessedLetters).toEqual(new Set(["b", "a"]));
        expect(restoredGame.score).toBe(750);
        expect(restoredGame.wrongGuesses).toBe(1);
        expect(restoredGame.startTime.toISOString()).toBe("2024-11-02T12:00:00.000Z");
        expect(restoredGame.endTime).toBeNull();
    });

    test("getGuessedLetters should return a comma-separated list of guessed letters", () => {
        game.reset();
        game.guess("a");
        game.guess("b");
        game.guess("c");
        expect(game.getGuessedLetters()).toBe("a, b, c");
    });

    test("hasWon should return false if the word is partially guessed", () => {
        game.word = "banana";
        game.unknowWord = "ba#a#a";
        expect(game.hasWon()).toBe(false);
    });

    test("hasLost should return true if the number of tries is negative", () => {
        game.numberOfTry = -1;
        expect(game.hasLost()).toBe(true);
    });

    test("Reset should restore the game to its initial state", () => {
        game.numberOfTry = 1;
        game.guessedLetters = new Set(["x"]);
        game.score = 500;
        game.word = "test";
        game.reset();

        expect(game.getNumberOfTries()).toBe(5);
        expect(game.getGuessedLetters()).toBe("");
        expect(game.score).toBe(1000);
        expect(game.word).not.toBe("test");
    });
});