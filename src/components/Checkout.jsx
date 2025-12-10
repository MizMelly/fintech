import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    paymentMethod: "card",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleSubmit = (e) => {
  e.preventDefault();

  if (!formData.name || !formData.address || !formData.phone) {
    alert("Please fill all required fields!");
    return;
  }

  const newOrder = {
    id: "ORD-" + Math.floor(Math.random() * 1000000),
    name: formData.name,
    address: formData.address,
    paymentMethod: formData.paymentMethod,
    total,
    date: new Date().toLocaleDateString(),
    status: "Processing",
    items: cart, // ✅ include all items
  };

  // 🔍 ADD THESE LOGS:
  console.log("🆕 New order created:", newOrder);
  console.log("🛒 Cart contents at checkout:", cart);
  console.log("💰 Total:", total);

  // 🧠 Save to localStorage
  const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
  console.log("📦 Existing orders before save:", existingOrders);

  existingOrders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(existingOrders));
  console.log("✅ Orders saved to localStorage:", existingOrders);

  // 🕒 Simulate status updates
  setTimeout(() => updateOrderStatus(newOrder.id, "Shipped"), 5000);
  setTimeout(() => updateOrderStatus(newOrder.id, "Delivered"), 10000);

  clearCart();
  navigate("/order-confirmation", { state: newOrder });
};

  // Helper to update order status in localStorage
  const updateOrderStatus = (orderId, newStatus) => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const updatedOrders = storedOrders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      {cart.length === 0 ? (
        <div className="empty-checkout">
          <p>Your cart is empty 🛒</p>
          <button onClick={() => navigate("/categories")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="checkout-content">
          {/* 🛍️ Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            {cart.map((item) => (
              <div key={item.id} className="checkout-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <p>{item.price}</p>
                  <p>Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
            <h3>Total: ${total.toFixed(2)}</h3>
          </div>

          {/* 🧍 Delivery Details Form */}
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h3>Delivery Information</h3>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email (optional)"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <textarea
              name="address"
              placeholder="Delivery Address"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <h3>Payment Method</h3>
            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === "card"}
                  onChange={handleChange}
                />
                Pay with Card
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="delivery"
                  checked={formData.paymentMethod === "delivery"}
                  onChange={handleChange}
                />
                Pay on Delivery
              </label>
            </div>

            <button type="submit" className="place-order-btn">
              Place Order
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Checkout;
