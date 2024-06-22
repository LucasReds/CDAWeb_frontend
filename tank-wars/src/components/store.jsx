import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './store.css'; // Link to store styles

const Store = ({ isOpen, onClose }) => {
  const [items, setItems] = useState([]);
  const [coins, setCoins] = useState(100); // Initialize coins with a default value

  useEffect(() => {
    if (isOpen) {
      console.log("Store opened");

      // Fetch items from the API when the store is opened
      axios.get('http://localhost:3000/getProyectils')
        .then(response => {
          if (response.data.proyectils) {
            const fetchedItems = response.data.proyectils.map(proyectil => ({
              id: proyectil.id,
              name: `Proyectil ${proyectil.id}`, // You can customize the name as needed
              price: proyectil.cost,
              owned: 0,
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
    }
  }, [isOpen]);

  const handlePurchase = (item) => {
    if (coins < item.price) {
      alert("Not enough coins");
      return;
    }

    alert(`Purchased: ${item.name}`);
    setCoins(coins - item.price);
    setItems(items.map(i => {
      if (i.id === item.id) {
        return { ...i, owned: i.owned + 1 };
      }
      return i;
    }));
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


