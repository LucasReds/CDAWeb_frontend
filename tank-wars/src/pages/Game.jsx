// App.js or equivalent
import React from 'react';
import PhaserGame from '../components/phaserGame'; // Adjust path as needed

function Game() {
    return (
        <div className="Game">
            <header className="App-header">
                <h1>Phaser Game in React</h1>
            </header>
            <main>
                <PhaserGame />
            </main>
        </div>
    );
}

export default Game;
