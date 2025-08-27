import React, { useEffect } from "react";
import TiptapEditor from "../../components/TiptapEditor";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPersonalYear,
  updatePersonalYear,
} from "../../store/slices/personalYear";
import type { RootState } from "../../store";

import { Pencil } from "lucide-react";
import { toast } from "react-hot-toast";

const PersonalDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.personalYear
  );
  const [editData, setEditData] = React.useState<any[]>([]);
  const [success, setSuccess] = React.useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalValue, setModalValue] = React.useState("");
  const [modalType, setModalType] = React.useState<"en" | "hi">("en");
  const [modalLifestyle, setModalLifestyle] = React.useState<string>("");
  const [modalNum, setModalNum] = React.useState<string>("");

  useEffect(() => {
    dispatch(fetchPersonalYear());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      setEditData(data);
    }
  }, [data]);

  const openEditModal = (
    type: "en" | "hi",
    value: string,
    lifestyle: string,
    num: string
  ) => {
    setModalType(type);
    setModalValue(value);
    setModalLifestyle(lifestyle);
    setModalNum(num);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalValue("");
    setModalLifestyle("");
    setModalNum("");
  };

  const handleModalSave = () => {
    const updatedData = editData.map((item: any) => {
      if (item.lifestyle === modalLifestyle) {
        // Deep clone predictions and its nested objects
        const predictions = Object.keys(item.predictions).reduce(
          (acc: any, key: string) => {
            acc[key] = { ...item.predictions[key] };
            return acc;
          },
          {}
        );
        if (modalType === "en") {
          predictions[modalNum].prediction_en = modalValue;
        } else {
          predictions[modalNum].prediction_hi = modalValue;
        }
        return { ...item, predictions };
      }
      return item;
    });
    setEditData(updatedData);
    closeModal();
  };

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-4 py-8 xl:px-10 xl:py-12 mx-auto">
      {/* Back Button */}
      {/* <button
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button> */}

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-center mb-6">
        Personal Year Details
      </h1>

      {/* Numerology Year Data Section */}
      <div className="mt-8">
        {/* <h2 className="text-lg font-bold mb-4">Numerology Year Data</h2> */}
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && editData.length > 0 ? (
          <div className="space-y-10">
            {editData.map((item: any) => (
              <div key={item.lifestyle}>
                <h3 className="text-xl font-bold mb-4 capitalize">
                  {item.lifestyle.replace("_", " ")}
                </h3>
                <div className="grid grid-flow-col gap-6 overflow-y-hidden">
                  {[...Array(9)].map((_, i) => {
                    const num = String(i + 1);
                    const pred = item.predictions[num];
                    return (
                      <React.Fragment key={num}>
                        <div className="flex flex-col gap-6">
                          {/* Prediction EN Card */}
                          <div className="border rounded-lg p-4 shadow-sm bg-white w-2xs h-56">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold">
                                Number {num}: Prediction En
                              </span>
                              <button
                                onClick={() =>
                                  openEditModal(
                                    "en",
                                    pred?.prediction_en || "",
                                    item.lifestyle,
                                    num
                                  )
                                }
                                className="ml-2 text-blue-600"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                            </div>
                            <div>
                              <span className="">
                                <div
                                  className="text-gray-700 whitespace-pre-line"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      pred?.prediction_en ||
                                      "No prediction available.",
                                  }}
                                />
                              </span>
                            </div>
                          </div>
                          {/* Prediction HI Card */}
                          <div className="border rounded-lg p-4 shadow-sm bg-white w-2xs h-56">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold">
                                Number {num}: Prediction Hi
                              </span>
                              <button
                                onClick={() =>
                                  openEditModal(
                                    "hi",
                                    pred?.prediction_hi || "",
                                    item.lifestyle,
                                    num
                                  )
                                }
                                className="ml-2 text-blue-600"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                            </div>
                            <div>
                              <span className="">
                                <div
                                  className="text-gray-700 whitespace-pre-line"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      pred?.prediction_hi ||
                                      "No prediction available.",
                                  }}
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-red-500 mt-8">
            No personal year data found or update failed.
          </div>
        )}
      </div>

      {/* Update Button */}
      <div className="mt-8 text-right">
        <button
          className="py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
          onClick={async () => {
            const result = await dispatch(updatePersonalYear(editData));
            if (updatePersonalYear.fulfilled.match(result)) {
              toast.success("Personal year updated successfully!", {
                duration: 4000,
                position: "top-right",
              });
              setSuccess(true);
              setTimeout(() => setSuccess(false), 2000);
            } else {
              toast.error("Failed to update personal year.", {
                duration: 4000,
                position: "top-right",
              });
            }
          }}
          disabled={loading}
        >
          Update
        </button>
      </div>
      {success && (
        <div className="mt-4 text-green-700 text-center font-semibold">
          Personal year updated successfully!
        </div>
      )}

      {/* Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-bold mb-4">Edit Prediction</h3>
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

export default PersonalDetails;
