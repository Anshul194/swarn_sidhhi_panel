import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalysisByType, updateAnalysisByType } from "../../store/slices/analysis";
import { RootState } from "../../store";
import { Pencil, X } from "lucide-react";
import TiptapEditor from "../../components/TiptapEditor";

const sections = ["career", "health", "relationship"]; // can be extended dynamically

const AnalyticsDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mbtiType = location.state?.mbtiType || "ISTJ";
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.analysis);

  // Local editable state for analysis
  const [analysisData, setAnalysisData] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSection, setModalSection] = useState<string>("");
  const [modalField, setModalField] = useState<string>("");
  const [modalValue, setModalValue] = useState<string>("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    dispatch(fetchAnalysisByType({ type: mbtiType, token }));
  }, [mbtiType, dispatch]);

  useEffect(() => {
    // Sync local state with fetched data
    setAnalysisData(data.map(item => ({ ...item })));
  }, [data]);

  // Helper to get analysis for a given element dynamically
  const getAnalysis = (element: string) => analysisData.find((item) => item.element === element);

  // Modal handlers
  const openEditModal = (section: string, field: string, value: string) => {
    setModalSection(section);
    setModalField(field);
    setModalValue(value || "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalSection("");
    setModalField("");
    setModalValue("");
  };

  const handleModalSave = () => {
    setAnalysisData(prev =>
      prev.map(item =>
        item.element === modalSection
          ? { ...item, [modalField]: modalValue }
          : item
      )
    );
    closeModal();
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token") || "";
    try {
      const result = await dispatch(
        updateAnalysisByType({
          type: mbtiType,
          payload: analysisData,
          token,
        })
      );
      if (result.type.endsWith("/fulfilled")) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 1200);
      }
    } catch (err) {
      // handle error if needed
    }
  };

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 xl:px-10 xl:py-12 mx-auto">
      {/* Back Button */}
      <button
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-center mb-8">Karma: {mbtiType}</h1>

      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      {/* Render each section dynamically */}
      {sections.map((section) => {
        const analysis = getAnalysis(section);

        return (
          <div key={section} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{section.charAt(0).toUpperCase() + section.slice(1)}</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="border rounded-lg p-5 relative">
                <h3 className="font-semibold mb-2">{section.charAt(0).toUpperCase() + section.slice(1)} Prediction (English)</h3>
                <div
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: analysis?.description_en || "No data available." }}
                />
                <button
                  onClick={() => openEditModal(section, "description_en", analysis?.description_en || "")}
                  className="absolute top-4 right-4 text-blue-600"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
              <div className="border rounded-lg p-5 relative">
                <h3 className="font-semibold mb-2">{section.charAt(0).toUpperCase() + section.slice(1)} Prediction (Hindi)</h3>
                <div
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: analysis?.description_hi || "No data available." }}
                />
                <button
                  onClick={() => openEditModal(section, "description_hi", analysis?.description_hi || "")}
                  className="absolute top-4 right-4 text-blue-600"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Update Button */}
      <div className="mt-8 text-right">
        <button
          className="py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
      {success && (
        <div className="mt-4 text-green-600 text-center font-semibold">
          Analysis updated successfully!
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
              Edit {modalSection.charAt(0).toUpperCase() + modalSection.slice(1)} {modalField === "description_en" ? "Prediction (English)" : "Prediction (Hindi)"}
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

export default AnalyticsDetails;
