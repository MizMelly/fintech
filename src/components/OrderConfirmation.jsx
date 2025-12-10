import { useLocation, useNavigate } from "react-router-dom";
import "./OrderConfirmation.css";

function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state;

  if (!order) {
    return (
      <div className="order-confirmation">
        <h2>No Order Found 😕</h2>
        <button onClick={() => navigate("/categories")}>
          Back to Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <h2>🎉 Order Placed Successfully!</h2>
      <p>Thank you for your purchase, <strong>{order.name}</strong>.</p>
      <p>Your order has been received and is now being processed.</p>

      <div className="order-info">
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
        <p><strong>Payment:</strong> {order.paymentMethod}</p>
      </div>

      <div className="order-actions">
        <button onClick={() => navigate("/track-order", { state: { orderId: order.id } })}>
          🚚 Track This Order
        </button>
        <button onClick={() => navigate("/categories")}>
          🛍️ Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderConfirmation;
