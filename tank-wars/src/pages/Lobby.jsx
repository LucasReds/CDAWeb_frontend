import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../socket";

export default function Lobby() {
  const navigate = useNavigate();
  const { game_id } = useParams();

  const [lobbyState, setLobbyState] = useState(false);
  const [time, setTime] = useState(10);

  const startTimer = () => {
    for (let i = 10; i >= 0; i--) {
      setTimeout(() => {
        setTime(i);
      }, (10 - i) * 1000);
    }
  };

  useEffect(() => {
    if (time === 0) {
      navigate(`/phaser-game/${game_id}`);
    }
  }, [time]);

  useEffect(() => {
    socket.connect();

    socket.on("start-game", (data) => {
      console.log(data);
      setLobbyState(true);
      startTimer();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Lobby</h1>
      <p>Game ID: {game_id}</p>

      {lobbyState ? (
        <div>Starting in {time}</div>
      ) : (
        <div>Waiting for other players...</div>
      )}
    </div>
  );
}
