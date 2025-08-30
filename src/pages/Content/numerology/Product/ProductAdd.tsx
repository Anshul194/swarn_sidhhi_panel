// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { createProduct } from '../../../../store/slices/products';
// import { AppDispatch, RootState } from '../../../../store';
// import { useNavigate } from 'react-router-dom';
// import { Upload, ImageIcon } from 'lucide-react';

// const ProductAdd: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const { loading, error } = useSelector((state: RootState) => state.products);

//   const [titleEn, setTitleEn] = useState('');
//   const [titleHi, setTitleHi] = useState('');
//   const [descriptionEn, setDescriptionEn] = useState('');
//   const [descriptionHi, setDescriptionHi] = useState('');
//   const [image, setImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [price, setPrice] = useState('');
//   const [priceUnit, setPriceUnit] = useState('');
//   const [link, setLink] = useState('');
//   const [rating, setRating] = useState('');
//   const [reviewsCount, setReviewsCount] = useState('');
//   const [leftInStock, setLeftInStock] = useState('');
//   const [success, setSuccess] = useState(false);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files ? e.target.files[0] : null;
//     setImage(file);
    
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImagePreview(e.target?.result as string);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       setImagePreview(null);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSuccess(false);

//     const formData = new FormData();
//     formData.append('title_en', titleEn);
//     formData.append('title_hi', titleHi);
//     formData.append('description_en', descriptionEn);
//     formData.append('description_hi', descriptionHi);
//     if (image) formData.append('image', image);
//     formData.append('price', price);
//     formData.append('price_unit', priceUnit);
//     formData.append('link', link);
//     formData.append('rating', rating);
//     formData.append('reviews_count', reviewsCount);
//     formData.append('left_in_stock', leftInStock);

//     const result = await dispatch(createProduct(formData));
//     if (result.type.endsWith('fulfilled')) {
//       setSuccess(true);

//       // Reset form
//       setTitleEn('');
//       setTitleHi('');
//       setDescriptionEn('');
//       setDescriptionHi('');
//       setImage(null);
//       setImagePreview(null);
//       setPrice('');
//       setPriceUnit('');
//       setLink('');
//       setRating('');
//       setReviewsCount('');
//       setLeftInStock('');

//       // Redirect after success
//       setTimeout(() => navigate('/products/list'), 2000);
//     }
//   };

//   return (
//     <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 mx-auto max-w-6xl">
      
//       {/* Back Button */}
//       <button
//         className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors"
//         onClick={() => navigate(-1)}
//       >
//         &larr; Back
//       </button>

//       <h2 className="text-2xl font-bold mb-8 text-center">Add New Product</h2>

//       <form onSubmit={handleSubmit} className="space-y-8">
        
//         {/* Basic Information Section */}
//         <div className="bg-gray-50 dark:bg-gray-800/20 rounded-lg p-6">
//           <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Basic Information</h3>
          
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Title English */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Title (English) <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={titleEn}
//                 onChange={(e) => setTitleEn(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
//                 placeholder="Enter product title in English"
//                 required
//               />
//             </div>

//             {/* Title Hindi */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Title (Hindi) <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={titleHi}
//                 onChange={(e) => setTitleHi(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
//                 placeholder="हिंदी में उत्पाद का शीर्षक दर्ज करें"
//                 required
//               />
//             </div>

//             {/* Description English */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Description (English) <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 value={descriptionEn}
//                 onChange={(e) => setDescriptionEn(e.target.value)}
//                 rows={4}
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none dark:bg-gray-700 dark:text-white"
//                 placeholder="Enter detailed product description in English"
//                 required
//               />
//             </div>

//             {/* Description Hindi */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Description (Hindi) <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 value={descriptionHi}
//                 onChange={(e) => setDescriptionHi(e.target.value)}
//                 rows={4}
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none dark:bg-gray-700 dark:text-white"
//                 placeholder="हिंदी में विस्तृत उत्पाद विवरण दर्ज करें"
//                 required
//               />
//             </div>
//           </div>
//         </div>

