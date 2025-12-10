import { useCart } from "../context/CartContext";
import "./Shop.css";

import p1 from "../assets/product1.jpg";
import p2 from "../assets/accessories/accessories1.jpg";
import p3 from "../assets/haircare/hair1.jpg";
import p4 from "../assets/product4.jpg";
import p5 from "../assets/accessories/accessories4.jpg";
import p6 from "../assets/haircare/hair2.jpg";
import p7 from "../assets/product7.jpg";
import p8 from "../assets/product8.jpg";
import p9 from "../assets/haircare/hair8.jpg";
import p10 from "../assets/product10.jpg";
import p11 from "../assets/accessories/accessories3.jpg";
import p12 from "../assets/product12.jpg";

const allProducts = [
  { id: 1, name: "Burgundy Bounce", price: "$50", image: p1, category: "Wigs" },
  { id: 2, name: "Customized Multi-Color Band", price: "$80", image: p2, category: "Accessories" },
  { id: 3, name: "Hair Conditioner", price: "$40", image: p3, category: "Hair Care" },
  { id: 4, name: "Brown Bone Straight", price: "$30", image: p4, category: "Wigs" },
  { id: 5, name: "Customized Gold Band", price: "$25", image: p5, category: "Accessories" },
  { id: 6, name: "Leave-in Conditioner", price: "$45", image: p6, category: "Hair Care" },
  { id: 7, name: "Brown Bone Straight", price: "$50", image: p7, category: "Wigs" },
  { id: 8, name: "Kinky", price: "$30", image: p8, category: "Wigs" },
  { id: 9, name: "All-in-1 Set", price: "$15", image: p9, category: "Hair Care" },
  { id: 10, name: "Dark Root Pink Body Wave", price: "$90", image: p10, category: "Wigs" },
  { id: 11, name: "Rose Band", price: "$35", image: p11, category: "Accessories" },
  { id: 12, name: "White Bone Straight", price: "$120", image: p12, category: "Wigs" },
];

function Features({ category, searchQuery }) {
  const { addToCart } = useCart();

  let products = allProducts;

  if (category) {
    products = products.filter((p) => p.category === category);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    products = products.filter((p) => p.name.toLowerCase().includes(q));
  }

  return (
    <div className="shop">
      <h2>
        {searchQuery
          ? `Search results for "${searchQuery}"`
          : category
          ? `${category} Products`
          : "Featured Products"}
      </h2>
      <p>Discover our hand-picked selection of premium hair products</p>

      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.price}</p>
              <button
                onClick={() => {
                  addToCart(product);
                  alert(`${product.name} has been added to your cart!`);
                }}
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}

export default Features;
