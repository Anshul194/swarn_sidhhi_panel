import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  RotateCcw,
  Pencil,
  Trash,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  deletePersonality,
  fetchPersonalities,
} from "../../../../store/slices/personality";

const PersonalityList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { personalities, loading, error, pagination } = useSelector(
    (state: any) => state?.personality
  );
  console.log("Personalities fetched:", personalities);
  console.log("Pagination data:", pagination);

  // Local UI states
  const [searchInput, setSearchInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Popup state
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("token") || "";
      const baseUrl = import.meta.env.VITE_BASE_URL || "";
      dispatch(
        fetchPersonalities({
          token,
          baseUrl,
          searchInput,
          categoryFilter,
          page,
          limit,
        })
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [dispatch, searchInput, categoryFilter, page, limit]);

  const handleReset = () => {
    setSearchInput("");
    setCategoryFilter("");
    setPage(1);
    setLimit(10);
    const token = localStorage.getItem("token") || "";
    const baseUrl = import.meta.env.VITE_BASE_URL || "";
    dispatch(
      fetchPersonalities({
        token,
        baseUrl,
        page: 1,
        limit: 10,
      })
    );
  };

  const handleDeleteClick = (article: any) => {
    setArticleToDelete(article);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    const token = localStorage.getItem("token") || "";
    const baseUrl = import.meta.env.VITE_BASE_URL || "";
    await dispatch(deletePersonality(articleToDelete.id));
    setShowDeletePopup(false);
    setArticleToDelete(null);
    toast.success("Personality deleted successfully");
    dispatch(
      fetchPersonalities({
        token,
        baseUrl,
        searchInput,
        categoryFilter,
        page,
        limit,
      })
    );
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setArticleToDelete(null);
  };

  // Pagination numbers
  const generatePageNumbers = () => {
    console.log("Generating page numbers for pagination", pagination);
    const totalPages = pagination?.totalPages || 1;
    const current = page;
    const maxPages = 5;
    const pages = [];
    const start = Math.max(1, current - Math.floor(maxPages / 2));
    const end = Math.min(totalPages, start + maxPages - 1);
    if (start > 1) pages.push(1, "...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) pages.push("...", totalPages);
    return pages;
  };

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Personality List
        </h1>
        <span className="text-gray-500 text-sm dark:text-gray-400">
          Total: {pagination?.totalCount}
        </span>
      </div>

      {/* Search & Filter */}
      <div className="bg-white shadow p-4 rounded-md mb-6 dark:bg-gray-900">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>
          {/* <div className="flex items-center gap-2">
            <span className="text-sm">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All</option>
              <option value="astrology">Astrology</option>
              <option value="science">Science</option>
              <option value="technology">Technology</option>
            </select>
          </div> */}
        </div>
        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error State */}
      {error && <div className="text-red-500 text-center py-4">{error}</div>}

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto dark:bg-gray-900">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                mulank
              </th>

              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 dark:bg-gray-900 dark:divide-gray-800">
            {personalities?.map((entrance: any, idx: number) => (
              <tr
                key={entrance?._id || idx}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {(page - 1) * limit + idx + 1}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  {entrance?.mulank_number || "-"}
                </td>

                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    onClick={() =>
                      navigate("/numerology/personality/edit", {
                        state: { personalityId: entrance?.id },
                      })
                    }
                    title="Edit Article"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 transition-colors"
                    onClick={() => handleDeleteClick(entrance)}
                    title="Delete Article"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        {generatePageNumbers().map((p, idx) =>
          typeof p === "number" ? (
            <button
              key={idx}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded ${
                page === p
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {p}
            </button>
          ) : (
            <span key={idx} className="px-2 text-gray-400 dark:text-gray-500">
              {p}
            </span>
          )
        )}
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === (pagination?.totalPages || 1)}
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="ml-2 px-2 py-1 border border-gray-300 rounded dark:border-gray-700"
        >
          {[10, 20, 50, 100].map((sz) => (
            <option key={sz} value={sz}>
              {sz} / page
            </option>
          ))}
        </select>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete?
            </h2>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalityList;
