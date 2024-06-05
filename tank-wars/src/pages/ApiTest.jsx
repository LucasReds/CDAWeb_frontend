import { useState } from "react";
import StandardButton from "../components/standardButton";
import axios from "axios";
import { Link } from "react-router-dom";


export default function ApiTest() {
  const [loading, setLoading] = useState(false);
  const [endpoint, setEndpoint] = useState("/buy");
  const [inputValue, setInputValue] = useState({
    x1: null,
    y1: null,
    x2: null,
    y2: null,
    playerId: null,
    boughtItems: null,
    moneySpent: null,
    playerBalance: null,
    currentGas: null,
    coord_x: null,
    coord_y: null,
    proyectileRadius: null,
    proyectileDamage: null,
  });
  const [response, setResponse] = useState(null);

  const inputList = {
    "/buy": ["playerId", "boughtItems", "moneySpent", "playerBalance"],
    "/move": ["playerId", "x1", "y1", "x2", "y2", "currentGas"],
    "/collission": [
      "playerId",
      "coord_x",
      "coord_y",
      "proyectileRadius",
      "proyectileDamage",
    ],
  };

  function handleApiTest(endpoint, e) {
    e.preventDefault();
    console.log(`Testing ${endpoint}`);
    console.log(inputValue);

    const requestParams = {};
    inputList[endpoint].forEach((input) => {
      if (inputValue[input] !== null) {
        requestParams[input] = inputValue[input];
      }
    });

    setLoading(true);
    try {
      axios
        .post(`http://localhost:3000${endpoint}`, requestParams)
        .then((res) => {
          console.log(res.data);
          setResponse(res.data);
        });
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  function resetInput() {
    setInputValue((prev) => ({
      ...prev,
      x1: null,
      y1: null,
      x2: null,
      y2: null,
      boughtItems: null,
      moneySpent: null,
      playerBalance: null,
      currentGas: null,
      coord_x: null,
      coord_y: null,
      proyectileRadius: null,
      proyectileDamage: null,
    }));
    setResponse(null);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ marginTop: "30px", padding: "20px" }}>
      <h1>API Test</h1>
      <p>Choose the endpoint for testing:</p>
      <ul className="endpoint-selector">
        <li
          onClick={() => {
            resetInput();
            setEndpoint("/buy");
          }}
        >
          <StandardButton>POST /buy</StandardButton>
        </li>
        <li
          onClick={() => {
            resetInput();
            setEndpoint("/move");
          }}
        >
          <StandardButton>POST /move</StandardButton>
        </li>
        <li
          onClick={() => {
            resetInput();
            setEndpoint("/collission");
          }}
        >
          <StandardButton>POST /collission</StandardButton>
        </li>
      </ul>
      <div className="main-endpoint-container">
        <div className="endpoint-form-container">
          <h2>POST {endpoint}</h2>
          <form onSubmit={(e) => handleApiTest(endpoint, e)}>
            {inputList[endpoint].map((input) => (
              <label key={input} className="api-form-input">
                {input}:
                <input
                  type="text"
                  placeholder={input}
                  onChange={(e) =>
                    setInputValue((prev) => ({
                      ...prev,
                      [input]: e.target.value,
                    }))
                  }
                  required
                />
              </label>
            ))}
            <button type="submit">Test</button>
          </form>
        </div>
        <div className="response-container">
          <h3>Response:</h3>
          {response ? (
            <pre>
              <code>{JSON.stringify(response, null, 2)}</code>
            </pre>
          ) : loading ? (
            <p>Loading...</p>
          ) : (
            <p>No response yet</p>
          )}
        </div>
          
      </div>
    <div className="documentacion">
      <Link to="/documentacion"> <StandardButton className="play-button"> Ver Documentacion </StandardButton> </Link>
    </div>
    </div>
  );
}
