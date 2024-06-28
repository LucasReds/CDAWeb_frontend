// App.js or equivalent
import React, { useContext, useEffect, useState} from "react";
import PhaserGame from "../components/phaserGame"; // Adjust path as needed
import { AuthContext } from "../auth/AuthContext";
import axios from "axios";
import Store from "../components/store";
import './Game.css'; // Make sure to import your CSS file
import WinnerDisplay from "../components/winnerDisplay";

const Game = () => {
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [turnStage, setTurnStage] = useState("null");
  const [showWinner, setShowWinner] = useState(false);
  const [winner, setWinner] = useState("");

  const openStore = () => {
    console.log("Store opened");
    setIsStoreOpen(true);
    window.dispatchEvent(new Event('store-opened'));
  };

  const closeStore = () => {
    console.log("Store closed");
    setIsStoreOpen(false);
    window.dispatchEvent(new Event('store-closed'));
  };


  useEffect(() => {
    const handleTurnStageChange = (event) => {
      setTurnStage(event.detail);
      //console.log(event.detail)
    };

    const handleWinner = (event) => {
      setWinner(event.detail);
      setShowWinner(true);
    }

    window.addEventListener('turnStageChanged', handleTurnStageChange);
    window.addEventListener('winner', handleWinner);

    return () => {
      window.removeEventListener('turnStageChanged', handleTurnStageChange);
      window.removeEventListener('winner', handleWinner);
    };
  }, []);

  const handleClose = () => {
    setShowWinner(false);
  };

  return (
    <div className="Game">
      <header className="App-header">
        {/* Header content can go here */}
      </header>
      {isStoreOpen && <Store isOpen={isStoreOpen} onClose={closeStore} />}
      <WinnerDisplay show={showWinner} winner={winner} onClose={handleClose} />
      <div className={`game-container ${isStoreOpen ? 'hidden' : ''}`}>
        <PhaserGame />
      </div>
      <button className="open-store-button" onClick={openStore} disabled={turnStage !== 'buy'}>Open Store</button>
    </div>
  );
};

export default Game;