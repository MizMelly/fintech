import { useParams } from "react-router-dom";
import Features from "../Features";

function ShopWrapper() {
  const { category, query } = useParams();

  const formattedCategory = category
    ? category.replace(/^\w/, (c) => c.toUpperCase())
    : null;

  return <Features category={formattedCategory} searchQuery={query} />;
}

export default ShopWrapper;
