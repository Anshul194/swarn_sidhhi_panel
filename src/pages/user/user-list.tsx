import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  setCurrentPage,
  blockUser,
} from "../../store/slices/user";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Pencil,
  Eye,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error, pagination, search, status } = useSelector(
    (state: any) => state.users
  );

  const [searchInput, setSearchInput] = useState(search || "");
  // Add filter states
  const [isPremium, setIsPremium] = useState<string>("");
  const [isActive, setIsActive] = useState<string>("");
  const [isBlocked, setIsBlocked] = useState<string>("");
  const [createdAfter, setCreatedAfter] = useState<string>("");
  const [createdBefore, setCreatedBefore] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [blockDialog, setBlockDialog] = useState<{
    open: boolean;
    user: any | null;
    reason: string;
  }>({ open: false, user: null, reason: "" });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      // dispatch(setUserSearch(searchInput));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch users on filter/pagination change
  useEffect(() => {
    dispatch(
      fetchAllUsers({
        page: pagination.page,
        page_size: pagination.limit,
        search: searchInput,
        is_premium: isPremium === "" ? undefined : isPremium === "true",
        is_active: isActive === "" ? undefined : isActive === "true",
        is_blocked: isBlocked === "" ? undefined : isBlocked === "true",
        created_after: createdAfter || undefined,
        created_before: createdBefore || undefined,
        sort_by: sortBy,
        sort_order: sortOrder as "asc" | "desc",
      })
    );
  }, [
    dispatch,
    pagination.page,
    pagination.limit,
    searchInput,
    isPremium,
    isActive,
    isBlocked,
    createdAfter,
    createdBefore,
    sortBy,
    sortOrder,
  ]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    dispatch(setUserStatusFilter(e.target.value));
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // dispatch(setUserPageSize(Number(e.target.value)));
  };

  const handleReset = () => {
    setSearchInput("");
    setIsPremium("");
    setIsActive("");
    setIsBlocked("");
    setCreatedAfter("");
    setCreatedBefore("");
    setSortBy("created_at");
    setSortOrder("desc");
    // dispatch(setUserSearch(""));
    // dispatch(setUserStatusFilter(""));
    // dispatch(setUserPageSize(10));
  };

  const handleBlockClick = (user: any) => {
    setBlockDialog({ open: true, user, reason: "" });
  };

  const handleBlockConfirm = async () => {
    if (!blockDialog.user) return;
    const isBlocked = !!blockDialog.user.is_blocked;
    await dispatch(
      blockUser({
        user_id: blockDialog.user.id,
        is_blocked: !isBlocked,
        reason: !isBlocked ? blockDialog.reason : undefined,
      })
    );
    setBlockDialog({ open: false, user: null, reason: "" });
    // Optionally refetch users after blocking/unblocking
    dispatch(
      fetchAllUsers({
        // page: pagination.page,
        // page_size: pagination.limit,
        // search: searchInput,
        // is_premium: isPremium === "" ? undefined : isPremium === "true",
        // is_active: isActive === "" ? undefined : isActive === "true",
        // is_blocked: isBlocked === "" ? undefined : isBlocked === "true",
        // created_after: createdAfter || undefined,
        // created_before: createdBefore || undefined,
        // sort_by: sortBy,
        // sort_order: sortOrder as "asc" | "desc",
      })
    );
    setBlockDialog({ open: false, user: null, reason: "" });
  };

  // Pagination numbers
  const generatePageNumbers = () => {
    const pages = [];
    const totalPages = pagination.totalPages;
    const current = pagination.page;
    const maxPages = 5;
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
          User List
        </h1>
        <span className="text-gray-500 text-sm dark:text-gray-400">
          Total: {pagination.total_count ?? pagination.total ?? 0}
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
              placeholder="Search by name or email..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Premium:</span>
            <select
              value={isPremium}
              onChange={(e) => setIsPremium(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All</option>
              <option value="true">Premium</option>
              <option value="false">Non-Premium</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Active:</span>
            <select
              value={isActive}
              onChange={(e) => setIsActive(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Blocked:</span>
            <select
              value={isBlocked}
              onChange={(e) => setIsBlocked(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All</option>
              <option value="true">Blocked</option>
              <option value="false">Not Blocked</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Created After:</span>
            <input
              type="date"
              value={createdAfter}
              onChange={(e) => setCreatedAfter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Created Before:</span>
            <input
              type="date"
              value={createdBefore}
              onChange={(e) => setCreatedBefore(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="created_at">Created At</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              {/* Add more sort fields as needed */}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Order:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
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

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto dark:bg-gray-900">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                #
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">UserName</th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                Coins
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                Status
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Blocked</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Actions</th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 dark:bg-gray-900 dark:divide-gray-800">
            {users.map((user: any, idx: number) => (
              <tr
                key={user.id || idx}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {user.id ||
                    ((pagination.page ?? 1) - 1) * (pagination.page_size ?? pagination.limit ?? 10) + idx + 1}
                </td>
                {/* <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
          {user.username || user.user_name || "-"}
            </td> */}
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  {user.name || user.full_name || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {user.email || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {user.plan || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {user.coins || "-"}
                </td>
                <td className="px-6 py-4 text-sm">
                  {user.is_active ? (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      Inactive
                    </span>
                  )}
                </td>
                {/* <td className="px-6 py-4 text-sm text-center">
          {user.is_blocked ? (
            <span title="Blocked" className="inline-flex items-center gap-1 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </span>
          ) : (
            <span title="Not Blocked" className="inline-flex items-center gap-1 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </span>
          )}
            </td>
            <td className="px-6 py-4 text-right space-x-2">
          <button
            className="text-blue-500 hover:text-blue-700 transition-colors"
            onClick={() => navigate("/users/edit", { state: { userId: user.id } })}
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            className={`${
              user.is_blocked
            ? "text-green-500 hover:text-green-700"
            : "text-red-500 hover:text-red-700"
            } transition-colors`}
            onClick={() => handleBlockClick(user)}
            title={user.is_blocked ? "Unblock User" : "Block User"}
          >
            {user.is_blocked ? (
              // Unblock icon (open lock)
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="5" y="11" width="14" height="8" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M7 11V7a5 5 0 0 1 10 0" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            ) : (
              // Block icon (lock)
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="5" y="11" width="14" height="8" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M12 17v-2" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            )}
          </button>
            </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => dispatch(setCurrentPage((pagination.page ?? 1) - 1))}
          disabled={(pagination.page ?? 1) === 1}
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        {generatePageNumbers().map((page, idx) =>
          typeof page === "number" ? (
            <button
              key={idx}
              onClick={() => dispatch(setCurrentPage(page))}
              className={`px-3 py-1 rounded ${
                (pagination.page ?? 1) === page
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={idx} className="px-2 text-gray-400 dark:text-gray-500">
              {page}
            </span>
          )
        )}
        <button
          onClick={() => dispatch(setCurrentPage((pagination.page ?? 1) + 1))}
          disabled={(pagination.page ?? 1) === (pagination.total_pages ?? pagination.totalPages ?? 1)}
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Block/Unblock Confirmation Dialog */}
      {blockDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {blockDialog.user?.is_blocked ? "Unblock User" : "Block User"}
            </h2>
            <p className="mb-4">
              {blockDialog.user?.is_blocked
                ? "Are you sure you want to unblock this user?"
                : "Are you sure you want to block this user?"}
            </p>
            {!blockDialog.user?.is_blocked && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={2}
                  value={blockDialog.reason}
                  onChange={(e) =>
                    setBlockDialog((d) => ({ ...d, reason: e.target.value }))
                  }
                  required
                />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700"
                onClick={() =>
                  setBlockDialog({ open: false, user: null, reason: "" })
                }
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  blockDialog.user?.is_blocked
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                }`}
                onClick={handleBlockConfirm}
                disabled={
                  !blockDialog.user?.is_blocked &&
                  blockDialog.reason.trim() === ""
                }
              >
                {blockDialog.user?.is_blocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
