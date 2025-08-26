import React, { useEffect } from "react";
import TiptapEditor from "../../../components/TiptapEditor";
import { Pencil } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { fetchRashiDetails } from "../../../store/slices/rashi";

const EditRashi: React.FC = () => {
  const location = useLocation();
  const rashiName = location.state?.rashiName || "Aries";
  const dispatch = useAppDispatch();
  const {
    data: rashiData,
    loading,
    error,
  } = useAppSelector((state) => state.rashi);

  // Modal state
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalValue, setModalValue] = React.useState("");
  const [modalField, setModalField] = React.useState<string>("");
  const [modalHouseIdx, setModalHouseIdx] = React.useState<number | null>(null);

  useEffect(() => {
    if (rashiName) {
      dispatch(fetchRashiDetails({ name: rashiName }));
    }
  }, [rashiName, dispatch]);

  const openEditModal = (field: string, value: string, houseIdx?: number) => {
    setModalField(field);
    setModalValue(value);
    setModalHouseIdx(houseIdx ?? null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalValue("");
    setModalField("");
    setModalHouseIdx(null);
  };

  const handleModalSave = () => {
    // Update logic here (connect to Redux/API as needed)
    closeModal();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {loading && <div className="text-blue-600">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {rashiData && (
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center">
            Rashi: {rashiName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border rounded-lg p-4  max-h-72 overflow-y-scroll">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Meaning (English)</h3>
                <button
                  onClick={() =>
                    openEditModal(
                      "short_description_en",
                      rashiData.details.short_description_en || ""
                    )
                  }
                  className="ml-2 text-blue-600"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
              <div
                className="text-gray-700 text-sm whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: rashiData.details.short_description_en || "",
                }}
              />
              <div className="flex justify-between items-center mt-4">
                <span className="font-semibold">Description (English)</span>
                <button
                  onClick={() =>
                    openEditModal(
                      "description_en",
                      rashiData.details.description_en || ""
                    )
                  }
                  className="ml-2 text-blue-600"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
              <div
                className="text-gray-700 text-sm whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: rashiData.details.description_en || "",
                }}
              />
            </div>
            <div className="border rounded-lg p-4  max-h-72 overflow-y-scroll">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Meaning (Hindi)</h3>
                <button
                  onClick={() =>
                    openEditModal(
                      "short_description_hi",
                      rashiData.details.short_description_hi || ""
                    )
                  }
                  className="ml-2 text-blue-600"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
              <div
                className="text-gray-700 text-sm whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: rashiData.details.short_description_hi || "",
                }}
              />
              <div className="flex justify-between items-center mt-4">
                <span className="font-semibold">Description (Hindi)</span>
                <button
                  onClick={() =>
                    openEditModal(
                      "description_hi",
                      rashiData.details.description_hi || ""
                    )
                  }
                  className="ml-2 text-blue-600"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
              <div
                className="text-gray-700 text-sm whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: rashiData.details.description_hi || "",
                }}
              />
            </div>
          </div>
          {/* House Wise Details */}
          {rashiData.houses.map((house, idx) => (
            <div key={house.name} className="mb-8">
              <h3 className="text-lg font-bold mb-2">{`${idx + 1}st House`}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4  max-h-72 overflow-y-scroll">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{`Planet in House ${
                      idx + 1
                    } Meaning (English)`}</h4>
                    <button
                      onClick={() =>
                        openEditModal(
                          "house_description_en",
                          house.description_en || "",
                          idx
                        )
                      }
                      className="ml-2 text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                  <div
                    className="mb-2 text-gray-700 text-sm whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: house.description_en || "",
                    }}
                  />
                </div>
                <div className="border rounded-lg p-4  max-h-72 overflow-y-scroll">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{`Planet in House ${
                      idx + 1
                    } Meaning (Hindi)`}</h4>
                    <button
                      onClick={() =>
                        openEditModal(
                          "house_description_hi",
                          house.description_hi || "",
                          idx
                        )
                      }
                      className="ml-2 text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                  <div
                    className="mb-2 text-gray-700 text-sm whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: house.description_hi || "",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
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

export default EditRashi;
