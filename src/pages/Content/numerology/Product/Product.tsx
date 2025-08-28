// import React from "react";
// import { LayoutGrid, List } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { fetchProducts } from "../../../../store/slices/products";
// import type { RootState } from "../../../../store";
// import { useAppDispatch } from "../../../../hooks/redux"; // use correct dispatch

// const Product: React.FC = () => {
//   const [viewMode, setViewMode] = React.useState<"table" | "grid">("table");
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch(); // use correct dispatch
//   const { results: products, loading, error } = useSelector(
//     (state: RootState) => state.products
//   );

//   React.useEffect(() => {
//     dispatch(fetchProducts({ limit: 50, offset: 0 })); // pass params for proper integration
//   }, [dispatch]);

//   const handleNavigate = (product: { id?: number }) => {
//     if (product.id) {
//       navigate("/products/details", { state: { productId: product.id } });
//     }
//   };

//   return (
//     <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
//           Products List
//         </h1>
//         <div className="flex gap-2">
//           <button
//             onClick={() => setViewMode("table")}
//             className={`p-2 rounded-md border border-gray-300 dark:border-gray-600 ${
//               viewMode === "table"
//                 ? "bg-gray-200 dark:bg-gray-700"
//                 : "bg-white dark:bg-gray-900"
//             } hover:bg-gray-100 dark:hover:bg-gray-800`}
//             title="Table View"
//           >
//             <List className="h-5 w-5" />
//           </button>
//           <button
//             onClick={() => setViewMode("grid")}
//             className={`p-2 rounded-md border border-gray-300 dark:border-gray-600 ${
//               viewMode === "grid"
//                 ? "bg-gray-200 dark:bg-gray-700"
//                 : "bg-white dark:bg-gray-900"
//             } hover:bg-gray-100 dark:hover:bg-gray-800`}
//             title="Grid View"
//           >
//             <LayoutGrid className="h-5 w-5" />
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="text-center py-8 text-gray-500">Loading products...</div>
//       ) : error ? (
//         <div className="text-center py-8 text-red-500">Error: {error}</div>
//       ) : products.length === 0 ? (
//         <div className="text-center py-8 text-gray-500">No products found.</div>
//       ) : viewMode === "table" ? (
//         <ul className="divide-y divide-gray-200">
//           {products.map((product) => (
//             <li
//               key={product.id}
//               className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
//               onClick={() => handleNavigate(product)}
//             >
//               <span className="text-base font-medium text-gray-900 dark:text-white">
//                 {product.name || product.title_en || product.title || "Product"} {/* fallback for name */}
//               </span>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-4">
//           {products.map((product) => (
//             <div
//               key={product.id}
//               className="border border-gray-400 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition"
//               onClick={() => handleNavigate(product)}
//             >
//               <div className="text-xl font-semibold text-gray-800 text-center">
//                 {product.name || product.title_en || product.title || "Product"} {/* fallback for name */}
//               </div>
//               {/* Add more fields if needed */}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Product;

import React from "react";
import { LayoutGrid, List, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchProducts } from "../../../../store/slices/products";
import type { RootState } from "../../../../store";
import { useAppDispatch } from "../../../../hooks/redux";

const Product: React.FC = () => {
  const [viewMode, setViewMode] = React.useState<"table" | "grid">("grid");
  const [searchTerm, setSearchTerm] = React.useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { results: products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  React.useEffect(() => {
    dispatch(fetchProducts({ limit: 50, offset: 0 }));
  }, [dispatch]);

  const handleNavigate = (product: { id?: number }) => {
    if (product.id) {
      navigate("/products/details", { state: { productId: product.id } });
    }
  };

  const filteredProducts = products.filter((product) => {
    const searchableText = (
      product.name || product.title_en || product.title || ""
    ).toLowerCase();
    return searchableText.includes(searchTerm.toLowerCase());
  });

  const getProductImage = (product: any) =>
    product.image || "https://via.placeholder.com/150x150?text=No+Image";

  const getProductName = (product: any) =>
    product.name || product.title_en || product.title || "Unnamed Product";

  const getProductPrice = (product: any) =>
    product.price
      ? `${product.price} ${(product.price_unit || "").toUpperCase()}`
      : "Price not available";

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      
      {/* Row 1: Title */}
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-6">
        Products Catalog
      </h1>

      {/* Row 2: Create button + View toggle */}
      <div className="flex justify-end items-center mb-6 gap-3">
        {/* Create Button */}
        <button
          onClick={() => navigate("/products/add")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Create
        </button>

        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors ${
              viewMode === "table"
                ? "bg-blue-100 border-blue-300 text-blue-600 dark:bg-blue-900/30"
                : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
            title="Table View"
          >
            <List className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors ${
              viewMode === "grid"
                ? "bg-blue-100 border-blue-300 text-blue-600 dark:bg-blue-900/30"
                : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
            title="Grid View"
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Row 3: Search Bar */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Products Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading products...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-red-800 font-semibold mb-2">
              Error Loading Products
            </h3>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={() => dispatch(fetchProducts({ limit: 50, offset: 0 }))}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-gray-700 font-semibold mb-2">
              {searchTerm ? "No products found" : "No products available"}
            </h3>
            <p className="text-gray-500 text-sm">
              {searchTerm
                ? `No products match "${searchTerm}". Try adjusting your search.`
                : "There are no products to display at this time."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      ) : viewMode === "table" ? (
        /* Table View */
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => handleNavigate(product)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={getProductImage(product)}
                          alt="Product"
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {getProductName(product)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {product.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                      {getProductPrice(product)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {product.left_in_stock ?? "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {product.rating ? (
                        <div className="flex items-center space-x-1">
                          <span>⭐</span>
                          <span>{product.rating}</span>
                          {product.reviews_count && (
                            <span className="text-gray-500">
                              ({product.reviews_count})
                            </span>
                          )}
                        </div>
                      ) : (
                        "No rating"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => handleNavigate(product)}
            >
              <div className="aspect-w-1 aspect-h-1 bg-gray-100">
                <img
                  src={getProductImage(product)}
                  alt="Product"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {getProductName(product)}
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Price:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {getProductPrice(product)}
                    </span>
                  </div>

                  {product.left_in_stock !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">
                        Stock:
                      </span>
                      <span
                        className={`font-medium ${
                          product.left_in_stock > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.left_in_stock}
                      </span>
                    </div>
                  )}

                  {product.rating && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">
                        Rating:
                      </span>
                      <div className="flex items-center space-x-1">
                        <span>⭐</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {product.rating}
                        </span>
                        {product.reviews_count && (
                          <span className="text-gray-500">
                            ({product.reviews_count})
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Product;
