import { Link } from "react-router-dom";
import wigsImg from "./assets/categories/wigs.jpg";
import extensionsImg from "./assets/categories/extensions.jpg";
import haircareImg from "./assets/categories/haircare.jpg";
import accessoriesImg from "./assets/categories/accessories.jpg";
import "./Categories.css";

function Categories() {
  const categories = [
    { id: 1, name: "Wigs", image: wigsImg, path: "/wigs" },
    { id: 2, name: "Extensions", image: extensionsImg, path: "/extensions" },
    { id: 3, name: "Hair Care", image: haircareImg, path: "/haircare" },
    { id: 4, name: "Accessories", image: accessoriesImg, path: "/accessories" },
  ];

  return (
    <div className="categories-page">
      <h2>Product Categories</h2>
      <div className="category-grid">
        {categories.map((cat) => (
          <div key={cat.id} className="category-card">
            <img src={cat.image} alt={cat.name} className="category-image" />
            <h3>{cat.name}</h3>
            <Link to={cat.path}>
              <button>View {cat.name}</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
