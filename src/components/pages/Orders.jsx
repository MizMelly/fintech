import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    console.log("Loaded orders:", savedOrders); // ✅ Debug line
    setOrders(savedOrders);
  }, []);

  const handleTrack = (orderId) => {
    navigate("/track-order", { state: { orderId } });
  };

  return (
    <div className="orders-page">
      <h2>📦 My Orders</h2>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>You haven’t placed any orders yet 🛍️</p>
          <button onClick={() => navigate("/categories")}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-info">
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Date:</strong> {order.date}</p>
                <p><strong>Total:</strong> ${order.total?.toFixed(2)}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status ${order.status?.toLowerCase()}`}>
                    {order.status}
                  </span>
                </p>
              </div>
              <button className="track-btn" onClick={() => handleTrack(order.id)}>
                Track Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