//         {/* Product Image Section */}
//         <div className="bg-gray-50 dark:bg-gray-800/20 rounded-lg p-6">
//           <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Product Image</h3>
          
//           <div className="space-y-4">
//             <div className="flex items-center justify-center w-full">
//               <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 transition-colors">
//                 {imagePreview ? (
//                   <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
//                 ) : (
//                   <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                     <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
//                     <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
//                       <span className="font-semibold">Click to upload</span> or drag and drop
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or JPEG (MAX. 5MB)</p>
//                   </div>
//                 )}
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="hidden"
//                   required
//                 />
//               </label>
//             </div>
//             {image && (
//               <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
//                 Selected: {image.name}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Pricing and Stock Section */}
//         <div className="bg-gray-50 dark:bg-gray-800/20 rounded-lg p-6">
//           <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Pricing & Stock</h3>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {/* Price */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Price <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
//                 placeholder="0.00"
//                 required
//               />
//             </div>

//             {/* Price Unit */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Price Unit <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={priceUnit}
//                 onChange={(e) => setPriceUnit(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
//                 placeholder="e.g., ₹, $, per kg, per piece"
//                 required
//               />
//             </div>

//             {/* Stock */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Stock Quantity <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="number"
//                 min="0"
//                 value={leftInStock}
//                 onChange={(e) => setLeftInStock(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
//                 placeholder="0"
//                 required
//               />
//             </div>
//           </div>
//         </div>

//         {/* Additional Information Section */}
//         <div className="bg-gray-50 dark:bg-gray-800/20 rounded-lg p-6">
//           <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Additional Information</h3>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {/* Product Link */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Product Link
//               </label>
//               <input
//                 type="url"
//                 value={link}
//                 onChange={(e) => setLink(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
//                 placeholder="https://example.com/product"
//               />
//             </div>

//             {/* Rating */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Rating
//               </label>
//               <input
//                 type="number"
//                 step="0.1"
//                 min="0"
//                 max="5"
//                 value={rating}
//                 onChange={(e) => setRating(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
//                 placeholder="0.0 - 5.0"
//               />
//             </div>

//             {/* Reviews Count */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Reviews Count
//               </label>
//               <input
//                 type="number"
//                 min="0"
//                 value={reviewsCount}
//                 onChange={(e) => setReviewsCount(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
//                 placeholder="0"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Form Actions */}
//         <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//             disabled={loading}
//           >
//             {loading ? (
//               <div className="flex items-center space-x-2">
//                 <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//                 <span>Adding Product...</span>
//               </div>
//             ) : (
//               'Add Product'
//             )}
//           </button>
//         </div>

//         {/* Status Messages */}
//         {error && (
//           <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
//             <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
//           </div>
//         )}
        
//         {success && (
//           <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
//             <p className="text-green-600 dark:text-green-400 text-sm font-medium">
//               Product added successfully! Redirecting to products page...
//             </p>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default ProductAdd;


import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../../../store/slices/products';
import { AppDispatch, RootState } from '../../../../store';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  ImageIcon, 
  DollarSign, 
  Package, 
  Star, 
  Tag, 
  Globe, 
  Languages,
  ExternalLink,
  Save
} from 'lucide-react';

