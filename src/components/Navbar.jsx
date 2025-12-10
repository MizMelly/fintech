import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

function Navbar() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <h1 className="logo">ManesBySplash</h1>

      {/* Mobile Menu Toggle */}
      <div 
        className="hamburger" 
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      <div className={`nav-menu ${menuOpen ? "open" : ""}`}>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <ul className="nav-links">
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/categories" onClick={() => setMenuOpen(false)}>Categories</Link></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link></li>
          <li><Link to="/cart" onClick={() => setMenuOpen(false)}>Cart ({cart.length})</Link></li>
          <li><Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link></li>
          <li><Link to="/track-order" onClick={() => setMenuOpen(false)}>Track Order</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
