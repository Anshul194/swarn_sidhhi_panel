import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEntranceById, updateEntranceById } from "../../../../store/slices/entrance";
import { fetchEntranceById } from "../../../../store/slices/entrance";
import { updateEntranceById } from "../../../../store/slices/entrance";
import TiptapEditor from "../../../../components/TiptapEditor";
import { RootState, AppDispatch } from "../../../../store";
import { Pencil, X } from "lucide-react";
import TiptapEditor from "../../../../components/TiptapEditor";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";

const EntranceDetails: React.FC = () => {
  // Get token from Redux
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editField, setEditField] = useState<"meaning_en" | "meaning_hi" | "">(
    ""
  );
  const [editValue, setEditValue] = useState("");

  // Update handler: dispatch updateEntranceById thunk
  const handleUpdate = async () => {
    if (!entranceId) return;
    const payload: any = {};
    if (editField === "meaning_en") payload.meaning_en = editValue;
    if (editField === "meaning_hi") payload.meaning_hi = editValue;
    const result = await dispatch(
      updateEntranceById({ id: entranceId, payload })
    );
    if (updateEntranceById.fulfilled.match(result)) {
      if (editField === "meaning_en") setMeaningEn(editValue);
      if (editField === "meaning_hi") setMeaningHi(editValue);
      setEditModalOpen(false);
      setEditField("");
      setEditValue("");
    } else {
      // Optionally show error
      alert("Failed to update entrance.");
    }
  };
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const entranceId = location.state?.entranceId;

  const { entranceDetails, loading, error } = useSelector(
    (state: RootState) => state.entrance ?? { entranceDetails: null, loading: false, error: null }
  const { entranceDetails, loading, error } = useSelector(
    (state: RootState) =>
      state.entrance ?? { entranceDetails: null, loading: false, error: null }
  );

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalField, setModalField] = useState<string>("");
  const [modalValue, setModalValue] = useState<string>("");
  const [success, setSuccess] = useState(false);

  // Local editable state
  const [entranceData, setEntranceData] = useState({
    // title_en: "",
    // title_hi: "",
    meaning_en: "",
    meaning_hi: "",
  });

  useEffect(() => {
    if (entranceId) {
      dispatch(fetchEntranceById({ id: entranceId.toLowerCase() }));
    }
  }, [entranceId, dispatch]);

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
        }, 1200);
      }
    } catch (err) {
      // handle error
    }
  };

  if (!entranceId) return <div className="p-8 text-gray-500">No Entrance selected.</div>;
  if (loading) return <div className="p-8 text-blue-500">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen max-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 xl:px-10 xl:py-12 mx-auto overflow-y-auto">
      {/* <button
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button> */}

      <h2 className="text-2xl font-bold mb-6 text-center">
        Entrance {entranceData.title_en || entranceId?.toUpperCase() || "Not Found"}
      </h2>

     

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
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {entranceDetails && (
        <>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Details</h3>
            <div className="grid grid-cols-2 gap-6">
              {/* English Meaning */}
              <div className="border rounded p-4 relative">
                <h4 className="font-semibold mb-2">Meaning (English)</h4>
                <div
                  className="text-gray-800"
                  dangerouslySetInnerHTML={{ __html: meaningEn || "N/A" }}
                />
                <button
                  className="absolute top-2 right-2 ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                  onClick={() => {
                    setEditModalOpen(true);
                    setEditField("meaning_en");
                    setEditValue(meaningEn);
                  }}
                >
                  <Pencil className="h-4 w-4" />
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
              {/* Hindi Meaning */}
              <div className="border rounded p-4 relative">
                <h4 className="font-semibold mb-2">Meaning (Hindi)</h4>
                <div
                  className="text-gray-800"
                  dangerouslySetInnerHTML={{ __html: meaningHi || "N/A" }}
                />
                <button
                  className="absolute top-2 right-2 ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                  onClick={() => {
                    setEditModalOpen(true);
                    setEditField("meaning_hi");
                    setEditValue(meaningHi);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* Edit Modal */}
            {editModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-bold mb-4">
                    Edit{" "}
                    {editField === "meaning_en"
                      ? "Meaning (English)"
                      : "Meaning (Hindi)"}
                  </h3>
                  <TiptapEditor
                    value={editValue}
                    onChange={setEditValue}
                    height="200px"
                  />
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={() => setEditModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={handleUpdate}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Update Button at bottom of main page */}
          <div className="mt-8 text-right">
            <button
              className="py-2 px-6 bg-blue-600 text-white hover:bg-blue-700 rounded font-semibold"
              onClick={async () => {
                if (!entranceId) return;
                const payload: any = {
                  meaning_en: meaningEn,
                  meaning_hi: meaningHi,
                };
                const result = await dispatch(
                  updateEntranceById({ id: entranceId, payload })
                );
                if (updateEntranceById.fulfilled.match(result)) {
                  toast.success("Entrance updated successfully", {
                    duration: 4000,
                    position: "top-right",
                  });
                  navigate("/vastu/entrance/list");
                } else {
                  toast.error("Failed to update entrance.", {
                    duration: 4000,
                    position: "top-right",
                  });
                }
              }}
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntranceDetails;
