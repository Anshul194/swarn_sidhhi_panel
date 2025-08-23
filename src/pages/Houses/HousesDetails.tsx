import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchHouseById, updateHouseById } from "../../store/slices/houses";
import { Pencil, Check, X } from "lucide-react";

const HousesDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const houseLabel = location.state?.houseLabel || "House: 1st";
  const houseId = location.state?.houseId || 1;

  const { houseDetails, loading, error } = useSelector((state: any) => state.house);

  // Local editable state
  const [editing, setEditing] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState<any>({ details: {}, planets: [] });

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

  const handleChange = (field: string, value: string, planetIdx?: number, key?: string) => {
    if (planetIdx !== undefined && key) {
      // Updating planet pros/cons
      setFormData((prev: any) => {
        const updatedPlanets = [...prev.planets];
        updatedPlanets[planetIdx] = { ...updatedPlanets[planetIdx], [key]: value };
        return { ...prev, planets: updatedPlanets };
      });
    } else {
      // Updating details
      setFormData((prev: any) => ({
        ...prev,
        details: { ...prev.details, [field]: value },
      }));
    }
  };

  const toggleEdit = (key: string) => {
    setEditing((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    if (!houseId) return;
    dispatch(updateHouseById({ id: houseId, payload: formData }));
    setEditing({});
  };

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 xl:px-10 xl:py-12 mx-auto">
      {/* Back Button */}
      <button
        className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center mb-8">{houseLabel}</h1>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* House Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* English Meaning */}
        <div className="border rounded-lg p-6 relative">
          <h3 className="font-bold mb-2">Meaning (English)</h3>
          {editing["desc_en"] ? (
            <textarea
              value={formData.details.description_en}
              onChange={(e) => handleChange("description_en", e.target.value)}
              className="w-full border rounded p-2 text-sm"
            />
          ) : (
            <div className="text-sm whitespace-pre-line">
              {formData.details.description_en || "No data available."}
            </div>
          )}
          <button
            onClick={() => toggleEdit("desc_en")}
            className="absolute top-4 right-4 text-gray-600 hover:text-black"
          >
            {editing["desc_en"] ? <X size={18} /> : <Pencil size={18} />}
          </button>
        </div>

        {/* Hindi Meaning */}
        <div className="border rounded-lg p-6 relative">
          <h3 className="font-bold mb-2">Meaning (Hindi)</h3>
          {editing["desc_hi"] ? (
            <textarea
              value={formData.details.description_hi}
              onChange={(e) => handleChange("description_hi", e.target.value)}
              className="w-full border rounded p-2 text-sm"
            />
          ) : (
            <div className="text-sm whitespace-pre-line">
              {formData.details.description_hi || "No data available."}
            </div>
          )}
          <button
            onClick={() => toggleEdit("desc_hi")}
            className="absolute top-4 right-4 text-gray-600 hover:text-black"
          >
            {editing["desc_hi"] ? <X size={18} /> : <Pencil size={18} />}
          </button>
        </div>
      </div>

      {/* Planets Section */}
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
            {/* English */}
            <div className="border rounded-lg p-6 relative">
              <h3 className="font-bold mb-2">{planet.name} in House {houseId} (English)</h3>
              {editing[`planet_${idx}_en`] ? (
                <textarea
                  value={planet.pros_en}
                  onChange={(e) => handleChange("", e.target.value, idx, "pros_en")}
                  className="w-full border rounded p-2 text-sm"
                />
              ) : (
                <div className="text-sm whitespace-pre-line">{planet.pros_en || "No data available."}</div>
              )}
              <button
                onClick={() => toggleEdit(`planet_${idx}_en`)}
                className="absolute top-4 right-4 text-gray-600 hover:text-black"
              >
                {editing[`planet_${idx}_en`] ? <X size={18} /> : <Pencil size={18} />}
              </button>
            </div>

            {/* Hindi */}
            <div className="border rounded-lg p-6 relative">
              <h3 className="font-bold mb-2">{planet.name} in House {houseId} (Hindi)</h3>
              {editing[`planet_${idx}_hi`] ? (
                <textarea
                  value={planet.pros_hi}
                  onChange={(e) => handleChange("", e.target.value, idx, "pros_hi")}
                  className="w-full border rounded p-2 text-sm"
                />
              ) : (
                <div className="text-sm whitespace-pre-line">{planet.pros_hi || "No data available."}</div>
              )}
              <button
                onClick={() => toggleEdit(`planet_${idx}_hi`)}
                className="absolute top-4 right-4 text-gray-600 hover:text-black"
              >
                {editing[`planet_${idx}_hi`] ? <X size={18} /> : <Pencil size={18} />}
              </button>
            </div>
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
    </div>
  );
};

export default HousesDetails;
