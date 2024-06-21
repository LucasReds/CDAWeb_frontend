import { React, useState, useContext } from "react";
import playButton from "../components/playButton";
import standardButton from "../components/standardButton";
import "./Home.css";
import { Link, redirect, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

function Home() {
  const { userId } = useContext(AuthContext);

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

  const handleClick = () => {
    alert("Button Clicked!");
  };

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
    // llamar a la api endpoint create-public-game
    let gameId;
    axios.post("http://localhost:3000/create-game", gameInfo).then((res) => {
      gameId = res.data.id;
      joinGame(null, gameId, true, false); // join the game `gameId` as host
    });
  };

  const createPrivateGame = () => {
    console.log("Creating private game");
    // llamar a la api endpoint create-private-game
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
        joinGame(code, gameId, true, true); // join the game `gameId` as host
        // redirect(`/lobby/${gameId}`);
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
        console.log(res.data);
        if (res.data.partidaID) {
          console.log("Redirecting to lobby");
          navigate(`/lobby/${res.data.partidaID}`);
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
            <Link onClick={handlePlayClick}>Start Game</Link>
          )}

        {playButtonClicked && (
          <div className="buttons-container">
            <Link onClick={handleCreateClick}>Create Game</Link>
            <Link onClick={handleJoinClick}>Join Game</Link>
            <Link onClick={handlePlayClick}>Back</Link>
          </div>
        )}

        {createButtonClicked && (
          <div className="buttons-container">
            <Link onClick={handleCreatePublicClick}>Create Public Game</Link>
            <Link onClick={handleCreatePrivateClick}>Create Private Game</Link>
            <Link onClick={handleCreateClick}>Back</Link>
          </div>
        )}

        {joinButtonClicked && (
          <div className="buttons-container">
            <Link onClick={(e) => joinGame()}>Join Public Game</Link>
            <Link onClick={handlePrivateJoin}>Join Private Game</Link>
            <Link onClick={handleJoinClick}>Back</Link>
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
            <Link
              onClick={(e) => joinGame(gameInfo.joinCode, null, false, true)}
            >
              Join Private Game
            </Link>
            <Link onClick={handlePrivateJoin}>Back</Link>
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
            <Link onClick={createPrivateGame}>Create Private Game</Link>
            <Link onClick={handleCreatePrivateClick}>Back</Link>
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
            <Link onClick={createPublicGame}>Create Public Game</Link>
            <Link onClick={handleCreatePublicClick}>Back</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
