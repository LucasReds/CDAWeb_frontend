import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../socket";
import "./Lobby.css";
import { AuthContext } from "../auth/AuthContext";

export default function Lobby() {
  const navigate = useNavigate();
  const { game_id } = useParams();

  const { userId, playerId } = useContext(AuthContext);
  const [lobbyState, setLobbyState] = useState(false);
  const [tanks, setTanks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState(5);

  const startTimer = () => {
    for (let i = 5; i >= 0; i--) {
      setTimeout(() => {
        setTime(i);
      }, (5 - i) * 1000);
    }
  };

  useEffect(() => {
    if (time === 0) {
      // fetch("https://cdaweb-backend.onrender.com/update-tank-selection", {
      //   method: "POST",
      //   body: {
      //     tank_id: selected,
      //     game_id: game_id,
      //     userId:
      //   }
      // })

      navigate(`/phaser-game/${game_id}`);
    }
  }, [time]);

  useEffect(() => {
    console.log(userId, playerId);
    // join game ROOM on server
    socket.emit("join-lobby", { partida_id: game_id });

    // recibir start game event
    socket.on("start-game", (data) => {
      console.log(data);
      setLobbyState(true);
      startTimer();
    });

    // pedir info de los tanques
    fetch("https://cdaweb-backend.onrender.com/get-tanks")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTanks(data);
      });

    return () => {
      socket.emit("leave-lobby", { partida_id: game_id });
    };
  }, []);

  return (
    <div className="lobby">
      <h1>Lobby</h1>
      <p>Game ID: {game_id}</p>

      {lobbyState ? (
        <div>Game starting in {time}...</div>
      ) : (
        <div>Waiting for other players...</div>
      )}
      <h1>Choose your tank</h1>
      <div className="tank-selector-container">
        {tanks ? (
          tanks.map((tank) => (
            <div
              key={tank.id}
              className={`tank-card ${
                tank.id === selected ? "selected" : null
              }`}
              onClick={() => setSelected(tank.id)}
            >
              <h3>Tank {tank.id}</h3>

              <div className="tank-grid">
                <div>
                  PWR <span>{tank.power}</span>
                </div>
                <div>
                  ACC <span>{tank.accuracy}</span>
                </div>
                <div>
                  HP <span>{tank.hp}</span>
                </div>
                <div>
                  FUEL <span>{tank.maxFuel}</span>
                </div>
                <div>
                  SPD <span> {tank.speed}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>"Loading Tanks..."</div>
        )}
      </div>
    </div>
  );
}
