import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";
import "./Home.css";

function Home() {
  const { userId, setPlayerId } = useContext(AuthContext);

  const [playButtonClicked, setPlayButtonClicked] = useState(false);
  const [createButtonClicked, setCreateButtonClicked] = useState(false);
  const [joinButtonClicked, setJoinButtonClicked] = useState(false);

  const [createPrivateButtonClicked, setCreatePrivateButtonClicked] =
    useState(false);
  const [createPublicButtonClicked, setCreatePublicButtonClicked] =
    useState(false);
  const [joinPrivateButtonClicked, setJoinPrivateButtonClicked] =
    useState(false);

  const [gameInfo, setGameInfo] = useState({
    name: "",
    joinCode: null,
  });

  const navigate = useNavigate();

  const handlePlayClick = () => {
    setPlayButtonClicked((prev) => !prev);
  };

  const handleCreateClick = () => {
    setCreateButtonClicked((prev) => !prev);
    setPlayButtonClicked(false);
  };

  const handleJoinClick = () => {
    setJoinButtonClicked((prev) => !prev);
    setPlayButtonClicked(false);
  };

  const handleCreatePrivateClick = () => {
    setCreatePrivateButtonClicked((prev) => !prev);
    setCreateButtonClicked(false);
    setGameInfo({
      name: "",
      joinCode: null,
    });
  };

  const handleCreatePublicClick = () => {
    setCreatePublicButtonClicked((prev) => !prev);
    setCreateButtonClicked(false);
    setGameInfo({
      name: "",
      joinCode: null,
    });
  };

  const handlePrivateJoin = () => {
    setJoinPrivateButtonClicked((prev) => !prev);
    setJoinButtonClicked(false);
    setGameInfo({
      name: "",
      joinCode: null,
    });
  };

  const createPublicGame = () => {
    console.log("Creating public game");
    let gameId;
    axios.post("http://localhost:3000/create-game", gameInfo).then((res) => {
      gameId = res.data.id;
      joinGame(null, gameId, true, false);
    });
  };

  const createPrivateGame = () => {
    console.log("Creating private game");
    const code = gameInfo.joinCode;
    let gameId;
    axios
      .post("http://localhost:3000/create-game", {
        ...gameInfo,
        isPrivate: true,
      })
      .then((res) => {
        console.log(res.data);

        if (res.data === "Code already exists") {
          alert("Game code already exists");
          setGameInfo({
            name: "",
            joinCode: null,
          });
          return;
        }
        gameId = res.data.id;
        joinGame(code, gameId, true, true);
      });
  };

  const joinGame = (
    code = null,
    gameId = null,
    isHost = false,
    isPrivate = false
  ) => {
    console.log("joining to: ", gameId, " as host: ", isHost);
    axios
      .post("http://localhost:3000/join-game", {
        gameId: gameId,
        private: isPrivate,
        isHost: isHost,
        code: code,
        user_id: userId,
      })
      .then((res) => {
        console.log("join data: ", res.data);
        if (res.data.playerId) {
          setPlayerId(res.data.playerId);
        }
        if (res.data.data.partidaID) {
          console.log("Redirecting to lobby");
          navigate(`/lobby/${res.data.data.partidaID}`);
        }
      });
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="title">
        <h1>Tank Wars</h1>

        {!playButtonClicked &&
          !createButtonClicked &&
          !joinButtonClicked &&
          !createPrivateButtonClicked &&
          !createPublicButtonClicked &&
          !joinPrivateButtonClicked && (
            <button className="play-button" onClick={handlePlayClick}>
              Start Game
            </button>
          )}

        {playButtonClicked && (
          <div className="buttons-container">
            {userId && userId !== "null" ? (
              <button className="play-button" onClick={handleCreateClick}>
                Create Game
              </button>
            ) : (
              <p>ONLY LOGGED IN USERS CAN CREATE GAMES !</p>
            )}
            <button className="play-button" onClick={handleJoinClick}>
              Join Game
            </button>
            <button className="play-button" onClick={handlePlayClick}>
              Back
            </button>
          </div>
        )}

        {createButtonClicked && (
          <div className="buttons-container">
            <button className="play-button" onClick={handleCreatePublicClick}>
              Create Public Game
            </button>
            <button className="play-button" onClick={handleCreatePrivateClick}>
              Create Private Game
            </button>
            <button className="play-button" onClick={handleCreateClick}>
              Back
            </button>
          </div>
        )}

        {joinButtonClicked && (
          <div className="buttons-container">
            <button className="play-button" onClick={() => joinGame()}>
              Join Public Game
            </button>
            <button className="play-button" onClick={handlePrivateJoin}>
              Join Private Game
            </button>
            <button className="play-button" onClick={handleJoinClick}>
              Back
            </button>
          </div>
        )}

        {joinPrivateButtonClicked && (
          <div className="buttons-container">
            <form className="game-info-form">
              <label htmlFor="gameCode">Game Code: </label>
              <input
                type="text"
                id="gameCode"
                name="gameCode"
                onChange={(e) => {
                  setGameInfo((prev) => ({
                    ...prev,
                    joinCode: e.target.value,
                  }));
                }}
              />
            </form>
            <button
              className="play-button"
              onClick={() => joinGame(gameInfo.joinCode, null, false, true)}
            >
              Join Private Game
            </button>
            <button className="play-button" onClick={handlePrivateJoin}>
              Back
            </button>
          </div>
        )}

        {createPrivateButtonClicked && (
          <div className="buttons-container">
            <form className="game-info-form">
              <label htmlFor="gameCode">Game Code: </label>
              <input
                type="text"
                id="gameCode"
                name="gameCode"
                onChange={(e) => {
                  setGameInfo((prev) => ({
                    ...prev,
                    joinCode: e.target.value,
                  }));
                }}
              />
              <label htmlFor="gameName">Game Name: </label>
              <input
                type="text"
                id="gameName"
                name="gameName"
                onChange={(e) => {
                  setGameInfo((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                }}
              />
            </form>
            <button className="play-button" onClick={createPrivateGame}>
              Create Private Game
            </button>
            <button className="play-button" onClick={handleCreatePrivateClick}>
              Back
            </button>
          </div>
        )}

        {createPublicButtonClicked && (
          <div className="buttons-container">
            <form className="game-info-form">
              <label htmlFor="gameName">Game Name: </label>
              <input
                type="text"
                id="gameName"
                name="gameName"
                onChange={(e) => {
                  setGameInfo((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                }}
              />
            </form>
            <button className="play-button" onClick={createPublicGame}>
              Create Public Game
            </button>
            <button className="play-button" onClick={handleCreatePublicClick}>
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
