// App.js or equivalent
import React, { useContext, useEffect, useState} from "react";
import PhaserGame from "../components/phaserGame"; // Adjust path as needed
import { AuthContext } from "../auth/AuthContext";
import axios from "axios";
import Store from "../components/store";
import './Game.css'; // Make sure to import your CSS file

const Game = () => {
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  const openStore = () => {
    console.log("Store opened");
    setIsStoreOpen(true);
  };

  const closeStore = () => {
    console.log("Store closed");
    setIsStoreOpen(false);
  };

  return (
    <div className="Game">
      <header className="App-header">
        {/* Header content can go here */}
      </header>
      {isStoreOpen && <Store isOpen={isStoreOpen} onClose={closeStore} />}
      <div className="game-container" style={{ display: isStoreOpen ? 'none' : 'block' }}>
        <PhaserGame />
      </div>
      <button className="open-store-button" onClick={openStore}>Open Store</button>
    </div>
  );
};

export default Game;