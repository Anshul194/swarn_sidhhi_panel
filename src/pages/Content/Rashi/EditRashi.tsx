import React, { useEffect } from "react";
import TiptapEditor from "../../../components/TiptapEditor";
import { Pencil } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import {
  fetchRashiDetails,
  updateRashiDetails,
} from "../../../store/slices/rashi";
import { toastConfig } from "../../../utils/toastConfig";

const EditRashi: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rashiName = location.state?.rashiName || "Aries";
  const dispatch = useAppDispatch();
  const {
    data: rashiData,
    loading,
    error,
    updateLoading,
    updateError,
    updateSuccess,
  } = useAppSelector((state) => state.rashi);

  // Show toast on successful update
  useEffect(() => {
    if (updateSuccess) {
      toastConfig.success("Rashi updated successfully!");
    }
  }, [updateSuccess]);

  // Show toast on update failure
  useEffect(() => {
    if (updateError) {
      toastConfig.error(updateError);
    }
  }, [updateError]);

  // Local state for editing
  const [localRashi, setLocalRashi] = React.useState<
    import("../../../store/slices/rashi").RashiData | null
  >(null);
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

  useEffect(() => {
    if (rashiData) {
      setLocalRashi(JSON.parse(JSON.stringify(rashiData)));
    }
  }, [rashiData]);

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
    if (!localRashi) return;
    if (modalHouseIdx !== null) {
      // House field
      if (modalField === "house_description_en") {
        localRashi.houses[modalHouseIdx].description_en = modalValue;
      } else if (modalField === "house_description_hi") {
        localRashi.houses[modalHouseIdx].description_hi = modalValue;
      }
    } else {
      // Details field
      const allowedFields: (keyof typeof localRashi.details)[] = [
        "meaning_en",
        "meaning_hi",
        "remedy_en",
        "remedy_hi",
        "short_description_en",
        "short_description_hi",
        "description_en",
        "description_hi",
      ];
      if (
        allowedFields.includes(modalField as keyof typeof localRashi.details)
      ) {
        localRashi.details[modalField as keyof typeof localRashi.details] =
          modalValue;
      }
    }
    setLocalRashi({ ...localRashi });
    closeModal();
  };

  const handleUpdateRashi = async () => {
    if (!localRashi) return;
    const result = await dispatch(
      updateRashiDetails({ name: rashiName, payload: localRashi })
    );
    if (updateRashiDetails.fulfilled.match(result)) {
      localStorage.setItem(
        "rashiData_" + rashiName,
        JSON.stringify(localRashi)
      );
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

      {/* Update Rashi Button */}
      {localRashi && (
        <div className="mt-8 flex justify-end">
          <button
            className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded disabled:bg-gray-400"
            onClick={handleUpdateRashi}
            disabled={updateLoading}
          >
            {updateLoading ? "Updating..." : "Update Rashi"}
          </button>
        </div>
      )}
      {updateError && (
        <div className="mt-4 text-red-600 text-right">{updateError}</div>
      )}
      {updateSuccess && (
        <div className="mt-4 text-green-600 text-right">
          Rashi updated successfully!
        </div>
      )}
    </div>
  );
};

export default EditRashi;
