import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TrackOrder.css";

function TrackOrder() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Initialize with order ID passed from Order Confirmation (if any)
  const initialOrderId = location.state?.orderId || "";
  const [orderId, setOrderId] = useState(initialOrderId);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const handleTrack = () => {
    if (!orderId.trim()) {
      setError("Please enter a valid Order ID.");
      setOrder(null);
      return;
    }

    // ✅ Fetch saved orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const foundOrder = savedOrders.find((o) => o.id === orderId.trim());

    if (foundOrder) {
      setOrder(foundOrder);
      setError("");
    } else {
      setOrder(null);
      setError("❌ Order not found. Please check your Order ID.");
    }
  };

  // ✅ Auto-track when coming from Order Confirmation
  if (initialOrderId && !order && !error) {
    setTimeout(handleTrack, 100);
  }

  return (
    <div className="track-order-page">
      <h2>📦 Track Your Order</h2>
      <p>Enter your Order ID below to see its current status.</p>

      <div className="track-input">
        <input
          type="text"
          placeholder="Enter your Order ID (e.g., ORD-123456)"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <button onClick={handleTrack}>Track</button>
      </div>

      {error && <p className="error">{error}</p>}

      {order && (
        <div className="order-details">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Name:</strong> {order.name}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Payment:</strong> {order.paymentMethod}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`status ${order.status.toLowerCase()}`}>
              {order.status}
            </span>
          </p>

          <h4>Items:</h4>
          <div className="order-items">
            {order.items?.map((item) => (
              <div key={item.id} className="track-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <p>{item.price}</p>
                  <p>Qty: {item.quantity || 1}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="total">
            <strong>Total:</strong> ${order.total.toFixed(2)}
          </p>

          <button className="back-btn" onClick={() => navigate("/orders")}>
            ← Back to My Orders
          </button>
        </div>
      )}
    </div>
  );
}

export default TrackOrder;
