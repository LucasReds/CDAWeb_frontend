import { useEffect, useRef, useContext, useState } from "react";
import TankWarsScene from "../phaser/phaser";
import { useParams } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import axios from "axios";
import { socket } from "../socket";

export default function PhaserGame(store) {
  const { isStoreOpen, openStore, closeStore } = store;
  const gameRef = useRef(null);

  const { game_id } = useParams();
  const { userId, playerId } = useContext(AuthContext);

  const [gameInitData, setGameInitData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function registerNewPosition(player, gameId, x, y) {
    const response = await axios.put("https://cdaweb-backend.onrender.com/move", {
      partidaId: gameId,
      playerId: player,
      newPosition: {
        x: x,
        y: y,
      },
    });

    if (response.data.message === "Not enough gas!") {
      return { result: false, newGas: null, message: response.data.message };
    } else if (response.data.message === "Move stage completed") {
      return {
        result: true,
        newGas: response.data.newGas,
        message: response.data.message,
      };
    } else {
      return {
        result: false,
        newGas: null,
        message: "error during move stage",
      };
    }
  }

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

    // recibir datos
    socket.on("enemy-move", (data) => {
      console.log(data);
    });

    // iniciar partida en la api (SOLO HOST HACE CAMBIOS)
    try {
      axios
        .get("https://cdaweb-backend.onrender.com/initialize-game", {
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
    console.log("local-user: ", playerId);
    if (gameInitData) {
      const gameConfig = {
        type: Phaser.AUTO,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        width: 1200,
        height: 600,
        physics: {
          default: "matter",
          matter: {
            debug: false,
            enableSleeping: true,
          },
        },
        scene: new TankWarsScene({
          partida_id: game_id,
          socket: socket,
          local_player_id: playerId,
          path: gameInitData.path,
          gameName: gameInitData.gameName,
          player1_id: gameInitData.player1,
          player2_id: gameInitData.player2,
          isStoreOpen: isStoreOpen,
          openStore: openStore,
          closeStore: closeStore,
          registerNewPosition: registerNewPosition,
        }),
      };

      gameRef.current = new Phaser.Game(gameConfig);
      setLoading(false);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [gameInitData, isStoreOpen, openStore, closeStore]);

  return loading ? <div>LOADING... </div> : <div id="phaser-container" />;
}
