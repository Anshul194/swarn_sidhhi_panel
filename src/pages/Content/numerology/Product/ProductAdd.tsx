import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../../../store/slices/products';
import { AppDispatch, RootState } from '../../../../store';
import { useNavigate } from 'react-router-dom';

const ProductAdd: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.products);

  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionHi, setDescriptionHi] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [price, setPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState('');
  const [link, setLink] = useState('');
  const [rating, setRating] = useState('');
  const [reviewsCount, setReviewsCount] = useState('');
  const [leftInStock, setLeftInStock] = useState('');
  const [success, setSuccess] = useState(false);

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
      setPrice('');
      setPriceUnit('');
      setLink('');
      setRating('');
      setReviewsCount('');
      setLeftInStock('');

      // Redirect after success
      setTimeout(() => navigate('/products'), 1200);
    }
  };

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 mx-auto max-w-xl">
      <h2 className="text-xl font-bold mb-6">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title (English)</label>
          <input
            type="text"
            value={titleEn}
            onChange={e => setTitleEn(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Title (Hindi)</label>
          <input
            type="text"
            value={titleHi}
            onChange={e => setTitleHi(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Description (English)</label>
          <textarea
            value={descriptionEn}
            onChange={e => setDescriptionEn(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Description (Hindi)</label>
          <textarea
            value={descriptionHi}
            onChange={e => setDescriptionHi(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files ? e.target.files[0] : null)}
            className="w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Price</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Price Unit</label>
          <input
            type="text"
            value={priceUnit}
            onChange={e => setPriceUnit(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Link</label>
          <input
            type="url"
            value={link}
            onChange={e => setLink(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Rating</label>
          <input
            type="number"
            step="0.1"
            value={rating}
            onChange={e => setRating(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Reviews Count</label>
          <input
            type="number"
            value={reviewsCount}
            onChange={e => setReviewsCount(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Left In Stock</label>
          <input
            type="number"
            value={leftInStock}
            onChange={e => setLeftInStock(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">Product added successfully! Redirecting...</p>}
      </form>
    </div>
  );
};

export default ProductAdd;
