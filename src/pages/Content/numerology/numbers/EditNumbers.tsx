import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import TiptapEditor from "../../../../components/TiptapEditor";
import { Pencil } from "lucide-react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../../hooks/redux";
import {
  fetchProducts,
  createProduct,
} from "../../../../store/slices/products";
import {
  fetchNumerologyNumberById,
  updateNumerologyNumberById,
} from "../../../../store/slices/numerologyNumbers";
import { toast } from "react-hot-toast";

const EditNumbers = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const numberId = location.state?.numberId || 1;
  const { data, loading, error } = useSelector(
    (state: any) => state.numerologyNumbers
  );
  const productsState = useSelector((state: any) => state.products);
  const products = productsState.results || [];
  const [success, setSuccess] = React.useState(false);

  useEffect(() => {
    dispatch(fetchNumerologyNumberById({ id: numberId }));
    dispatch(fetchProducts({ limit: 50, offset: 0 }));
  }, [dispatch, numberId]);

  // Local state for editing
  const [editPersonality, setEditPersonality] = React.useState<any>({});
  const [editRemedy, setEditRemedy] = React.useState<any>({});
  const [editProducts, setEditProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (data) {
      setEditPersonality(data.personality || {});
      setEditRemedy(data.remedy || {});
      setEditProducts(data.products || []);
    }
  }, [data, success]);

  const personality = editPersonality;
  const remedy = editRemedy;

  // Modal state
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalValue, setModalValue] = React.useState("");
  const [modalField, setModalField] = React.useState<string>("");

  const openEditModal = (field: string, value: string) => {
    setModalField(field);
    setModalValue(value);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalValue("");
    setModalField("");
  };

  const handleModalSave = () => {
    // Update local state for edited field
    if (
      modalField.startsWith("positive") ||
      modalField.startsWith("negative")
    ) {
      setEditPersonality((prev: any) => ({
        ...prev,
        [modalField]: modalValue,
      }));
    } else if (modalField.startsWith("missing_meaning_in_loshu")) {
      setEditRemedy((prev: any) => ({ ...prev, [modalField]: modalValue }));
    }
    closeModal();
  };

  // Create Product Modal state and form
  const [createProductModal, setCreateProductModal] = React.useState(false);
  type ProductFormType = {
    title_en: string;
    title_hi: string;
    description_en: string;
    description_hi: string;
    image: File | null;
    price: string;
    price_unit: string;
    link: string;
    rating: string;
    reviews_count: string;
    left_in_stock: string;
  };
  const initialProductForm: ProductFormType = {
    title_en: "",
    title_hi: "",
    description_en: "",
    description_hi: "",
    image: null,
    price: "",
    price_unit: "",
    link: "",
    rating: "",
    reviews_count: "",
    left_in_stock: "",
  };
  const [productForm, setProductForm] =
    React.useState<ProductFormType>(initialProductForm);

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
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Positive (English)</h3>
            <button
              onClick={() =>
                openEditModal("positive_en", personality.positive_en || "")
              }
              className="ml-2 text-blue-600"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <div
            className="text-sm whitespace-pre-line"
            dangerouslySetInnerHTML={{
              __html: personality.positive_en || "No data available.",
            }}
          />
        </div>
        <div className="border rounded-lg p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Positive (Hindi)</h3>
            <button
              onClick={() =>
                openEditModal("positive_hi", personality.positive_hi || "")
              }
              className="ml-2 text-blue-600"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <div
            className="text-sm whitespace-pre-line"
            dangerouslySetInnerHTML={{
              __html: personality.positive_hi || "No data available.",
            }}
          />
        </div>
        <div className="border rounded-lg p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Negative (English)</h3>
            <button
              onClick={() =>
                openEditModal("negative_en", personality.negative_en || "")
              }
              className="ml-2 text-blue-600"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <div
            className="text-sm whitespace-pre-line"
            dangerouslySetInnerHTML={{
              __html: personality.negative_en || "No data available.",
            }}
          />
        </div>
        <div className="border rounded-lg p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Negative (Hindi)</h3>
            <button
              onClick={() =>
                openEditModal("negative_hi", personality.negative_hi || "")
              }
              className="ml-2 text-blue-600"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <div
            className="text-sm whitespace-pre-line"
            dangerouslySetInnerHTML={{
              __html: personality.negative_hi || "No data available.",
            }}
          />
        </div>
      </div>

      {/* Remedy Section */}
      <h2 className="text-xl font-bold mb-6">Remedy</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="border rounded-lg p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Missing in Loshu Meaning (English)</h3>
            <button
              onClick={() =>
                openEditModal(
                  "missing_meaning_in_loshu_en",
                  remedy.missing_meaning_in_loshu_en || ""
                )
              }
              className="ml-2 text-blue-600"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <div
            className="text-sm whitespace-pre-line"
            dangerouslySetInnerHTML={{
              __html:
                remedy.missing_meaning_in_loshu_en || "No data available.",
            }}
          />
        </div>
        <div className="border rounded-lg p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Missing in Loshu Meaning (Hindi)</h3>
            <button
              onClick={() =>
                openEditModal(
                  "missing_meaning_in_loshu_hi",
                  remedy.missing_meaning_in_loshu_hi || ""
                )
              }
              className="ml-2 text-blue-600"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        {productsState.loading ? (
          <div className="border rounded-lg p-6 text-center text-gray-500">
            Loading products...
          </div>
        ) : (
          <>
            {products.map((product: any, idx: number) => (
              <div
                key={idx}
                className="border rounded-lg p-3 flex flex-col gap-2"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt="Product"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No Image</span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-nowrap overflow-hidden">
                    Title: {product.title_en || product.title || "Product"}
                  </h3>
                </div>
                <div className="flex items-center justify-between gap-2 text-sm mb-1">
                  {/* Rating stars */}
                  {product.rating && (
                    <span className="flex items-center gap-1">
                      {Array.from({
                        length: Math.floor(Number(product.rating)),
                      }).map((_, i) => (
                        <span key={i} className="text-yellow-500">
                          ★
                        </span>
                      ))}
                      {Number(product.rating) % 1 !== 0 && (
                        <span className="text-yellow-500">☆</span>
                      )}
                      <span className="ml-1 font-semibold">
                        {product.rating}
                      </span>
                    </span>
                  )}
                  {product.price && (
                    <span className="font-semibold">
                      ₹ {product.price}
                      {product.price_unit ? ` ${product.price_unit}` : ""}
                    </span>
                  )}
                </div>
                <div className="text-sm whitespace-pre-line mb-1">
                  {product.description_en ||
                    product.description ||
                    "No description."}
                </div>
              </div>
            ))}
            <div
              className="border rounded-lg p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100"
              onClick={() => setCreateProductModal(true)}
            >
              <span className="font-bold text-blue-600 text-lg">
                + Insert More Product
              </span>
            </div>
          </>
        )}
      </div>
      {/* Create Product Modal */}
      {createProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-bold mb-4">Create Product</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData();
                formData.append("title_en", productForm.title_en);
                formData.append("title_hi", productForm.title_hi);
                formData.append("description_en", productForm.description_en);
                formData.append("description_hi", productForm.description_hi);
                if (productForm.image)
                  formData.append("image", productForm.image);
                formData.append("price", productForm.price);
                formData.append("price_unit", productForm.price_unit);
                formData.append("link", productForm.link);
                formData.append("rating", productForm.rating);
                formData.append("reviews_count", productForm.reviews_count);
                formData.append("left_in_stock", productForm.left_in_stock);
                const result = await dispatch(createProduct(formData));
                if (createProduct.fulfilled.match(result)) {
                  toast.success("Product created successfully!", {
                    duration: 4000,
                    position: "top-right",
                  });
                  setCreateProductModal(false);
                  setProductForm(initialProductForm);
                  dispatch(fetchProducts({ limit: 50, offset: 0 }));
                } else {
                  toast.error("Failed to create product.", {
                    duration: 4000,
                    position: "top-right",
                  });
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="border p-2 rounded mb-2"
                  placeholder="Title (English)"
                  value={productForm.title_en}
                  onChange={(e) =>
                    setProductForm((f) => ({ ...f, title_en: e.target.value }))
                  }
                  required
                />
                <input
                  className="border p-2 rounded mb-2"
                  placeholder="Title (Hindi)"
                  value={productForm.title_hi}
                  onChange={(e) =>
                    setProductForm((f) => ({ ...f, title_hi: e.target.value }))
                  }
                  required
                />
                <input
                  className="border p-2 rounded mb-2"
                  placeholder="Description (English)"
                  value={productForm.description_en}
                  onChange={(e) =>
                    setProductForm((f) => ({
                      ...f,
                      description_en: e.target.value,
                    }))
                  }
                  required
                />
                <input
                  className="border p-2 rounded mb-2"
                  placeholder="Description (Hindi)"
                  value={productForm.description_hi}
                  onChange={(e) =>
                    setProductForm((f) => ({
                      ...f,
                      description_hi: e.target.value,
                    }))
                  }
                  required
                />
                <input
                  className="border p-2 rounded mb-2"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file =
                      e.target.files && e.target.files[0]
                        ? e.target.files[0]
                        : null;
                    setProductForm((f) => ({ ...f, image: file }));
                  }}
                />
                <input
                  className="border p-2 rounded mb-2"
                  placeholder="Price"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm((f) => ({ ...f, price: e.target.value }))
                  }
                  required
                />
                <input
                  className="border p-2 rounded mb-2"
                  placeholder="Price Unit"
                  value={productForm.price_unit}
                  onChange={(e) =>
                    setProductForm((f) => ({
                      ...f,
                      price_unit: e.target.value,
                    }))
                  }
                  required
                />
                <input
                  className="border p-2 rounded mb-2"
                  placeholder="Link"
                  value={productForm.link}
                  onChange={(e) =>
                    setProductForm((f) => ({ ...f, link: e.target.value }))
                  }
                  required
                />
                <input
                  className="border p-2 rounded mb-2"
                  placeholder="Rating"
                  value={productForm.rating}
                  onChange={(e) =>
                    setProductForm((f) => ({ ...f, rating: e.target.value }))
                  }
                  required
                />
                <input
                  className="border p-2 rounded mb-2"
                  placeholder="Reviews Count"
                  value={productForm.reviews_count}
                  onChange={(e) =>
                    setProductForm((f) => ({
                      ...f,
                      reviews_count: e.target.value,
                    }))
                  }
                  required
                />
                <input
                  className="border p-2 rounded mb-2"
                  placeholder="Left In Stock"
                  value={productForm.left_in_stock}
                  onChange={(e) =>
                    setProductForm((f) => ({
                      ...f,
                      left_in_stock: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setCreateProductModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-bold mb-4">Edit Field</h3>
            <TiptapEditor
              value={modalValue}
              onChange={setModalValue}
              height="300px"
            />
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleModalSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Number Button */}
      <div className="mt-8 text-right">
        <button
          className="py-2 px-6 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
          onClick={async () => {
            if (!numberId) return;
            const result = await dispatch(
              updateNumerologyNumberById({
                id: numberId,
                payload: {
                  personality: editPersonality,
                  remedy: editRemedy,
                  products: editProducts,
                },
              })
            );
            if (updateNumerologyNumberById.fulfilled.match(result)) {
              toast.success("Number updated successfully!", {
                duration: 4000,
                position: "top-right",
              });
              setSuccess(true);
              setEditPersonality(editPersonality);
              setEditRemedy(editRemedy);
              setEditProducts(editProducts);
              dispatch(fetchNumerologyNumberById({ id: numberId }));
              setTimeout(() => setSuccess(false), 2000);
            } else {
              toast.error("Failed to update number.", {
                duration: 4000,
                position: "top-right",
              });
            }
          }}
          disabled={loading}
        >
          Update Number
        </button>
      </div>
      {success && (
        <div className="mt-4 text-green-700 text-center font-semibold">
          Number updated successfully!
        </div>
      )}
    </div>
  );
};

export default EditNumbers;
