import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrdersHistory.css";

function OrdersHistory() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // 🧠 Load orders from localStorage
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  // 🔄 Auto-refresh status updates (every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedOrders = JSON.parse(localStorage.getItem("orders")) || [];
      setOrders(updatedOrders);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (orders.length === 0) {
    return (
      <div className="orders-history empty">
        <h2>No Orders Yet 😕</h2>
        <button onClick={() => navigate("/categories")} className="back-btn">
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="orders-history">
      <h2>📦 Your Orders</h2>
      <p>Track the status of your recent purchases below.</p>

      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <h3>Order ID: {order.id}</h3>
            <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
          </div>

          <p><strong>Date:</strong> {order.date}</p>
          <p><strong>Name:</strong> {order.name}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Payment:</strong> {order.paymentMethod}</p>

          <div className="order-items">
            {order.items && order.items.map((item) => (
              <div key={item.id} className="order-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <p>{item.price}</p>
                  <p>Qty: {item.quantity || 1}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="order-total"><strong>Total:</strong> ${order.total.toFixed(2)}</p>
        </div>
      ))}

      <button onClick={() => navigate("/categories")} className="back-btn">
        ← Continue Shopping
      </button>
    </div>
  );
}

export default OrdersHistory;
