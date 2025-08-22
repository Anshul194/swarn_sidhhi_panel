import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "../../store/slices/content";
import { Search, RotateCcw, Plus, Eye, Share2, MessageSquareText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ArticleList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { articles, loading, error } = useSelector((state: any) => state?.content);

  // Local UI states
  const [searchInput, setSearchInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("token") || "";
      const baseUrl = import.meta.env.VITE_BASE_URL || "";
      dispatch(
        fetchArticles({
          token,
          baseUrl,
          searchInput,
          categoryFilter,
        })
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [dispatch, searchInput, categoryFilter]);

  const handleReset = () => {
    setSearchInput("");
    setCategoryFilter("");
    const token = localStorage.getItem("token") || "";
    const baseUrl = import.meta.env.VITE_BASE_URL || "";
    dispatch(fetchArticles({ token, baseUrl }));
  };

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Article List</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/content/add")}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4" />
            Add Articles
          </button>
          <span className="text-gray-500 text-sm dark:text-gray-400">Total: {articles?.length}</span>
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
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                State
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 dark:bg-gray-900 dark:divide-gray-800">
            {articles?.map((article: any, idx: number) => (
              <tr
                key={article?.id || idx}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() =>
                  navigate("/articles/edit", { state: { articleId: article?.id } })
                }
              >
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{article?.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{article?.title_en || "-"}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  {article?.stats?.view_count ?? 0} <Eye className="h-4 w-4 inline mr-2" />
                  {article?.stats?.comments_count ?? 0} <MessageSquareText className="h-4 w-4 inline mr-2" />
                  {article?.stats?.share_count ?? 0} <Share2 className="h-4 w-4 inline" />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{article?.status || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArticleList;
