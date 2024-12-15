const app = require('./index');
const PORT = process.env.PORT || 3030;
const Game = require('./game.js');

(async () => {
    try {
        await Game.loadWords();
        app.listen(PORT, () => console.log(`Écoute sur http://localhost:${PORT}`));
    } catch (error) {
        console.error("Échec du chargement des mots et du démarrage du serveur :", error);
    }
})();
