import { useEffect, useRef, useContext, useState } from "react";
import TankWarsScene from "../phaser/phaser";
import { useParams } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import axios from "axios";
import { socket } from "../socket";

export default function TestPhaser() {
  const gameRef = useRef(null);

  const { game_id } = useParams();
  const { userId } = useContext(AuthContext);

  const [gameInitData, setGameInitData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // -----------------------------------------
    // revisar si usuario es parte de la partida
    // -----------------------------------------

    // conectar jugador a la sala de partida
    socket.emit("join-game", { partida_id: game_id });
    socket.on("game-setup", (data) => {
      console.log(data);
      setGameInitData(data);
    });

    // iniciar partida en la api (SOLO HOST HACE CAMBIOS)
    try {
      axios
        .get("http://localhost:3000/initialize-game", {
          params: {
            userId: userId,
            gameId: game_id,
          },
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => console.log(res.data));
    } catch (err) {
      console.log(err);
    }

    return () => {
      // desconectar jugador de la sala de partida
      socket.emit("leave-game", { partida_id: game_id });
    };
  }, []);

  // esperar los datos de la partida para cargar el juego
  useEffect(() => {
    if (gameInitData) {
      const gameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
          default: "matter",
          matter: {
            debug: false,
            enableSleeping: true,
          },
        },
        scene: new TankWarsScene({
          path: gameInitData.path,
          gameName: gameInitData.gameName,
          player1_id: gameInitData.player1,
          player2_id: gameInitData.player2,
        }),
      };

      gameRef.current = new Phaser.Game(gameConfig);
      setLoading(false);
    }

    return () => {
      // Clean up Phaser game instance when component unmounts
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [gameInitData]);

  return loading ? <div>LOADING... </div> : <div id="phaser-container" />;
}
