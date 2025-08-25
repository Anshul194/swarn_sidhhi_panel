import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchHouseById, updateHouseById } from "../../store/slices/houses";
import { Pencil, X } from "lucide-react";
import TiptapEditor from "../../components/TiptapEditor";

const HousesDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const houseLabel = location.state?.houseLabel || "House: 1st";
  const houseId = location.state?.houseId || 1;

  const { houseDetails, loading, error } = useSelector((state: any) => state.house);

  // Local state
  const [formData, setFormData] = useState<any>({ details: {}, planets: [] });

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalField, setModalField] = useState("");
  const [modalValue, setModalValue] = useState("");
  const [modalPlanetIdx, setModalPlanetIdx] = useState<number | null>(null);
  const [modalPlanetKey, setModalPlanetKey] = useState<string | null>(null);

  useEffect(() => {
    if (houseId) dispatch(fetchHouseById({ id: houseId }));
  }, [dispatch, houseId]);

  useEffect(() => {
    if (houseDetails) {
      setFormData({
        details: {
          description_en: houseDetails.details?.description_en || "",
          description_hi: houseDetails.details?.description_hi || "",
        },
        planets: houseDetails.planets || [],
      });
    }
  }, [houseDetails]);

  const openEditModal = (field: string, value: string, planetIdx?: number, key?: string) => {
    setModalField(field);
    setModalValue(value || "");
    setModalPlanetIdx(planetIdx ?? null);
    setModalPlanetKey(key ?? null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalField("");
    setModalValue("");
    setModalPlanetIdx(null);
    setModalPlanetKey(null);
  };

  const handleModalSave = () => {
    if (modalPlanetIdx !== null && modalPlanetKey) {
      // Update planet field
      setFormData((prev: any) => {
        const updatedPlanets = [...prev.planets];
        updatedPlanets[modalPlanetIdx] = { ...updatedPlanets[modalPlanetIdx], [modalPlanetKey]: modalValue };
        return { ...prev, planets: updatedPlanets };
      });
    } else {
      // Update house details
      setFormData((prev: any) => ({
        ...prev,
        details: { ...prev.details, [modalField]: modalValue },
      }));
    }
    closeModal();
  };

  const handleSave = () => {
    if (!houseId) return;
    dispatch(updateHouseById({ id: houseId, payload: formData }));
  };

  if (loading) return <div className="p-8 text-blue-500">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 xl:px-10 xl:py-12 mx-auto">
      {/* Back Button */}
      <button
        className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

      <h1 className="text-3xl font-bold text-center mb-8">{houseLabel}</h1>

      {/* House Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {["description_en", "description_hi"].map((field) => (
          <div key={field} className="border rounded-lg p-6 relative">
            <h3 className="font-bold mb-2">{field === "description_en" ? "Meaning (English)" : "Meaning (Hindi)"}</h3>
            <div
              className="text-sm whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: formData.details[field] || "No data available." }}
            />
            <button
              onClick={() => openEditModal(field, formData.details[field])}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              <Pencil size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Planets */}
      {formData.planets.map((planet: any, idx: number) => (
        <div key={planet.name} className="mb-10">
          <h2 className="text-xl font-bold mb-4 capitalize">
            {planet.name === "sun"
              ? "Sun"
              : planet.name === "moon"
              ? "Moon House"
              : planet.name.charAt(0).toUpperCase() + planet.name.slice(1) + " House"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {["pros_en", "pros_hi"].map((key) => (
              <div key={key} className="border rounded-lg p-6 relative">
                <h3 className="font-bold mb-2">
                  {planet.name} in House {houseId} ({key === "pros_en" ? "English" : "Hindi"})
                </h3>
                <div
                  className="text-sm whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: planet[key] || "No data available." }}
                />
                <button
                  onClick={() => openEditModal("", planet[key], idx, key)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-black"
                >
                  <Pencil size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
        >
          Save Changes
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
              Edit {modalField || modalPlanetKey}
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

export default HousesDetails;
