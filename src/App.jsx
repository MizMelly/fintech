import { Routes, Route, useParams } from "react-router-dom";

import Navbar from "./components/Navbar";
import Slider from "./components/Slider";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Contact from "./Contact";
import Categories from "./Categories";

import Wigs from "./components/pages/Wigs";
import Extensions from "./components/pages/Extensions";
import HairCare from "./components/pages/HairCare";
import Accessories from "./components/pages/Accessories";
import Cart from "./components/pages/Cart";
import Checkout from "./components/CheckOut";
import OrderConfirmation from "./components/OrderConfirmation";
import Orders from "./components/pages/Orders";
import OrdersHistory from "./components/pages/OrdersHistory";
import TrackOrder from "./components/pages/TrackOrder";
import Shop from "./components/Shop"; 

import "./App.css";

// ✅ Home Page
function Home() {
  return (
    <>
      <Slider />
      <Features />
    </>
  );
}

// ✅ Category Wrapper
function ShopWrapper() {
  const { category } = useParams();
  const formattedCategory = category
    ? category.replace(/^\w/, (c) => c.toUpperCase())
    : null;

  return <Features category={formattedCategory} />;
}

// ✅ Main App (no <Router> here)
function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wigs" element={<Wigs />} />
          <Route path="/extensions" element={<Extensions />} />
          <Route path="/haircare" element={<HairCare />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/shop/:category" element={<ShopWrapper />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders-history" element={<OrdersHistory />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/shop/search/:query" element={<ShopWrapper />} />
          <Route path="/shop" element={<Shop />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
