import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, X } from "lucide-react";
import { fetchZonesDetails, updateZoneDetails } from "../../store/slices/Zone";
import { RootState } from "../../store";
import TiptapEditor from "../../components/TiptapEditor";

const ZoneEdit: React.FC = () => {
  const { zoneId } = useParams<{ zoneId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, details, items } = useSelector((state: RootState) => state.zone);
  // Add this line to get the token from auth slice
  const token = useSelector((state: RootState) => state.auth.token);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalField, setModalField] = useState<string>("");
  const [modalValue, setModalValue] = useState<string>("");
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [modalType, setModalType] = useState<"details" | "items">("details");

  // Local state for editing
  const [zoneDetails, setZoneDetails] = useState({
    color_en: "",
    color_hi: "",
    shape_en: "",
    shape_hi: "",
    element_en: "",
    element_hi: "",
  });

  const [zoneItems, setZoneItems] = useState<
    Array<{
      name: string;
      meaning_en: string | null;
      meaning_hi: string | null;
    }>
  >([]);

  const [success, setSuccess] = useState(false);

  const openEditModal = (
    field: string,
    value: string,
    type: "details" | "items" = "details",
    idx?: number
  ) => {
    setModalField(field);
    setModalValue(value || "");
    setModalType(type);
    setModalIdx(idx ?? null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalField("");
    setModalValue("");
    setModalIdx(null);
    setModalType("details");
  };

  const handleModalSave = () => {
    if (modalType === "items" && modalIdx !== null) {
      // Item field
      setZoneItems((prev) => {
        const updated = [...prev];
        updated[modalIdx] = { ...updated[modalIdx], [modalField]: modalValue };
        return updated;
      });
    } else {
      // Details field
      setZoneDetails((prev) => ({ ...prev, [modalField]: modalValue }));
    }
    closeModal();
  };

  useEffect(() => {
    if (zoneId) {
      dispatch(fetchZonesDetails({ letter: zoneId }));
    }
  }, [zoneId, dispatch]);

  useEffect(() => {
    if (details) {
      setZoneDetails({
        color_en: details.color_en || "",
        color_hi: details.color_hi || "",
        shape_en: details.shape_en || "",
        shape_hi: details.shape_hi || "",
        element_en: details.element_en || "",
        element_hi: details.element_hi || "",
      });
    }
    if (items) {
      setZoneItems(items);
    }
  }, [details, items]);

  const handleUpdate = async () => {
    if (!zoneId) return;
    if (!token) {
      alert("Authentication required to update zone.");
      return;
    }
    try {
      // Pass the token to the thunk
      const result = await dispatch(
        updateZoneDetails({
          letter: zoneId.toLowerCase(),
          details: zoneDetails,
          items: zoneItems,
          token, // Pass token here
        })
      );
      
      // Check if update was successful (adjust based on your Redux setup)
      if (result.type.endsWith('/fulfilled')) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (loading) return <div className="text-blue-600 text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-600 text-center p-8">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Back Button */}
      <button
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

      <h2 className="text-2xl font-bold mb-8 text-center">
        Edit Zone: {zoneId?.toUpperCase()}
      </h2>

      {/* Zone Details Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Zone Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Colors */}
          <div className="border rounded-lg p-4 pb-0 max-h-72 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Colors (English)</h4>
              <button
                onClick={() => openEditModal("color_en", zoneDetails.color_en)}
                className="ml-2 text-blue-600"
              >
                <Pencil className="h-5 w-5" />
              </button>
            </div>
            <div className="text-gray-700 whitespace-pre-line">
              {zoneDetails.color_en}
            </div>
          </div>
          
          <div className="border rounded-lg p-4 pb-0 max-h-72 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Colors (Hindi)</h4>
              <button
                onClick={() => openEditModal("color_hi", zoneDetails.color_hi)}
                className="ml-2 text-blue-600"
              >
                <Pencil className="h-5 w-5" />
              </button>
            </div>
            <div className="text-gray-700 whitespace-pre-line">
              {zoneDetails.color_hi}
            </div>
          </div>

          {/* Shapes */}
          <div className="border rounded-lg p-4 pb-0 max-h-72 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Shapes (English)</h4>
              <button
                onClick={() => openEditModal("shape_en", zoneDetails.shape_en)}
                className="ml-2 text-blue-600"
              >
                <Pencil className="h-5 w-5" />
              </button>
            </div>
            <div className="text-gray-700 whitespace-pre-line">
              {zoneDetails.shape_en}
            </div>
          </div>
          
          <div className="border rounded-lg p-4 pb-0 max-h-72 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Shapes (Hindi)</h4>
              <button
                onClick={() => openEditModal("shape_hi", zoneDetails.shape_hi)}
                className="ml-2 text-blue-600"
              >
                <Pencil className="h-5 w-5" />
              </button>
            </div>
            <div className="text-gray-700 whitespace-pre-line">
              {zoneDetails.shape_hi}
            </div>
          </div>

          {/* Elements */}
          <div className="border rounded-lg p-4 pb-0 max-h-72 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Elements (English)</h4>
              <button
                onClick={() => openEditModal("element_en", zoneDetails.element_en)}
                className="ml-2 text-blue-600"
              >
                <Pencil className="h-5 w-5" />
              </button>
            </div>
            <div className="text-gray-700 whitespace-pre-line">
              {zoneDetails.element_en}
            </div>
          </div>
          
          <div className="border rounded-lg p-4 pb-0 max-h-72 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Elements (Hindi)</h4>
              <button
                onClick={() => openEditModal("element_hi", zoneDetails.element_hi)}
                className="ml-2 text-blue-600"
              >
                <Pencil className="h-5 w-5" />
              </button>
            </div>
            <div className="text-gray-700 whitespace-pre-line">
              {zoneDetails.element_hi}
            </div>
          </div>
        </div>
      </div>

      {/* Zone Items Section */}
      {zoneItems && zoneItems.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Vastu Items in Zone</h3>
          {zoneItems.map((item, idx) => (
            <div key={idx} className="mb-8 border-b pb-6">
              <h4 className="text-lg font-bold mb-4 capitalize">
                {item.name.replace(/_/g, ' ')}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4 pb-0 max-h-72 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-semibold">
                      {item.name} in {zoneId?.toUpperCase()} Meaning (English)
                    </h5>
                    <button
                      onClick={() => 
                        openEditModal("meaning_en", item.meaning_en || "", "items", idx)
                      }
                      className="ml-2 text-blue-600"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                  </div>
                  <div 
                    className="text-gray-700 text-sm whitespace-pre-line overflow-auto"
                    dangerouslySetInnerHTML={{ __html: item.meaning_en || "" }}
                  />
                </div>
                
                <div className="border rounded-lg p-4 pb-0 max-h-72 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-semibold">
                      {item.name} in {zoneId?.toUpperCase()} Meaning (Hindi)
                    </h5>
                    <button
                      onClick={() => 
                        openEditModal("meaning_hi", item.meaning_hi || "", "items", idx)
                      }
                      className="ml-2 text-blue-600"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                  </div>
                  <div 
                    className="text-gray-700 text-sm whitespace-pre-line overflow-auto"
                    dangerouslySetInnerHTML={{ __html: item.meaning_hi || "" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Button */}
      <div className="flex justify-center mt-8">
        <button
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow disabled:opacity-50"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Zone"}
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mt-4 text-green-700 text-center font-semibold">
          Zone details updated successfully!
        </div>
      )}

      {/* Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto relative">
            {/* Cross Icon for closing */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <h3 className="text-lg font-bold mb-4">
              Edit {modalField.replace(/_/g, ' ').toUpperCase()}
            </h3>
            {/* Use TiptapEditor for rich text editing */}
            <TiptapEditor
              value={modalValue}
              onChange={setModalValue}
              height="400px"
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
    </div>
  );
};

export default ZoneEdit;