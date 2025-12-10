// src/components/Footer.jsx
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left section */}
        <div className="footer-left">
          <h2>ManesBySplash</h2>
          <p>Your premium hair care and accessories destination.</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
          </div>
        </div>

        {/* Shop section */}
        <div className="footer-section">
          <h3>Shop</h3>
          <ul>
            <li>All Products</li>
            <li>New Arrivals</li>
            <li>Best Seller</li>
            <li>Sale</li>
          </ul>
        </div>

        {/* Support section */}
        <div className="footer-section">
          <h3>Support</h3>
          <ul>
            <li>Contact Us</li>
            <li>FAQs</li>
            <li>Shipping Info</li>
            <li>Returns</li>
          </ul>
        </div>

        {/* Company section */}
        <div className="footer-section">
          <h3>Company</h3>
          <ul>
            <li>About Us</li>
            <li>Careers</li>
            <li>Press</li>
            <li>Blog</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 ManesBySplash. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
