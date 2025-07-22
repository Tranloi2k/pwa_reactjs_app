import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts } from "../../store/slice/products";
// import { AppDispatch, RootState } from "../../store";
import {
  StarIcon,
  HeartIcon,
  ShoppingBagIcon,
  FunnelIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { Product } from "../../types/product";
import { useGetPostsQuery } from "../../store/api/productApi";

const ProductList = () => {
  const [isFavoriteMap, setIsFavoriteMap] = useState<Record<number, boolean>>(
    {}
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOption, setSortOption] = useState<string>("popular");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [products, setProducts] = useState<Product[]>([]); // Replace 'any' with your product type
  const productsPerPage = 8;

  // const dispatch = useDispatch<AppDispatch>();
  // const {
  //   items: products,
  //   loading,
  //   error,
  // } = useSelector((state: RootState) => state.products);

  // useEffect(() => {
  //   dispatch(fetchProducts());
  // }, [dispatch]);

  const { data, error, isLoading } = useGetPostsQuery();

  useEffect(() => {
    console.log(data);
    if (data?.products) {
      setProducts(data.products);
    }
  }, [data]);

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error:</div>;

  const toggleFavorite = (productId: number) => {
    setIsFavoriteMap((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const calculateDiscountedPrice = (price: number, discount?: number) => {
    if (!discount) return price;
    return price * (1 - discount / 100);
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      default:
        return b.reviewCount - a.reviewCount; // popular
    }
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <nav className="bg-white py-4 px-6 shadow-sm">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link to="/" className="text-indigo-600 hover:text-indigo-800">
              Home
            </Link>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li className="text-gray-600">Products</li>
        </ol>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Smartphones & Accessories
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {products.length} products
            </span>
            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid" ? "bg-gray-200" : "bg-white"
                }`}
                title="Grid view"
              >
                <Squares2X2Icon className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list" ? "bg-gray-200" : "bg-white"
                }`}
                title="List view"
              >
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-1 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FunnelIcon className="h-4 w-4" />
              <span>Filters</span>
            </button>
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-8 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="popular">Sort by: Popular</option>
                <option value="rating">Sort by: Rating</option>
                <option value="price-low">Sort by: Price Low to High</option>
                <option value="price-high">Sort by: Price High to Low</option>
                <option value="newest">Sort by: Newest</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <span className="text-sm text-gray-500">Category:</span>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
              Smartphones
            </button>
            <span className="text-gray-400">|</span>
            <button className="text-sm font-medium text-gray-600 hover:text-gray-800">
              Tablets
            </button>
            <span className="text-gray-400">|</span>
            <button className="text-sm font-medium text-gray-600 hover:text-gray-800">
              Wearables
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-contain p-4"
                    />
                  </Link>
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100"
                  >
                    {isFavoriteMap[product.id] ? (
                      <HeartIconSolid className="h-6 w-6 text-red-500" />
                    ) : (
                      <HeartIcon className="h-6 w-6 text-gray-400 hover:text-red-500" />
                    )}
                  </button>
                  {product.isNew && (
                    <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      New
                    </span>
                  )}
                  {product.discount && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <Link to={`/product/${product.id}`} className="block">
                    <h3 className="text-lg font-medium text-gray-900 mb-1 hover:text-indigo-600">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <StarIcon
                          key={rating}
                          className={`h-4 w-4 ${
                            rating <= Math.floor(product.rate)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-xs text-gray-600">
                      ({product.rate})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      {product.discount ? (
                        <>
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(
                              calculateDiscountedPrice(
                                product.price,
                                product.discount
                              )
                            )}
                          </span>
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                    <button className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200">
                      <ShoppingBagIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 relative">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-contain p-4"
                      />
                    </Link>
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100"
                    >
                      {isFavoriteMap[product.id] ? (
                        <HeartIconSolid className="h-6 w-6 text-red-500" />
                      ) : (
                        <HeartIcon className="h-6 w-6 text-gray-400 hover:text-red-500" />
                      )}
                    </button>
                    {product.isNew && (
                      <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        New
                      </span>
                    )}
                    {product.discount && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  <div className="md:w-3/4 p-4">
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <Link to={`/product/${product.id}`} className="block">
                          <h3 className="text-xl font-medium text-gray-900 mb-1 hover:text-indigo-600">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <StarIcon
                                key={rating}
                                className={`h-5 w-5 ${
                                  rating <= Math.floor(product.rating)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-1 text-sm text-gray-600">
                            ({product.reviewCount} reviews)
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua.
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          {product.discount ? (
                            <>
                              <span className="text-xl font-bold text-gray-900">
                                {formatPrice(
                                  calculateDiscountedPrice(
                                    product.price,
                                    product.discount
                                  )
                                )}
                              </span>
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                {formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-xl font-bold text-gray-900">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center">
                          <ShoppingBagIcon className="h-5 w-5 mr-2" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-md ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
