import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNumerologyNumberById } from "../../../../store/slices/numerologyNumbers";

const EditNumbers = () => {
  const dispatch = useDispatch();
  const numberId = 2; // You can make this dynamic if needed
  const { data, loading, error } = useSelector(
    (state: any) => state.numerologyNumbers
  );

  useEffect(() => {
    dispatch(fetchNumerologyNumberById({ id: numberId }));
  }, [dispatch, numberId]);

  const personality = data?.personality || {};
  const remedy = data?.remedy || {};
  const products = data?.products || [];

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 xl:px-10 xl:py-12 mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8">
        Number: {numberId}
      </h1>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* Personality Section */}
      <h2 className="text-xl font-bold mb-6">Personality</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="border rounded-lg p-6">
          <h3 className="font-bold mb-2">Positive (English)</h3>
          <div className="text-sm whitespace-pre-line">
            {personality.positive_en || "No data available."}
          </div>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="font-bold mb-2">Positive (Hindi)</h3>
          <div className="text-sm whitespace-pre-line">
            {personality.positive_hi || "No data available."}
          </div>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="font-bold mb-2">Negative (English)</h3>
          <div className="text-sm whitespace-pre-line">
            {personality.negative_en || "No data available."}
          </div>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="font-bold mb-2">Negative (Hindi)</h3>
          <div className="text-sm whitespace-pre-line">
            {personality.negative_hi || "No data available."}
          </div>
        </div>
      </div>

      {/* Remedy Section */}
      <h2 className="text-xl font-bold mb-6">Remedy</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="border rounded-lg p-6">
          <h3 className="font-bold mb-2">Missing in Loshu Meaning (English)</h3>
          <div
            className="text-sm whitespace-pre-line"
            dangerouslySetInnerHTML={{
              __html:
                remedy.missing_meaning_in_loshu_en || "No data available.",
            }}
          />
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="font-bold mb-2">Missing in Loshu Meaning (Hindi)</h3>
          <div
            className="text-sm whitespace-pre-line"
            dangerouslySetInnerHTML={{
              __html:
                remedy.missing_meaning_in_loshu_hi || "No data available.",
            }}
          />
        </div>
      </div>

      {/* Products Section */}
      <h2 className="text-xl font-bold mb-6">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {products.length > 0 ? (
          products.map((product: any, idx: number) => (
            <div key={idx} className="border rounded-lg p-6">
              <h3 className="font-bold mb-2">
                Title: {product.title || "Product"}
              </h3>
              <div className="text-sm whitespace-pre-line">
                {product.description || "No description."}
              </div>
              {/* Add more product fields as needed */}
            </div>
          ))
        ) : (
          <div className="border rounded-lg p-6 text-center text-gray-500">
            Insert More Product
          </div>
        )}
      </div>
    </div>
  );
};

export default EditNumbers;