const ProductAdd: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.products);

  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionHi, setDescriptionHi] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [price, setPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState('');
  const [link, setLink] = useState('');
  const [rating, setRating] = useState('');
  const [reviewsCount, setReviewsCount] = useState('');
  const [leftInStock, setLeftInStock] = useState('');
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    const formData = new FormData();
    formData.append('title_en', titleEn);
    formData.append('title_hi', titleHi);
    formData.append('description_en', descriptionEn);
    formData.append('description_hi', descriptionHi);
    if (image) formData.append('image', image);
    formData.append('price', price);
    formData.append('price_unit', priceUnit);
    formData.append('link', link);
    formData.append('rating', rating);
    formData.append('reviews_count', reviewsCount);
    formData.append('left_in_stock', leftInStock);

    const result = await dispatch(createProduct(formData));
    if (result.type.endsWith('fulfilled')) {
      setSuccess(true);

      // Reset form
      setTitleEn('');
      setTitleHi('');
      setDescriptionEn('');
      setDescriptionHi('');
      setImage(null);
      setImagePreview(null);
      setPrice('');
      setPriceUnit('');
      setLink('');
      setRating('');
      setReviewsCount('');
      setLeftInStock('');

      // Redirect after success
      setTimeout(() => navigate('/products/list'), 2000);
    }
  };

  const InputField = ({ 
    icon: Icon, 
    label, 
    value, 
    onChange, 
    type = "text", 
    placeholder = "", 
    required = false,
    ...props 
  }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    [key: string]: any;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Icon className="h-4 w-4 text-blue-600" />
        <label className="font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none dark:bg-gray-800 dark:text-white"
          {...props}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:text-white"
          {...props}
        />
      )}
    </div>
  );

  const SectionCard = ({ 
    icon: Icon, 
    title, 
    children 
  }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center space-x-2">
        <Icon className="h-5 w-5 text-blue-600" />
        <span>{title}</span>
      </h3>
      {children}
    </div>
  );

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
          Create New Product
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Creating product...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Product Image Section */}
          <SectionCard icon={ImageIcon} title="Product Image">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Upload */}
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or JPEG (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required
                    />
                  </label>
                </div>
                {image && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Selected: {image.name}
                  </p>
                )}
              </div>

              {/* Image Preview */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Preview</h4>
                <div className="w-full max-w-md">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                        <p>No image selected</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Product Titles Section */}
          <SectionCard icon={Languages} title="Product Titles">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
                <InputField
                  icon={Globe}
                  label="Title (English)"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Enter product title in English"
                  required
                />
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
                <InputField
                  icon={Globe}
                  label="Title (Hindi)"
                  value={titleHi}
                  onChange={(e) => setTitleHi(e.target.value)}
                  placeholder="हिंदी में उत्पाद का शीर्षक दर्ज करें"
                  required
                />
              </div>
            </div>
          </SectionCard>

          {/* Product Descriptions Section */}
          <SectionCard icon={Globe} title="Product Descriptions">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
                <InputField
                  icon={Languages}
                  label="Description (English)"
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  type="textarea"
                  placeholder="Enter detailed product description in English"
                  required
                />
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
                <InputField
                  icon={Languages}
                  label="Description (Hindi)"
                  value={descriptionHi}
                  onChange={(e) => setDescriptionHi(e.target.value)}
                  type="textarea"
                  placeholder="हिंदी में विस्तृत उत्पाद विवरण दर्ज करें"
                  required
                />
              </div>
            </div>
          </SectionCard>

          {/* Pricing and Stock Section */}
          <SectionCard icon={DollarSign} title="Pricing & Stock Information">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <InputField
                  icon={DollarSign}
                  label="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <InputField
                  icon={Tag}
                  label="Price Unit"
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  placeholder="usd , inr "
                  required
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <InputField
                  icon={Package}
                  label="Stock Quantity"
                  value={leftInStock}
                  onChange={(e) => setLeftInStock(e.target.value)}
                  type="number"
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </SectionCard>

          {/* Additional Information Section */}
          <SectionCard icon={Star} title="Additional Information">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <InputField
                  icon={ExternalLink}
                  label="Product Link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  type="url"
                  placeholder="https://example.com/product"
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <InputField
                  icon={Star}
                  label="Rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="5.5"
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <InputField
                  icon={Tag}
                  label="Reviews Count"
                  value={reviewsCount}
                  onChange={(e) => setReviewsCount(e.target.value)}
                  type="number"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </SectionCard>

          {/* Form Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>

              <button
                type="submit"
                className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Creating Product...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Create Product</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-red-800 font-semibold mb-2">Error Creating Product</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-green-800 font-semibold mb-2">Success!</h3>
              <p className="text-green-600 text-sm">
                Product created successfully! Redirecting to products page...
              </p>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default ProductAdd;