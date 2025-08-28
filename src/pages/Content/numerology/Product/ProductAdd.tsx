import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../../../store/slices/products';
import { AppDispatch, RootState } from '../../../../store';
import { useNavigate } from 'react-router-dom';

const ProductAdd = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.products);

  const [name, setName] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    // If you have more fields, add them to formData
    const formData = new FormData();
    formData.append('name', name);

    const result = await dispatch(createProduct(formData));
    if (result.type.endsWith('fulfilled')) {
      setSuccess(true);
      setName('');
      setTimeout(() => {
        navigate('/products');
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        {/* Add more product fields here if needed */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
        {success && (
          <p className="text-green-600">
            Product added successfully! Redirecting...
          </p>
        )}
      </form>
    </div>
  );
};

export default ProductAdd;
