import { useEffect, useState } from "react";
import {
  StarIcon,
  HeartIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

interface BaseProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  rate: number;
  reviewCount: number;
  detailInformation: string;
}

interface Product extends BaseProduct {
  colors: string[]; // Mảng màu
  storageOptions: string[]; // Mảng dung lượng
  images: string[]; // Mảng hình ảnh
}

interface ProductResponse extends BaseProduct {
  colors: string; // Chuỗi màu (phân tách bằng dấu phẩy)
  storageOptions: string; // Chuỗi dung lượng (phân tách bằng dấu phẩy)
  images: string; // Chuỗi hình ảnh (phân tách bằng dấu phẩy)
  reviews: Review[]; // Danh sách đánh giá
}

interface ProductDetail {
  display: string;
  chip: string;
  camera: string;
  battery: string;
  waterResistance: string;
  accessories: string[];
}

interface Review {
  comment: string;
  rating: number;
  name: string;
  createdAt: string; // Sửa lỗi chính tả từ "createAt" thành "createdAt"
}

import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router-dom";

interface ProductData {
  product: ProductResponse;
}
const ProductDetail = () => {
  const [selectedColor, setSelectedColor] = useState<string>("Black");
  const [selectedStorage, setSelectedStorage] = useState<string>("128GB");
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(
    null
  );

  const { id } = useParams<{ id: string }>();
  const GET_PRODUCT = gql`
    query GetProduct($id: Float!) {
      product(id: $id) {
        name
        rate
        price
        images
        colors
        storageOptions
        reviewCount
        detailInformation
        reviews {
          comment
          rating
          name
          createdAt
        }
      }
    }
  `;

  const { loading, error, data } = useQuery<ProductData>(GET_PRODUCT, {
    skip: !id,
    variables: { id: id ? parseFloat(id) : undefined }, // Truyền ID sản phẩm
  });

  useEffect(() => {
    if (data?.product) {
      const prod = {
        ...data.product,
        colors: data.product.colors.split(","),
        storageOptions: data.product.storageOptions
          ? data.product.storageOptions.split(",")
          : [],
        images: data.product.images.split(","),
      };
      const cleanedDetailInformation = prod.detailInformation;
      const prodDetail = JSON.parse(cleanedDetailInformation);
      console.log(prod);
      setProductDetail(JSON.parse(prodDetail));
      setProduct(prod);
      setReviews(prod.reviews);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleAddToCart = () => {
    // console.log("Added to cart:", {
    //   product: product.name,
    //   color: selectedColor,
    //   storage: selectedStorage,
    //   quantity,
    //   price: product.price * quantity,
    // });
    // Add to cart logic here
  };

  const handleBuyNow = () => {
    // console.log("Buy now:", {
    //   product: product.name,
    //   color: selectedColor,
    //   storage: selectedStorage,
    //   quantity,
    //   price: product.price * quantity,
    // });
    // Checkout logic here
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const totalPrice = 100;

  if (product)
    return (
      <div className="bg-gray-50 min-h-screen">
        {/* Navigation/Header */}
        {/* <nav className="bg-white shadow-sm py-4 px-4 flex items-center">
          <button className="mr-4">
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">
            Product Details
          </h1>
        </nav> */}

        <div className="max-w-7xl">
          <div className="lg:grid lg:grid-cols-2 lg:gap-6">
            {/* Product Images */}
            <div className="mb-8 lg:mb-0">
              <div className="bg-white rounded-lg overflow-hidden shadow-md mb-4">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-96 object-contain"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`bg-white rounded-md overflow-hidden shadow-sm ${
                      currentImageIndex === index
                        ? "ring-2 ring-indigo-500"
                        : ""
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-20 object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {product.name}
                  </h1>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <StarIcon
                          key={rating}
                          className={`h-5 w-5 ${
                            rating <= Math.floor(product.rate)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {product.rate} ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="text-gray-400 hover:text-red-500"
                >
                  {isFavorite ? (
                    <HeartIconSolid className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6" />
                  )}
                </button>
              </div>

              <p className="mt-4 text-gray-600">{product.description}</p>

              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Color</h2>
                <div className="flex space-x-2 mt-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedColor === color
                          ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
              {product.storageOptions.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-medium text-gray-900">Storage</h2>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {product.storageOptions.map((storage) => (
                      <button
                        key={storage}
                        onClick={() => setSelectedStorage(storage)}
                        className={`px-3 py-2 rounded-md text-sm ${
                          selectedStorage === storage
                            ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {storage}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Quantity</h2>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 bg-gray-200 rounded-l-md text-gray-700 hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 bg-gray-100 text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 bg-gray-200 rounded-r-md text-gray-700 hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Price</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="text-xl font-bold text-indigo-600">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <ShoppingBagIcon className="h-5 w-5 mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex items-center justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Product Details
            </h2>
            {productDetail && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Specifications
                  </h3>
                  <ul className="space-y-2">
                    {Object.entries(productDetail).map(([key, value]) => {
                      if (Array.isArray(value)) return null; // Skip arrays like accessories here
                      return (
                        <li key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">
                            {key}
                          </span>
                          <span className="text-gray-900">{value}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    What's in the Box
                  </h3>
                  <ul className="space-y-2">
                    {productDetail.accessories.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-gray-900">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Customer Reviews
            </h2>
            {reviews && (
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <StarIcon
                            key={rating}
                            className={`h-5 w-5 ${
                              rating <= Math.floor(review.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {Math.floor(review.rating)}
                      </span>
                    </div>
                    <h3 className="text-md font-medium text-gray-900 mt-2">
                      {review.comment}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      By {review.name || "Unknown"} • October 15, 2023
                    </p>
                  </div>
                ))}
              </div>
            )}
            <button className="mt-6 text-indigo-600 hover:text-indigo-800 font-medium">
              See all reviews
            </button>
          </div>
        </div>
      </div>
    );
};

export default ProductDetail;
