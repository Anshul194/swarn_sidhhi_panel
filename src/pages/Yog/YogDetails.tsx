import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchYogById, updateYogById } from "../../store/slices/yog";
import { RootState } from "../../store";
import { Pencil, X } from "lucide-react";
import TiptapEditor from "../../components/TiptapEditor";

// Helper to remove HTML tags
const stripHTML = (str: string) => str.replace(/<[^>]+>/g, "");

const YogDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const yogId = location.state?.yogId;

  const { yogDetails: yog, loading, error } = useSelector(
    (state: RootState) => state.yog
  );
  const token = useSelector((state: RootState) => state.auth.token);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalField, setModalField] = useState("");
  const [modalValue, setModalValue] = useState("");

  // Local editable yog state
  const [yogData, setYogData] = useState<any>({});

  useEffect(() => {
    if (yogId) dispatch(fetchYogById({ id: yogId }));
  }, [dispatch, yogId]);

  useEffect(() => {
    if (yog) {
      setYogData({
        
        title_en: stripHTML(yog.title_en || ""),
        title_hi: stripHTML(yog.title_hi || ""),
        present_meaning_en: stripHTML(yog.present_meaning_en || ""),
        present_meaning_hi: stripHTML(yog.present_meaning_hi || ""),
        missing_meaning_en: stripHTML(yog.missing_meaning_en || ""),
        missing_meaning_hi: stripHTML(yog.missing_meaning_hi || ""),
      });
    }
  }, [yog]);

  const openModal = (field: string, value: string) => {
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
    setYogData((prev: any) => ({ ...prev, [modalField]: modalValue }));
    closeModal();
  };

  const handleUpdate = () => {
    if (!yogId || !token) return;
    dispatch(updateYogById({ id: yogId, payload: yogData, token }));
  };

  if (!yogId) return <div className="p-8 text-gray-500">No Yog selected.</div>;
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
         {yogData.title_en || "Untitled"} 
      </h2>

      {/* Titles */}

          <div className="mb-8 space-y-4">
            {/* Title English */}
            <div className="flex items-center gap-4 relative">
              <h4 className="font-semibold w-36">Title English:</h4>
              <div className="border p-2 rounded text-gray-700 flex-1">{yogData.title_en || "-"}</div>
              <button
                onClick={() => openModal("title_en", yogData.title_en)}
                className="text-blue-600 ml-2"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          
            {/* Title Hindi */}
            <div className="flex items-center gap-4 relative">
              <h4 className="font-semibold w-36">Title Hindi:</h4>
              <div className="border p-2 rounded text-gray-700 flex-1">{yogData.title_hi || "-"}</div>
              <button
                onClick={() => openModal("title_hi", yogData.title_hi)}
                className="text-blue-600 ml-2"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          </div>


      {/* Meanings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Present Meaning English */}
        <div className="border p-4 rounded relative">
          <h4 className="font-semibold mb-2">Present Meaning (English)</h4>
          <div className="text-gray-700 text-sm whitespace-pre-wrap break-words">
            {yogData.present_meaning_en || "-"}
          </div>
          <button
            onClick={() =>
              openModal("present_meaning_en", yogData.present_meaning_en)
            }
            className="absolute top-4 right-4 text-blue-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>

        {/* Present Meaning Hindi */}
        <div className="border p-4 rounded relative">
          <h4 className="font-semibold mb-2">Present Meaning (Hindi)</h4>
          <div className="text-gray-700 text-sm whitespace-pre-wrap break-words">
            {yogData.present_meaning_hi || "-"}
          </div>
          <button
            onClick={() =>
              openModal("present_meaning_hi", yogData.present_meaning_hi)
            }
            className="absolute top-4 right-4 text-blue-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>

        {/* Missing Meaning English */}
        <div className="border p-4 rounded relative">
          <h4 className="font-semibold mb-2">Missing Meaning (English)</h4>
          <div className="text-gray-700 text-sm whitespace-pre-wrap break-words">
            {yogData.missing_meaning_en || "-"}
          </div>
          <button
            onClick={() =>
              openModal("missing_meaning_en", yogData.missing_meaning_en)
            }
            className="absolute top-4 right-4 text-blue-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>

        {/* Missing Meaning Hindi */}
        <div className="border p-4 rounded relative">
          <h4 className="font-semibold mb-2">Missing Meaning (Hindi)</h4>
          <div className="text-gray-700 text-sm whitespace-pre-wrap break-words">
            {yogData.missing_meaning_hi || "-"}
          </div>
          <button
            onClick={() =>
              openModal("missing_meaning_hi", yogData.missing_meaning_hi)
            }
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
          {loading ? "Updating..." : "Update Yog"}
        </button>
      </div>

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

export default YogDetails;
