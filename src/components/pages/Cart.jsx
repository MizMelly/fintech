import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

import "./Cart.css";

function Cart() {
  const { cart, removeFromCart, clearCart, total } = useCart();
  const navigate = useNavigate();

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty 🛍️</p>
          <button onClick={() => navigate("/categories")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>{item.price}</p>
                  <p>Qty: {item.quantity}</p>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Total: ${total.toFixed(2)}</h3>
            <div className="cart-buttons">
               <button onClick={() => navigate("/categories")}>Continue Shopping</button>
               <button onClick={clearCart}>Clear Cart</button>
                <button className="checkout-btn" onClick={() => navigate("/checkout")}>
                   Proceed to Checkout
                   </button>
                   </div>


            </div>
          </>
      )}
    </div> 
  );
}

export default Cart;
