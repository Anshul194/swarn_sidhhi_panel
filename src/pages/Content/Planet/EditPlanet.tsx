import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { fetchPlanetDetails } from "../../../store/slices/planet";
import { updatePlanetDetails } from "../../../store/slices/planet";
import { Pencil } from "lucide-react";
import TiptapEditor from "../../../components/TiptapEditor";

const EditPlanet: React.FC = () => {
  // Modal state
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalField, setModalField] = React.useState<string>("");
  const [modalValue, setModalValue] = React.useState<string>("");
  const [modalIdx, setModalIdx] = React.useState<number | null>(null);

  const openEditModal = (field: string, value: string, idx?: number) => {
    setModalField(field);
    setModalValue(value);
    setModalIdx(idx ?? null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalField("");
    setModalValue("");
    setModalIdx(null);
  };

  const handleModalSave = () => {
    if (modalIdx !== null) {
      // House field
      setHouses((prev) => {
        const updated = [...prev];
        updated[modalIdx] = { ...updated[modalIdx], [modalField]: modalValue };
        return updated;
      });
    } else {
      setDetails((prev) => ({ ...prev, [modalField]: modalValue }));
    }
    closeModal();
  };
  const location = useLocation();
  const planetName = location.state?.planetName || "sun";
  const dispatch = useAppDispatch();
  const {
    data: planetData,
    loading,
    error,
  } = useAppSelector((state) => state.planet);

  // Local state for editing
  const [details, setDetails] = React.useState({
    meaning_en: "",
    meaning_hi: "",
    remedy_en: "",
    remedy_hi: "",
  });
  const [houses, setHouses] = React.useState<
    Array<{
      name: string;
      pros_en: string;
      pros_hi: string;
      cons_en: string;
      cons_hi: string;
    }>
  >([]);
  const [success, setSuccess] = React.useState(false);

  useEffect(() => {
    if (planetName) {
      dispatch(fetchPlanetDetails({ name: planetName.toLowerCase() }));
    }
  }, [planetName, dispatch]);

  useEffect(() => {
    if (planetData) {
      setDetails({
        meaning_en: planetData.details.meaning_en,
        meaning_hi: planetData.details.meaning_hi,
        remedy_en: planetData.details.remedy_en,
        remedy_hi: planetData.details.remedy_hi,
      });
      setHouses(planetData.houses);
    }
  }, [planetData]);

  // Removed unused handleDetailsChange and handleHouseChange

  const handleUpdate = async () => {
    if (!planetName) return;
    const result = await dispatch(
      updatePlanetDetails({
        name: planetName.toLowerCase(),
        details,
        houses,
      })
    );
    if (updatePlanetDetails.fulfilled.match(result)) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {loading && <div className="text-blue-600">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <h2 className="text-2xl font-bold mb-8 text-center">
        Planet: {planetName?.charAt(0).toUpperCase() + planetName?.slice(1)}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border rounded-lg p-4 pb-0 max-h-72 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Meaning (English)</h3>
            <button
              onClick={() => openEditModal("meaning_en", details.meaning_en)}
              className="ml-2 text-blue-600"
            >
              <Pencil className="h-5 w-5" />
            </button>
          </div>
          <div className="text-gray-700 whitespace-pre-line">
            {details.meaning_en}
          </div>
        </div>
        <div className="border rounded-lg p-4 pb-0 max-h-72 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Meaning (Hindi)</h3>
            <button
              onClick={() => openEditModal("meaning_hi", details.meaning_hi)}
              className="ml-2 text-blue-600"
            >
              <Pencil className="h-5 w-5" />
            </button>
          </div>
          <div className="text-gray-700 whitespace-pre-line">
            {details.meaning_hi}
          </div>
        </div>
        <div className="border rounded-lg p-4 pb-0 max-h-72 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Remedy (English)</h3>
            <button
              onClick={() => openEditModal("remedy_en", details.remedy_en)}
              className="ml-2 text-blue-600"
            >
              <Pencil className="h-5 w-5" />
            </button>
          </div>
          <div className="text-gray-700 whitespace-pre-line">
            {details.remedy_en}
          </div>
        </div>
        <div className="border rounded-lg p-4 pb-0 max-h-72 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Remedy (Hindi)</h3>
            <button
              onClick={() => openEditModal("remedy_hi", details.remedy_hi)}
              className="ml-2 text-blue-600"
            >
              <Pencil className="h-5 w-5" />
            </button>
          </div>
          <div className="text-gray-700 whitespace-pre-line">
            {details.remedy_hi}
          </div>
        </div>
      </div>
      {/* House Wise Details */}
      {houses.map((house, idx) => (
        <div key={house.name} className="mb-8">
          <h3 className="text-lg font-bold mb-2">{`${idx + 1}st House`}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 pb-0 max-h-72 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">
                  Sun in House {idx + 1} Meaning (English)
                </h4>
                <button
                  onClick={() => openEditModal("pros_en", house.pros_en, idx)}
                  className="ml-2 text-blue-600"
                >
                  <Pencil className="h-5 w-5" />
                </button>
              </div>
              <div className="text-gray-700 whitespace-pre-line">
                {house.pros_en}
              </div>
              <div className="flex justify-between items-center mt-2">
                <h4 className="font-semibold">Cons (English)</h4>
                <button
                  onClick={() => openEditModal("cons_en", house.cons_en, idx)}
                  className="ml-2 text-blue-600"
                >
                  <Pencil className="h-5 w-5" />
                </button>
              </div>
              <div className="text-gray-700 whitespace-pre-line">
                {house.cons_en}
              </div>
            </div>
            <div className="border rounded-lg p-4 pb-0 max-h-72 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">
                  Sun in House {idx + 1} Meaning (Hindi)
                </h4>
                <button
                  onClick={() => openEditModal("pros_hi", house.pros_hi, idx)}
                  className="ml-2 text-blue-600"
                >
                  <Pencil className="h-5 w-5" />
                </button>
              </div>
              <div className="text-gray-700 whitespace-pre-line">
                {house.pros_hi}
              </div>
              <div className="flex justify-between items-center mt-2">
                <h4 className="font-semibold">Cons (Hindi)</h4>
                <button
                  onClick={() => openEditModal("cons_hi", house.cons_hi, idx)}
                  className="ml-2 text-blue-600"
                >
                  <Pencil className="h-5 w-5" />
                </button>
              </div>
              <div className="text-gray-700 whitespace-pre-line">
                {house.cons_hi}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-8">
        <button
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow"
          onClick={handleUpdate}
          disabled={loading}
        >
          Update Planet
        </button>
      </div>
      {success && (
        <div className="mt-4 text-green-700 text-center font-semibold">
          Planet details updated successfully!
        </div>
      )}

      {/* Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-filter backdrop-blur-xs">
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
    </div>
  );
};

export default EditPlanet;
