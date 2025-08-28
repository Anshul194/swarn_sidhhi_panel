import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../../hooks/redux";
import { fetchProductDetail, updateProductDetail } from "../../../../store/slices/products";
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
  Languages,
  Pencil,
  X,
  Save,
  RefreshCw
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalField, setModalField] = useState<string>("");
  const [modalValue, setModalValue] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Local editable state
  const [productData, setProductData] = useState({
    title_en: "",
    title_hi: "",
    title: "",
    description_en: "",
    description_hi: "",
    description: "",
    price: "",
    price_unit: "",
    left_in_stock: "",
    tags: [] as string[],
    link: "",
    rating: "",
    reviews_count: ""
  });

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetail(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (productDetail && productDetail.id) {
      setProductData({
        title_en: productDetail.title_en || "",
        title_hi: productDetail.title_hi || "",
        title: productDetail.title || "",
        description_en: productDetail.description_en || "",
        description_hi: productDetail.description_hi || "",
        description: productDetail.description || "",
        price: productDetail.price || "",
        price_unit: productDetail.price_unit || "",
        left_in_stock: productDetail.left_in_stock || "",
        tags: productDetail.tags || [],
        link: productDetail.link || "",
        rating: productDetail.rating || "",
        reviews_count: productDetail.reviews_count || ""
      });
    }
  }, [productDetail]);

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

  const openEditModal = (field: string, value: string) => {
    setModalField(field);
    setModalValue(value || "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalField("");
    setModalValue("");
  };

  const handleModalSave = () => {
    if (modalField === 'tags') {
      // Handle tags as array
      const tagsArray = modalValue.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      setProductData((prev) => ({ ...prev, [modalField]: tagsArray }));
    } else {
      setProductData((prev) => ({ ...prev, [modalField]: modalValue }));
    }
    closeModal();
  };

  const handleUpdate = async () => {
    if (!productId) return;
    
    setUpdating(true);
    try {
      const payload = {
        ...productData,
        price: productData.price ? parseFloat(productData.price) : null,
        left_in_stock: productData.left_in_stock ? parseInt(productData.left_in_stock) : null,
        rating: productData.rating ? parseFloat(productData.rating) : null,
        reviews_count: productData.reviews_count ? parseInt(productData.reviews_count) : null,
      };

      const result = await dispatch(updateProductDetail({
        id: productId,
        payload
      }));

      if (result.type.endsWith("/fulfilled")) {
        setSuccess(true);
        setIsEditMode(false);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
        
        // Refresh product data
        dispatch(fetchProductDetail(productId));
      }
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setUpdating(false);
    }
  };

  const cancelEdit = () => {
    // Reset to original data
    if (productDetail && productDetail.id) {
      setProductData({
        title_en: productDetail.title_en || "",
        title_hi: productDetail.title_hi || "",
        title: productDetail.title || "",
        description_en: productDetail.description_en || "",
        description_hi: productDetail.description_hi || "",
        description: productDetail.description || "",
        price: productDetail.price || "",
        price_unit: productDetail.price_unit || "",
        left_in_stock: productDetail.left_in_stock || "",
        tags: productDetail.tags || [],
        link: productDetail.link || "",
        rating: productDetail.rating || "",
        reviews_count: productDetail.reviews_count || ""
      });
    }
    setIsEditMode(false);
  };

  const EditableInfoCard = ({ icon: Icon, title, field, value, type = "text", className = "" }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    field: string;
    value: React.ReactNode;
    type?: string;
    className?: string;
  }) => (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-4 relative ${className}`}>
      <div className="flex items-center space-x-3 mb-2">
        <Icon className="h-5 w-5 text-blue-600" />
        <span className="font-medium text-gray-700 dark:text-gray-300">{title}</span>
        {isEditMode && (
          <button
            onClick={() => openEditModal(field, String(value || ""))}
            className="ml-auto text-blue-600 hover:text-blue-800"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="text-gray-900 dark:text-white font-semibold">
        {value || "N/A"}
      </div>
    </div>
  );

  const EditableLanguageSection = ({ title, field, content, language }: {
    title: string;
    field: string;
    content: string;
    language: string;
  }) => {
    if (!content && !isEditMode) return null;
    
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Languages className="h-4 w-4 text-blue-600" />
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {title} ({language})
            </h4>
          </div>
          {isEditMode && (
            <button
              onClick={() => openEditModal(field, content)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
        </div>
        <div 
          className="text-gray-700 dark:text-gray-300 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: content || "No content available" }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      {/* Header with Back Button and Edit Controls */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </button>
        
        <div className="flex items-center space-x-4">
          {!isEditMode ? (
            <button
              onClick={() => setIsEditMode(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Pencil className="h-4 w-4" />
              <span>Edit Product</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {updating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{updating ? "Saving..." : "Save Changes"}</span>
              </button>
              <button
                onClick={cancelEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Product ID: {productId}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg">
          <div className="text-green-800 font-semibold text-center">
            Product updated successfully!
          </div>
        </div>
      )}

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
              <div className="relative">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {(isEditMode ? productData.title_en : productDetail.title_en) ||
                    (isEditMode ? productData.title : productDetail.title) ||
                    "Unnamed Product"}
                </h1>
                
                {(isEditMode ? productData.link : productDetail.link) && (
                  <a
                    href={isEditMode ? productData.link : productDetail.link}
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
                {/* Price Card */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 relative">
                  <div className="flex items-center space-x-3 mb-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Price</span>
                    {isEditMode && (
                      <div className="ml-auto flex space-x-1">
                        <button
                          onClick={() => openEditModal("price", String(isEditMode ? productData.price : productDetail.price || ""))}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-gray-900 dark:text-white font-semibold">
                    {isEditMode ? 
                      (productData.price ? `${productData.price} ${(productData.price_unit || "").toUpperCase()}` : "Price not available") :
                      (productDetail.price ? `${productDetail.price} ${(productDetail.price_unit || "").toUpperCase()}` : "Price not available")
                    }
                  </div>
                  {isEditMode && (
                    <div className="mt-2">
                      <button
                        onClick={() => openEditModal("price_unit", isEditMode ? productData.price_unit : productDetail.price_unit || "")}
                        className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded"
                      >
                        Edit Currency: {(isEditMode ? productData.price_unit : productDetail.price_unit || "USD").toUpperCase()}
                      </button>
                    </div>
                  )}
                </div>
                
                <EditableInfoCard
                  icon={Package}
                  title="Stock Available"
                  field="left_in_stock"
                  value={isEditMode ? productData.left_in_stock : productDetail.left_in_stock}
                  className={
                    (isEditMode ? productData.left_in_stock : productDetail.left_in_stock) === "0" || 
                    (isEditMode ? productData.left_in_stock : productDetail.left_in_stock) === 0 
                      ? "border-l-4 border-red-500" 
                      : (isEditMode ? productData.left_in_stock : productDetail.left_in_stock) && 
                        Number(isEditMode ? productData.left_in_stock : productDetail.left_in_stock) < 10
                      ? "border-l-4 border-yellow-500"
                      : "border-l-4 border-green-500"
                  }
                />

                {/* Rating Card */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 relative">
                  <div className="flex items-center space-x-3 mb-2">
                    <Star className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Rating</span>
                    {isEditMode && (
                      <div className="ml-auto flex space-x-1">
                        <button
                          onClick={() => openEditModal("rating", String(isEditMode ? productData.rating : productDetail.rating || ""))}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-gray-900 dark:text-white font-semibold">
                    {(isEditMode ? productData.rating : productDetail.rating) ? (
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(Number(isEditMode ? productData.rating : productDetail.rating))
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span>{isEditMode ? productData.rating : productDetail.rating}</span>
                      </div>
                    ) : "No rating"}
                  </div>
                  {isEditMode && (
                    <div className="mt-2">
                      <button
                        onClick={() => openEditModal("reviews_count", String(isEditMode ? productData.reviews_count : productDetail.reviews_count || ""))}
                        className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded"
                      >
                        Edit Reviews: {isEditMode ? productData.reviews_count : productDetail.reviews_count || 0} reviews
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 relative">
                  <div className="flex items-center space-x-3 mb-2">
                    <Tag className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Tags</span>
                    {isEditMode && (
                      <button
                        onClick={() => openEditModal("tags", (isEditMode ? productData.tags : productDetail.tags)?.join(", ") || "")}
                        className="ml-auto text-blue-600 hover:text-blue-800"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="text-gray-900 dark:text-white font-semibold">
                    {(isEditMode ? productData.tags : productDetail.tags) && (isEditMode ? productData.tags : productDetail.tags).length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {(isEditMode ? productData.tags : productDetail.tags).slice(0, 3).map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {(isEditMode ? productData.tags : productDetail.tags).length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{(isEditMode ? productData.tags : productDetail.tags).length - 3} more
                          </span>
                        )}
                      </div>
                    ) : "No tags"}
                  </div>
                </div>
              </div>

              {/* External Link and Additional Info */}
              {isEditMode && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <ExternalLink className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">External Link</span>
                    </div>
                    <button
                      onClick={() => openEditModal("link", productData.link)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-gray-900 dark:text-white font-semibold text-sm">
                    {productData.link ? (
                      <a 
                        href={productData.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 break-all"
                      >
                        {productData.link}
                      </a>
                    ) : "No link provided"}
                  </div>
                </div>
              )}

              {/* All Tags (if many) */}
              {(isEditMode ? productData.tags : productDetail.tags) && (isEditMode ? productData.tags : productDetail.tags).length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    All Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(isEditMode ? productData.tags : productDetail.tags).map((tag: string, index: number) => (
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
              <EditableLanguageSection 
                title="Title" 
                field="title_en"
                content={isEditMode ? productData.title_en : productDetail.title_en || ""} 
                language="English" 
              />
              <EditableLanguageSection 
                title="Title" 
                field="title_hi"
                content={isEditMode ? productData.title_hi : productDetail.title_hi || ""} 
                language="Hindi" 
              />
              <EditableLanguageSection 
                title="Title" 
                field="title"
                content={isEditMode ? productData.title : productDetail.title || ""} 
                language="Default" 
              />
            </div>
          </div>

          {/* Descriptions Section */}
          {(isEditMode || productDetail.description_en || productDetail.description_hi || productDetail.description) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-600" />
                <span>Product Descriptions</span>
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <EditableLanguageSection 
                  title="Description" 
                  field="description_en"
                  content={isEditMode ? productData.description_en : productDetail.description_en || ""} 
                  language="English" 
                />
                <EditableLanguageSection 
                  title="Description" 
                  field="description_hi"
                  content={isEditMode ? productData.description_hi : productDetail.description_hi || ""} 
                  language="Hindi" 
                />
                <EditableLanguageSection 
                  title="Description" 
                  field="description"
                  content={isEditMode ? productData.description : productDetail.description || ""} 
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
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">Created At</span>
                </div>
                <div className="text-gray-900 dark:text-white font-semibold">
                  {formatDate(productDetail.created_at)}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">Last Updated</span>
                </div>
                <div className="text-gray-900 dark:text-white font-semibold">
                  {formatDate(productDetail.updated_at)}
                </div>
              </div>
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

      {/* Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Edit {modalField.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {modalField === 'tags' ? (
              <div className="space-y-4">
                <textarea
                  value={modalValue}
                  onChange={(e) => setModalValue(e.target.value)}
                  placeholder="Enter tags separated by commas (e.g., tag1, tag2, tag3)"
                  className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Separate multiple tags with commas
                </p>
              </div>
            ) : modalField.includes('description') ? (
              <textarea
                value={modalValue}
                onChange={(e) => setModalValue(e.target.value)}
                className="w-full h-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                placeholder={`Enter ${modalField.replace(/_/g, " ")}...`}
              />
            ) : modalField === 'price_unit' ? (
              <select
                value={modalValue}
                onChange={(e) => setModalValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="inr">INR</option>
                <option value="gbp">GBP</option>
                <option value="jpy">JPY</option>
                <option value="cad">CAD</option>
                <option value="aud">AUD</option>
              </select>
            ) : modalField === 'rating' ? (
              <div className="space-y-4">
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={modalValue}
                  onChange={(e) => setModalValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter rating (0-10)"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter a rating between 0 and 10
                </p>
              </div>
            ) : (
              <input
                type={modalField === 'price' || modalField === 'left_in_stock' || modalField === 'reviews_count' ? 'number' : 'text'}
                value={modalValue}
                onChange={(e) => setModalValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder={`Enter ${modalField.replace(/_/g, " ")}...`}
                {...(modalField === 'price' && { step: '0.01', min: '0' })}
                {...(modalField === 'left_in_stock' && { min: '0' })}
                {...(modalField === 'reviews_count' && { min: '0' })}
              />
            )}
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;