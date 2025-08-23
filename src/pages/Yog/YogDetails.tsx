import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchYogById, updateYogById } from "../../store/slices/yog";

const YogDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const yogId = location.state?.yogId;

  const { yogDetails: yog, loading, error } = useSelector((state: any) => state.yog || {});

  // Log yogId and yog for debugging
  console.log("YogDetails yogId:", yogId);
  if (yog === undefined) {
    console.log("YogDetails: yog is undefined (waiting for fetch)");
  } else {
    console.log("YogDetails Rendered:", yog);
  }

  const [titles, setTitles] = useState({ title_en: "", title_hi: "" });

  useEffect(() => {
    if (yogId) dispatch(fetchYogById({ id: yogId }));
  }, [dispatch, yogId]);

  useEffect(() => {
    if (yog) {
      setTitles({
        title_en: yog.title_en || "",
        title_hi: yog.title_hi || "",
      });
    }
  }, [yog]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTitles((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    if (!yogId) return;
    dispatch(updateYogById({ id: yogId, payload: titles, token: "" }));
  };

  if (!yogId) return <div className="min-h-screen flex items-center justify-center text-gray-600">No Yog selected.</div>;
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white p-8 xl:px-10 xl:py-12 mx-auto max-w-6xl">
      {/* Back Button */}
      <button
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

      <h2 className="text-3xl font-bold mb-8 text-center">
        {yog?.title_en ? `${yog.title_en}` : "Yog Details"}
      </h2>

      {/* Titles Section */}
      <div className="mb-10 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <label className="font-semibold w-44">Title (English):</label>
          <input
            type="text"
            name="title_en"
            value={titles.title_en}
            onChange={handleChange}
            className="flex-1 border rounded px-3 py-2 bg-gray-100"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="font-semibold w-44">Title (Hindi):</label>
          <input
            type="text"
            name="title_hi"
            value={titles.title_hi}
            onChange={handleChange}
            className="flex-1 border rounded px-3 py-2 bg-gray-100"
          />
        </div>
      </div>

      {/* Meanings Section (Read-only) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border rounded-lg p-6">
          <h3 className="font-bold mb-3 text-lg">Present Meaning (English)</h3>
          <p className="text-sm text-gray-700">{yog?.present_meaning_en || "-"}</p>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="font-bold mb-3 text-lg">Present Meaning (Hindi)</h3>
          <p className="text-sm text-gray-700">{yog?.present_meaning_hi || "-"}</p>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="font-bold mb-3 text-lg">Missing Meaning (English)</h3>
          <p className="text-sm text-gray-700">{yog?.missing_meaning_en || "-"}</p>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="font-bold mb-3 text-lg">Missing Meaning (Hindi)</h3>
          <p className="text-sm text-gray-700">{yog?.missing_meaning_hi || "-"}</p>
        </div>
      </div>

      {/* Update Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleUpdate}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
        >
          Update Titles
        </button>
      </div>
    </div>
  );
};

export default YogDetails;
