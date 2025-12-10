import "../Shop.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

import p1 from "../../assets/accessories/accessories1.jpg";
import p2 from "../../assets/accessories/accessories2.jpg";
import p3 from "../../assets/accessories/accessories3.jpg";
import p4 from "../../assets/accessories/accessories4.jpg";
import p5 from "../../assets/accessories/accessories5.jpg";
import p6 from "../../assets/accessories/accessories6.jpg";
import p7 from "../../assets/accessories/accessories7.jpg";
import p8 from "../../assets/accessories/accessories8.jpg";
import p9 from "../../assets/accessories/accessories9.jpg";
import p10 from "../../assets/accessories/accessories10.jpg";
import p11 from "../../assets/accessories/accessories11.jpg";
import p12 from "../../assets/accessories/accessories12.jpg";

const products = [
  { id: 1, name: "Burgundy Bounce", price: "$50", image: p1 },
  { id: 2, name: "Customized Multi-Color Band", price: "$80", image: p2 },
  { id: 3, name: "Hair Conditional", price: "$40", image: p3 },
  { id: 4, name: "Brown Bone Straight", price: "$30", image: p4 },
  { id: 5, name: "Customized Gold Band", price: "$25", image: p5 },
  { id: 6, name: "Leave-in Conditional", price: "$45", image: p6 },
  { id: 7, name: "Brown Bone Straight", price: "$50", image: p7 },
  { id: 8, name: "Kinky", price: "$30", image: p8 },
  { id: 9, name: "All-in-1 set", price: "$15", image: p9 },
  { id: 10, name: "Dark Root Pink Body Wave", price: "$90", image: p10 },
  { id: 11, name: "Rose Band", price: "$35", image: p11 },
  { id: 12, name: "White Bone Straight", price: "$120", image: p12 },
];

function Accessories() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <div className="shop">
      <button className="back-btn" onClick={() => navigate("/categories")}>
        ← Back to Categories
      </button>

      <h2>Accessories Collection</h2>
      <p className="shop-description">
        Explore our elegant range of hair accessories.
      </p>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.price}</p>
           <button onClick={() => {addToCart(product);
    alert(`${product.name} has been added to your cart!`);
  }}
>
  Add to Cart
</button>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Accessories;
