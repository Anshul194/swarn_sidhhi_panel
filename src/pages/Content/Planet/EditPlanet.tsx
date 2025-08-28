import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const {
    data: planetData,
    loading,
    error,
  } = useAppSelector((state) => state.planet);
  // Render HTML from editor (preserve formatting)
  const renderHtml = (html: string) => (
    <div
      className="text-gray-700 whitespace-pre-line"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );

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
      toast.success("Planet updated successfully!", {
        duration: 4000,
        position: "top-right",
      });
      setTimeout(() => {
        navigate("/kundli/planet/list");
      }, 1000);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Back Button */}
      <button
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>
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
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <p className="overflow-y-scroll text-sm">
            {renderHtml(details.meaning_en)}
          </p>
        </div>
        <div className="border rounded-lg p-4 pb-0 max-h-72 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Meaning (Hindi)</h3>
            <button
              onClick={() => openEditModal("meaning_hi", details.meaning_hi)}
              className="ml-2 text-blue-600"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <p className="overflow-y-scroll text-sm">
            {renderHtml(details.meaning_hi)}
          </p>
        </div>
        <div className="border rounded-lg p-4 pb-0 max-h-72 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Remedy (English)</h3>
            <button
              onClick={() => openEditModal("remedy_en", details.remedy_en)}
              className="ml-2 text-blue-600"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <p className="overflow-y-scroll text-sm">
            {renderHtml(details.remedy_en)}
          </p>
        </div>
        <div className="border rounded-lg p-4 pb-0 max-h-72 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Remedy (Hindi)</h3>
            <button
              onClick={() => openEditModal("remedy_hi", details.remedy_hi)}
              className="ml-2 text-blue-600"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <p className="overflow-y-scroll text-sm">
            {renderHtml(details.remedy_hi)}
          </p>
        </div>
      </div>
      {/* House Wise Details */}
      {houses.map((house, idx) => (
        <div key={house.name} className="mb-8">
          <h3 className="text-lg font-bold mb-2">{`${idx + 1}st House`}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 pb-0 max-h-72 flex flex-col">
              <h4 className="font-semibold">
                Sun in House {idx + 1} Meaning (English)
              </h4>
              <div className="flex justify-between items-center ">
                <h4 className="font-semibold">Pros (English)</h4>
                <button
                  onClick={() => openEditModal("pros_en", house.pros_en, idx)}
                  className="ml-2 text-blue-600"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
              <p className="overflow-y-scroll text-sm">
                {renderHtml(house.pros_en)}
              </p>
              <div className="flex justify-between items-center mt-2">
                <h5 className="font-semibold">Cons (English)</h5>
                <button
                  onClick={() => openEditModal("cons_en", house.cons_en, idx)}
                  className="ml-2 text-blue-600"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
              <p className="overflow-y-scroll text-sm">
                {renderHtml(house.cons_en)}
              </p>
            </div>
            <div className="border rounded-lg p-4 pb-0 max-h-72 flex flex-col">
              <h4 className="font-semibold">
                Sun in House {idx + 1} Meaning (Hindi)
              </h4>
              <div className="flex justify-between items-center ">
                <h4 className="font-semibold">Pros (Hindi)</h4>
                <button
                  onClick={() => openEditModal("pros_hi", house.pros_hi, idx)}
                  className="ml-2 text-blue-600"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
              <p className="overflow-y-scroll text-sm">
                {renderHtml(house.pros_hi)}
              </p>
              <div className="flex justify-between items-center mt-2">
                <h4 className="font-semibold">Cons (Hindi)</h4>
                <button
                  onClick={() => openEditModal("cons_hi", house.cons_hi, idx)}
                  className="ml-2 text-blue-600"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
              <p className="overflow-y-scroll text-sm">
                {renderHtml(house.cons_hi)}
              </p>
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
