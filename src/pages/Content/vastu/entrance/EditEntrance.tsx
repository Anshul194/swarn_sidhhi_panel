import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, X } from "lucide-react";
import { fetchEntranceById, updateEntranceById } from "../../../../store/slices/entrance";
import { RootState, AppDispatch } from "../../../../store";
import TiptapEditor from "../../../../components/TiptapEditor";

const EntranceEdit: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const entranceId = location.state?.entranceId;

  const { entranceDetails, loading, error } = useSelector(
    (state: RootState) => state.entrance
  );
  const token = useSelector((state: RootState) => state.auth.token);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalField, setModalField] = useState<string>("");
  const [modalValue, setModalValue] = useState<string>("");
  const [success, setSuccess] = useState(false);

  // Local editable state
  const [entranceData, setEntranceData] = useState({
    title_en: "",
    title_hi: "",
    meaning_en: "",
    meaning_hi: "",
  });

  // Fetch entrance
  useEffect(() => {
    if (entranceId && token) {
      dispatch(fetchEntranceById({ id: entranceId, token }));
    }
  }, [dispatch, entranceId, token]);

  // Set local data
  useEffect(() => {
    if (entranceDetails) {
      setEntranceData({
        title_en: entranceDetails.title_en || "",
        title_hi: entranceDetails.title_hi || "",
        meaning_en: entranceDetails.meaning_en || "",
        meaning_hi: entranceDetails.meaning_hi || "",
      });
    }
  }, [entranceDetails]);

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
    setEntranceData((prev) => ({ ...prev, [modalField]: modalValue }));
    closeModal();
  };

  const handleUpdate = async () => {
    if (!entranceId || !token) return;
    try {
      const result = await dispatch(
        updateEntranceById({
          id: entranceId,
          payload: entranceData,
          token,
        })
      );
      if (result.type.endsWith("/fulfilled")) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate("/entrances/details", { state: { entranceId } });
        }, 1200);
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (!entranceId) return <div className="p-8 text-gray-500">No Entrance selected.</div>;
  if (loading) return <div className="p-8 text-blue-500">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-lg">
      {/* Back Button */}
      <button
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center">
        Edit Entrance: {entranceData.title_en || entranceId?.toUpperCase()}
      </h2>

      {/* Titles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border p-4 rounded relative">
          <h4 className="font-semibold mb-2">Title (English)</h4>
          <div className="text-gray-700">{entranceData.title_en || "-"}</div>
          <button
            onClick={() => openEditModal("title_en", entranceData.title_en)}
            className="absolute top-4 right-4 text-blue-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>

        <div className="border p-4 rounded relative">
          <h4 className="font-semibold mb-2">Title (Hindi)</h4>
          <div className="text-gray-700">{entranceData.title_hi || "-"}</div>
          <button
            onClick={() => openEditModal("title_hi", entranceData.title_hi)}
            className="absolute top-4 right-4 text-blue-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Meanings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-4 rounded relative">
          <h4 className="font-semibold mb-2">Meaning (English)</h4>
          <div
            className="text-gray-700 text-sm"
            dangerouslySetInnerHTML={{ __html: entranceData.meaning_en }}
          />
          <button
            onClick={() => openEditModal("meaning_en", entranceData.meaning_en)}
            className="absolute top-4 right-4 text-blue-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>

        <div className="border p-4 rounded relative">
          <h4 className="font-semibold mb-2">Meaning (Hindi)</h4>
          <div
            className="text-gray-700 text-sm"
            dangerouslySetInnerHTML={{ __html: entranceData.meaning_hi }}
          />
          <button
            onClick={() => openEditModal("meaning_hi", entranceData.meaning_hi)}
            className="absolute top-4 right-4 text-blue-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Update Button */}
      <div className="flex justify-end mt-8">
        <button
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow disabled:opacity-50"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Entrance"}
        </button>
      </div>

      {success && (
        <div className="mt-4 text-green-600 text-center font-semibold">
          Entrance updated successfully!
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <X className="h-6 w-6" />
            </button>
            <h3 className="text-lg font-bold mb-4">
              Edit {modalField.replace(/_/g, " ")}
            </h3>
            <TiptapEditor value={modalValue} onChange={setModalValue} height="300px" />
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

export default EntranceEdit;
