import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext'; // Import AuthContext
import './store.css'; // Link to store styles

const Store = ({ isOpen, onClose }) => {
  const { playerId } = useContext(AuthContext); // Retrieve userId from context
  const [items, setItems] = useState([]);
  const [coins, setCoins] = useState(0); // Initialize coins with 0

  const userId = playerId;

  console.log("id:", userId);

  useEffect(() => {
    if (isOpen && userId) { // Ensure userId is available
      //console.log("Store opened");

      // Fetch items from the API when the store is opened 
      axios.get(`http://localhost:3000/getProyectils?playerId=${userId}`)
        .then(response => {
          if (response.data.proyectils) {
            const fetchedItems = response.data.proyectils.map(proyectil => ({
              id: proyectil.id,
              name: `Proyectil ${proyectil.id}`, // Customize the name as needed
              price: proyectil.cost,
              owned: proyectil.owned,
              damage: proyectil.damage,
              impactRadius: proyectil.impactRadius,
              unlockLevel: proyectil.unlockLevel,
            }));
            setItems(fetchedItems);
          }
        })
        .catch(error => {
          console.error('Error fetching items:', error);
        });

    
      // Fetch player's coins from the API
      axios.get(`http://localhost:3000/getPlayerCoins?playerId=${userId}`)
        .then(response => {
          if (response.data.coins !== undefined) {
            setCoins(response.data.coins);
          } else {
            console.error('Error: No coins data returned from server');
          }
        })
        .catch(error => {
          console.error('Error fetching player coins:', error);
        });
    }
  }, [isOpen, userId]);

  const handlePurchase = (item) => {
    if (coins < item.price) {
      alert("Not enough coins");
      return;
    }

    const newCoins = coins - item.price;
    setCoins(newCoins);
    setItems(items.map(i => {
      if (i.id === item.id) {
        return { ...i, owned: i.owned + 1 };
      }
      return i;
    }));

    // Update server with new balance
    axios.post('http://localhost:3000/buy', {
      playerId: userId,
      boughtItems: [
        item.id
      ],
      moneySpent: item.price,
      playerBalance: coins,
    })
      .then(response => {
        if (response.data.message !== 'Buy stage completed') {
          alert(response.data.message);
        }
      })
      .catch(error => {
        console.error('Error during purchase:', error);
        alert('Purchase failed, please try again.');
      });
  };

  const handleClose = () => {
    console.log("Store closed");
    onClose(); // Call the onClose function to close the store
  };

  if (!isOpen) return null;

  return (
    <div className="store-backdrop" onClick={handleClose}>
      <div className="store-container" onClick={(e) => e.stopPropagation()}>
        <button className="store-close-button" onClick={handleClose}>Close</button>
        <h2>Store</h2>
        <div className="store-coins">Coins: {coins}</div>
        <ul className="store-items">
          {items.map(item => (
            <li key={item.id} className="store-item">
              <span>{item.name}</span>
              <span>Damage: {item.damage}</span>
              <span>Radius: {item.impactRadius}</span>
              <span>{item.price} Coins</span>
              <span>Owned: {item.owned}</span>
              <button className="purchase-button" onClick={() => handlePurchase(item)}>Buy</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Store;


