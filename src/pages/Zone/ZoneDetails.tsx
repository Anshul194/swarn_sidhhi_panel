import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchZonesDetails, updateZoneDetails } from '../../store/slices/Zone'
import { RootState } from '../../store'
import { Pencil, X } from "lucide-react";

const ZoneDetails = () => {
  const { zoneId } = useParams<{ zoneId: string }>()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, details, items } = useSelector((state: RootState) => state.zone)
  const token = useSelector((state: RootState) => state.auth.token);

  // Local editable state
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

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalField, setModalField] = useState<string>("");
  const [modalValue, setModalValue] = useState<string>("");
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [modalType, setModalType] = useState<"details" | "items">("details");

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

  useEffect(() => {
    if (zoneId) {
      dispatch(fetchZonesDetails({ letter: zoneId }))
    }
  }, [zoneId, dispatch])

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

  const [success, setSuccess] = useState(false);

  const handleModalSave = () => {
    if (modalType === "items" && modalIdx !== null) {
      setZoneItems((prev) => {
        const updated = [...prev];
        updated[modalIdx] = { ...updated[modalIdx], [modalField]: modalValue };
        return updated;
      });
    } else {
      setZoneDetails((prev) => ({ ...prev, [modalField]: modalValue }));
    }
    closeModal();
  };

  const handleUpdate = async () => {
    if (!zoneId) return;
    if (!token) {
      alert("Authentication required to update zone.");
      return;
    }
    try {
      const result = await dispatch(
        updateZoneDetails({
          letter: zoneId.toLowerCase(),
          details: zoneDetails,
          items: zoneItems,
          token,
        })
      );
      if (result.type.endsWith('/fulfilled')) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 mx-auto">
      
      {/* Back Button */}
      <button
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center">Zone {zoneId?.toUpperCase()}</h2>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* Details Section */}
      {details && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Details</h3>
          <div className="grid grid-cols-2 gap-6 mr-10 ">
            {/* Colors */}
            <div className="flex items-center space-x-2 relative">
              <label className="font-medium w-20">Colors:</label>
              <div className="flex-1 border rounded p-2 text-gray-700">
                {zoneDetails.color_en}
              </div>
              <button
                className="absolute top-3 right-5 text-blue-600"
                onClick={() => openEditModal("color_en", zoneDetails.color_en || "")}
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center space-x-2 relative">
              <div className="flex-1 border rounded p-2 text-gray-700">
                {zoneDetails.color_hi}
              </div>
              <button
                className="absolute top-3 right-5 text-blue-600"
                onClick={() => openEditModal("color_hi", zoneDetails.color_hi || "")}
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
      
            {/* Shapes */}
            <div className="flex items-center space-x-2 relative">
              <label className="font-medium w-20">Shapes:</label>
              <div className="flex-1 border rounded p-2 text-gray-700">
                {zoneDetails.shape_en}
              </div>
              <button
                className="absolute top-3 right-5 text-blue-600"
                onClick={() => openEditModal("shape_en", zoneDetails.shape_en || "")}
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center space-x-2 relative">
              <div className="flex-1 border rounded p-2 text-gray-700">
                {zoneDetails.shape_hi}
              </div>
              <button
                className="absolute top-3 right-5 text-blue-600"
                onClick={() => openEditModal("shape_hi", zoneDetails.shape_hi || "")}
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
      
            {/* Elements */}
            <div className="flex items-center space-x-2 relative">
              <label className="font-medium w-20">Elements:</label>
              <div className="flex-1 border rounded p-2 text-gray-700">
                {zoneDetails.element_en}
              </div>
              <button
                className="absolute top-3 right-5 text-blue-600"
                onClick={() => openEditModal("element_en", zoneDetails.element_en || "")}
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center space-x-2 relative">
              <div className="flex-1 border rounded p-2 text-gray-700">
                {zoneDetails.element_hi}
              </div>
              <button
                className="absolute top-3 right-5 text-blue-600"
                onClick={() => openEditModal("element_hi", zoneDetails.element_hi || "")}
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Items Section */}
      {zoneItems && zoneItems.length > 0 && (
        <div className="space-y-6">
          <h5 className="text-xl font-semibold mb-4">Vastu Items in House/Office</h5>
          {zoneItems.map((item, idx) => (
            <div key={idx} className="rounded p-4 bg-white">
              <h5 className="text-s font-bold mb-2 capitalize">{item.name.replace(/_/g, ' ')}</h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="border p-5 rounded text-gray-700 text-sm whitespace-pre-line capitalize relative">
                  <strong>{item.name} in {zoneId?.toUpperCase()} Meaning (English)</strong>
                  <p dangerouslySetInnerHTML={{ __html: item.meaning_en || "" }} />
                  <button
                    className="absolute top-2 right-2 text-blue-600"
                    onClick={() => openEditModal("meaning_en", item.meaning_en || "", "items", idx)}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
                <div className="border p-5 rounded text-gray-700 text-sm whitespace-pre-line capitalize relative">
                  <strong>{item.name} in {zoneId?.toUpperCase()} Meaning (Hindi)</strong>
                  <p dangerouslySetInnerHTML={{ __html: item.meaning_hi || "" }} />
                  <button
                    className="absolute top-2 right-2 text-blue-600"
                    onClick={() => openEditModal("meaning_hi", item.meaning_hi || "", "items", idx)}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30  backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto relative">
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
            <textarea
              className="w-full border rounded p-2 min-h-[200px]"
              value={modalValue}
              onChange={e => setModalValue(e.target.value)}
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
  )
}

export default ZoneDetails
