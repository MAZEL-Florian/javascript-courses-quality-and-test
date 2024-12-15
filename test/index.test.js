
const request = require('supertest');
const app = require('../index');
const Game = require('../game.js');

beforeAll(async () => {
    await Game.loadWords();
});

describe('Tests for the Express server', () => {

    test('GET / - should return the main page', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });

    test('POST /addTestData - should add test data', async () => {
        const data = { pseudo: 'TestUser', score: 500 };
        const response = await request(app).post('/addTestData').send(data);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.topScores).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ pseudo: 'TestUser', score: 500 })
            ])
        );
    });

    test('POST /addTestData - should return an error for invalid input', async () => {
        const data = { pseudo: '', score: 'invalidScore' };
        const response = await request(app).post('/addTestData').send(data);
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Pseudo ou score invalide");
    });

    test('GET /updateScore - should return an error when no game is ongoing', async () => {
        const response = await request(app).get('/updateScore');
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Aucune partie en cours.");
    });

    test('POST /saveScore - should return an error for an invalid pseudo', async () => {
        const response = await request(app).post('/saveScore').send({ pseudo: '' });
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe("Veuillez entrer un pseudo pour enregistrer votre score.");
    });

    test('POST / - should reset the game if requested', async () => {
        const session = { gameData: { word: 'test', numberOfTry: 3 } };
        app.request.session = session;

        const response = await request(app).post('/').send({ reset: true });
        expect(response.statusCode).toBe(200);
        expect(app.request.session.scoreAlreadySaved).toBe(false);
    });

    test('POST /saveScore - should return an error for a pseudo that is too short', async () => {
        const response = await request(app).post('/saveScore').send({ pseudo: 'abc' });
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe("Le pseudo doit être compris entre 4 et 20 caractères.");
    });

    test('POST /saveScore - should return an error for a pseudo that is too long', async () => {
        const response = await request(app).post('/saveScore').send({ pseudo: 'a'.repeat(21) });
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe("Le pseudo doit être compris entre 4 et 20 caractères.");
    });

    test('GET /updateScore - should return the current score when the game is ongoing', async () => {
        const game = new Game();
        game.word = 'test';
        game.score = 100;
        game.numberOfTry = 1;
        game.guessedLetters = ['t'];

        app.request.session = { gameData: game.toJSON() };

        const response = await request(app).get('/updateScore');
        expect(response.statusCode).toBe(200);
        expect(response.body.score).toBeGreaterThanOrEqual(0);
        expect(response.body.end).toBe(false);
    });

    test("POST / - should return an error if the user enters multiple letters", async () => {
        const session = { gameData: { word: 'test', numberOfTry: 3 } };
        app.request.session = session;

        const response = await request(app).post('/').send({ word: 'ab' });
        expect(response.statusCode).toBe(200);

        expect(response.text).toContain("Vous ne pouvez entrer qu&#39;une seule lettre.");
    });

    test("POST /saveScore - should return an error if the score is already saved", async () => {
        const session = { gameData: { word: 'test', score: 200 }, scoreAlreadySaved: true };
        app.request.session = session;

        const response = await request(app).post('/saveScore').send({ pseudo: 'TestUser' });
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe("Le score a déjà été sauvegardé.");
    });

    test("POST /saveScore - should update the session after adding the score", async () => {
        const game = new Game();
        game.word = 'test';
        game.score = 200;
        game.numberOfTry = 1;
        game.guessedLetters = ['t'];

        app.request.session = { gameData: game.toJSON(), scoreAlreadySaved: false };

        const response = await request(app).post('/saveScore').send({ pseudo: 'AnotherUser' });
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

        expect(app.request.session.scoreAlreadySaved).toBe(true);
    });

    test("POST /saveScore - should return error if score already saved", async () => {
        const session = { gameData: { word: 'test', score: 300 }, scoreAlreadySaved: true };
        app.request.session = session;

        const response = await request(app).post('/saveScore').send({ pseudo: 'DuplicateUser' });
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe("Le score a déjà été sauvegardé.");
    });

    test('POST / - should create a new instance of Game if no ongoing game', async () => {
        app.request.session = {};

        const response = await request(app).post('/').send({});

        expect(response.statusCode).toBe(200);
        expect(app.request.session.gameData).toBeDefined();
        expect(app.request.session.gameData.word).toBeDefined();
    });

    test("POST / - should accept a guess when the game is ongoing", async () => {
        const game = new Game();
        game.word = 'test';
        game.guessedLetters = ['t'];
        game.score = 100;
        game.numberOfTry = 1;

        app.request.session = {
            gameData: game.toJSON(),
            hasPlayed: false,
        };

        const response = await request(app).post('/').send({ word: 'e' });
        expect(response.statusCode).toBe(200);
        expect(app.request.session.gameData.guessedLetters).toEqual(['t', 'e']);
        expect(app.request.session.gameData.score).toBeGreaterThan(100);
    });

    test("POST / - should return a 500 error in case of an exception", async () => {
        const session = { gameData: { word: 'test', numberOfTry: 3 } };
        app.request.session = session;

        const mockFromJSON = jest.spyOn(Game, 'fromJSON').mockImplementation(() => {
            throw new Error("Erreur simulée pour test");
        });

        const response = await request(app).post('/').send({ word: 'a' });

        expect(response.statusCode).toBe(500);
        expect(response.text).toContain("Erreur simulée pour test");

        mockFromJSON.mockRestore();
    });
    
    test("POST / - should return an error if the user has already played and tries to reset the game", async () => {
        const session = { gameData: { word: 'test', numberOfTry: 3 }, hasPlayed: true };
        app.request.session = session;

        const response = await request(app).post('/').send({ reset: true });
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("Vous avez déjà joué. Revenez demain pour un nouveau mot.");
    });

    test("POST / - should reset the game if the user has not yet played", async () => {
        const session = { gameData: { word: 'test', numberOfTry: 3 }, hasPlayed: false };
        app.request.session = session;

        const response = await request(app).post('/').send({ reset: true });
        expect(response.statusCode).toBe(200);

        expect(app.request.session.scoreAlreadySaved).toBe(false);
        expect(app.request.session.hasPlayed).toBe(false);
    });


});