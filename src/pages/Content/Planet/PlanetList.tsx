import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Plus,
  LayoutGrid,
  List,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PlanetList: React.FC = () => {
  const navigate = useNavigate();
  // Local UI states
  const [searchInput, setSearchInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  // View mode: 'table' or 'grid'
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  // Data states
  const [planets, setPlanets] = useState<Array<{ id: number; name: string }>>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<{
    totalPages: number;
    total: number;
  }>({ totalPages: 1, total: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("token") || "";
      setLoading(true);
      setError("");
      axios
        .get(
          `https://test.swarnsiddhi.com/admin/api/v1/content/kundli/planets/`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            params: {
              search: searchInput,
              category: categoryFilter,
              page,
              limit,
            },
          }
        )
        .then((res) => {
          console.log("Planet API response:", res.data);
          // API response: { message, data: { results: [...], pagination: {...} } }
          setPlanets(res.data?.data?.results || []);
          setPagination({
            totalPages: res.data?.data?.pagination?.total_pages || 1,
            total: res.data?.data?.pagination?.count || 0,
          });
        })
        .catch((err) => {
          setError(err?.response?.data?.message || "Failed to fetch planets");
        })
        .finally(() => setLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, categoryFilter, page, limit]);

  const handleReset = () => {
    setSearchInput("");
    setCategoryFilter("");
    setPage(1);
    setLimit(10);
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
          Planet List
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/kundli/planet/add")}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-blue-600 text-white  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4" />
            Add Planet
          </button>
          {/* View toggle buttons */}
          <div className="flex justify-end gap-2 ">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md border border-gray-300 dark:border-gray-600 ${
                viewMode === "table"
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "bg-white dark:bg-gray-900"
              } hover:bg-gray-100 dark:hover:bg-gray-800`}
              title="Table View"
            >
              <List className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md border border-gray-300 dark:border-gray-600 ${
                viewMode === "grid"
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "bg-white dark:bg-gray-900"
              } hover:bg-gray-100 dark:hover:bg-gray-800`}
              title="Grid View"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
          </div>
          <span className="text-gray-500 text-sm dark:text-gray-400">
            Total: {pagination?.total}
          </span>
        </div>
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

      {/* Table or Grid View */}
      {viewMode === "table" ? (
        <div className="bg-white shadow rounded-lg overflow-x-auto dark:bg-gray-900">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                  Name
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 dark:bg-gray-900 dark:divide-gray-800">
              {planets && planets.length > 0 ? (
                planets.map((planet, idx) => (
                  <tr
                    key={planet?.id || idx}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() =>
                      navigate(`/kundli/planet/edit`, {
                        state: { planetId: planet?.id },
                      })
                    }
                  >
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {planet?.name || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-400">
                    No planets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-4">
          {planets && planets.length > 0 ? (
            planets.map((planet, idx) => (
              <div
                key={planet?.id || idx}
                className="border border-gray-400 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition"
                onClick={() =>
                  navigate(`/kundli/planet/edit`, {
                    state: { planetId: planet?.id },
                  })
                }
              >
                <div className="text-xl font-semibold text-gray-800 text-center mb-1">
                  {planet?.name || "-"}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-6 text-gray-400">
              No planets found.
            </div>
          )}
        </div>
      )}

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
    </div>
  );
};

export default PlanetList;
