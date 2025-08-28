import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../../hooks/redux";
import { fetchProductDetail } from "../../../../store/slices/products";
import type { RootState } from "../../../../store";
import { 
  ArrowLeft, 
  Star, 
  Package, 
  DollarSign, 
  Calendar,
  ExternalLink,
  Tag,
  Globe,
  Languages
} from "lucide-react";

const ProductDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productId = location.state?.productId;
  const dispatch = useAppDispatch();

  const { loading, error } = useSelector((state: RootState) => state.products);
  const productDetail = useSelector(
    (state: RootState) =>
      state.products.results.find((p) => p.id === productId) || {}
  );

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetail(productId));
    }
  }, [dispatch, productId]);

  const getProductImage = () => {
    if (imageError || !productDetail.image) {
      return "https://via.placeholder.com/400x400?text=No+Image+Available";
    }
    return productDetail.image;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const InfoCard = ({ icon: Icon, title, value, className = "" }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: React.ReactNode;
    className?: string;
  }) => (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-3 mb-2">
        <Icon className="h-5 w-5 text-blue-600" />
        <span className="font-medium text-gray-700 dark:text-gray-300">{title}</span>
      </div>
      <div className="text-gray-900 dark:text-white font-semibold">
        {value || "N/A"}
      </div>
    </div>
  );

  const LanguageSection = ({ title, content, language }: {
    title: string;
    content: string;
    language: string;
  }) => {
    if (!content) return null;
    
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-2 mb-3">
          <Languages className="h-4 w-4 text-blue-600" />
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {title} ({language})
          </h4>
        </div>
        <div 
          className="text-gray-700 dark:text-gray-300 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </button>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Product ID: {productId}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading product details...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-red-800 font-semibold mb-2">Error Loading Product</h3>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <button
              onClick={() => dispatch(fetchProductDetail(productId))}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : productDetail && productDetail.id ? (
        <div className="space-y-8">
          {/* Main Product Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <img
                src={getProductImage()}
                alt="Product"
                onError={() => setImageError(true)}
                className="w-full max-w-md mx-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
              />
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {productDetail.title_en ||
                    productDetail.title ||
                    "Unnamed Product"}
                </h1>
                
                {productDetail.link && (
                  <a
                    href={productDetail.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View External Link</span>
                  </a>
                )}
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <InfoCard
                  icon={DollarSign}
                  title="Price"
                  value={productDetail.price ? 
                    `${productDetail.price} ${(productDetail.price_unit || "").toUpperCase()}` : 
                    "Price not available"
                  }
                />
                
                <InfoCard
                  icon={Package}
                  title="Stock Available"
                  value={productDetail.left_in_stock ?? "N/A"}
                  className={
                    productDetail.left_in_stock === 0 
                      ? "border-l-4 border-red-500" 
                      : productDetail.left_in_stock && productDetail.left_in_stock < 10
                      ? "border-l-4 border-yellow-500"
                      : "border-l-4 border-green-500"
                  }
                />

                <InfoCard
                  icon={Star}
                  title="Rating"
                  value={productDetail.rating ? (
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(productDetail.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span>{productDetail.rating}</span>
                      {productDetail.reviews_count && (
                        <span className="text-sm text-gray-500">
                          ({productDetail.reviews_count} reviews)
                        </span>
                      )}
                    </div>
                  ) : "No rating"}
                />

                <InfoCard
                  icon={Tag}
                  title="Tags"
                  value={
                    productDetail.tags && productDetail.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {productDetail.tags.slice(0, 3).map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {productDetail.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{productDetail.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    ) : "No tags"
                  }
                />
              </div>

              {/* All Tags (if many) */}
              {productDetail.tags && productDetail.tags.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    All Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {productDetail.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Titles Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <span>Product Titles</span>
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <LanguageSection 
                title="Title" 
                content={productDetail.title_en || ""} 
                language="English" 
              />
              <LanguageSection 
                title="Title" 
                content={productDetail.title_hi || ""} 
                language="Hindi" 
              />
              <LanguageSection 
                title="Title" 
                content={productDetail.title || ""} 
                language="Default" 
              />
            </div>
          </div>

          {/* Descriptions Section */}
          {(productDetail.description_en || productDetail.description_hi || productDetail.description) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-600" />
                <span>Product Descriptions</span>
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <LanguageSection 
                  title="Description" 
                  content={productDetail.description_en || ""} 
                  language="English" 
                />
                <LanguageSection 
                  title="Description" 
                  content={productDetail.description_hi || ""} 
                  language="Hindi" 
                />
                <LanguageSection 
                  title="Description" 
                  content={productDetail.description || ""} 
                  language="Default" 
                />
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Timeline</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard
                icon={Calendar}
                title="Created At"
                value={formatDate(productDetail.created_at)}
              />
              <InfoCard
                icon={Calendar}
                title="Last Updated"
                value={formatDate(productDetail.updated_at)}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-gray-700 font-semibold mb-2">Product Not Found</h3>
            <p className="text-gray-500 text-sm mb-4">
              The requested product could not be found or does not exist.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;