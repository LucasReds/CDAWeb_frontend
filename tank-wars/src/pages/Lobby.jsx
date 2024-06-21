import { useParams } from "react-router-dom";

export default function Lobby() {
  const { game_id } = useParams();
  return (
    <div>
      <h1>Lobby</h1>
      <p>Game ID: {game_id}</p>
    </div>
  );
}
