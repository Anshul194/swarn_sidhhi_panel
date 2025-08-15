import React, { useEffect, useState } from "react";
import axios from "axios";
import TiptapEditor from "../../../components/TiptapEditor";
import { Pencil, Edit3, Languages } from "lucide-react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";

const EditPlanet: React.FC = () => {
  const location = useLocation();
  const planet = location.state?.planet;
  const planetId = planet?.id || location.state?.planetId;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  // Removed unused titleHi state
  const [content, setContent] = useState("");
  const [contentHi, setContentHi] = useState("");
  const [name, setName] = useState("");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Editor state
  const [activeLanguage, setActiveLanguage] = useState<"en" | "hi">("en");
  // Always preview mode (no toggle)
  const [previewMode] = useState(true);
  // Tiptap modal popups
  const [showTitleEditModal, setShowTitleEditModal] = useState(false);
  // Removed unused showTitleHiEditModal
  const [showContentEditModal, setShowContentEditModal] = useState(false);
  const [showContentHiEditModal, setShowContentHiEditModal] = useState(false);
  const [tiptapModalTitle, setTiptapModalTitle] = useState("");
  // Removed unused tiptapModalTitleHi and setTiptapModalTitleHi
  const [tiptapModalContent, setTiptapModalContent] = useState("");
  const [tiptapModalContentHi, setTiptapModalContentHi] = useState("");
  const tiptapEditorTitle = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Heading,
      ListItem,
      BulletList,
      OrderedList,
      Blockquote,
      CodeBlock,
    ],
    content: tiptapModalTitle,
    onUpdate: ({ editor }) => setTiptapModalTitle(editor.getHTML()),
    editable: true,
  });

  // Toolbar button definitions
  const tiptapToolbarButtons = (editor) => [
    {
      label: "Bold",
      icon: <b>B</b>,
      active: editor?.isActive("bold"),
      action: () => editor?.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      icon: <i>I</i>,
      active: editor?.isActive("italic"),
      action: () => editor?.chain().focus().toggleItalic().run(),
    },
    {
      label: "Underline",
      icon: <u>U</u>,
      active: editor?.isActive("underline"),
      action: () => editor?.chain().focus().toggleUnderline().run(),
    },
    {
      label: "Heading",
      icon: <span style={{ fontWeight: "bold" }}>H</span>,
      active:
        editor?.isActive("heading", { level: 1 }) ||
        editor?.isActive("heading", { level: 2 }) ||
        editor?.isActive("heading", { level: 3 }),
      action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Bullet List",
      icon: <span>&bull; List</span>,
      active: editor?.isActive("bulletList"),
      action: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Ordered List",
      icon: <span>1. List</span>,
      active: editor?.isActive("orderedList"),
      action: () => editor?.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Blockquote",
      icon: <span>"</span>,
      active: editor?.isActive("blockquote"),
      action: () => editor?.chain().focus().toggleBlockquote().run(),
    },
    {
      label: "Code",
      icon: <span>{"< >"}</span>,
      active: editor?.isActive("code"),
      action: () => editor?.chain().focus().toggleCode().run(),
    },
    {
      label: "Link",
      icon: <span>🔗</span>,
      active: editor?.isActive("link"),
      action: () => {
        const url = window.prompt("Enter URL");
        if (url) editor?.chain().focus().setLink({ href: url }).run();
      },
    },
    {
      label: "Clear Format",
      icon: <span>✖</span>,
      active: false,
      action: () => editor?.chain().focus().unsetAllMarks().run(),
    },
  ];
  // Removed unused tiptapEditorTitleHi
  const tiptapEditorContent = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Heading,
      ListItem,
      BulletList,
      OrderedList,
      Blockquote,
      CodeBlock,
    ],
    content: tiptapModalContent,
    onUpdate: ({ editor }) => setTiptapModalContent(editor.getHTML()),
    editable: true,
  });
  const tiptapEditorContentHi = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Heading,
      ListItem,
      BulletList,
      OrderedList,
      Blockquote,
      CodeBlock,
    ],
    content: tiptapModalContentHi,
    onUpdate: ({ editor }) => setTiptapModalContentHi(editor.getHTML()),
    editable: true,
  });
  // Modal open/close handlers
  const handleOpenTitleEdit = () => {
    setTiptapModalTitle(title);
    setShowTitleEditModal(true);
    setTimeout(() => {
      if (tiptapEditorTitle) tiptapEditorTitle.commands.setContent(title || "");
    }, 100);
  };
  const handleSaveTitleEdit = () => {
    setTitle(tiptapModalTitle);
    setShowTitleEditModal(false);
  };
  const handleOpenContentEdit = () => {
    setTiptapModalContent(content);
    setShowContentEditModal(true);
    setTimeout(() => {
      if (tiptapEditorContent)
        tiptapEditorContent.commands.setContent(content || "");
    }, 100);
  };
  const handleSaveContentEdit = () => {
    setContent(tiptapModalContent);
    setShowContentEditModal(false);
  };
  const handleOpenContentHiEdit = () => {
    setTiptapModalContentHi(contentHi);
    setShowContentHiEditModal(true);
    setTimeout(() => {
      if (tiptapEditorContentHi)
        tiptapEditorContentHi.commands.setContent(contentHi || "");
    }, 100);
  };
  const handleSaveContentHiEdit = () => {
    setContentHi(tiptapModalContentHi);
    setShowContentHiEditModal(false);
  };
  // ...existing code...

  // DELETE: popup state and handlers for Planet
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [planetToDelete, setPlanetToDelete] = useState<
    string | number | undefined
  >(undefined);

  // Open confirmation popup and set planet to delete
  const handleDeleteClick = (planetIdToDelete: string | number | undefined) => {
    if (!planetIdToDelete) return;
    setPlanetToDelete(planetIdToDelete);
    setShowDeletePopup(true);
  };

  // Cancel delete popup
  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setPlanetToDelete(undefined);
  };

  // Confirm deletion, call API, close popup, redirect to planet list with toast
  const handleConfirmDelete = async () => {
    if (!planetToDelete) return;
    try {
      const token = localStorage.getItem("token") || "";
      await axios.delete(
        `https://test.swarnsiddhi.com/admin/api/v1/content/kundli/planets/${planetToDelete}/`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowDeletePopup(false);
      setPlanetToDelete(undefined);
      toast.success("Planet Deleted Successfully");
      navigate("/kundli/planet/list", { state: { deleted: true } });
    } catch (err) {
      // @ts-expect-error: error object may not have response property
      toast.error(err?.response?.data?.message || "Failed to delete planet");
    }
  };

  // ...removed markdownButtons and insertMarkdown logic...

  // ...removed renderMarkdown logic...

  // Validate form
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!title.trim()) errors.title = "Title is required";
    if (!content.trim()) errors.content = "Content is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token") || "";
      await axios.put(
        `https://test.swarnsiddhi.com/admin/api/v1/content/kundli/planets/${planetId}/`,
        {
          name,
          description: title, // fallback to English for main description
          description_en: content,
          description_hi: contentHi,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAddedSuccess(true);
      toast.success("Planet updated successfully!");
      setTimeout(() => setAddedSuccess(false), 2500);
    } catch (err) {
      // @ts-expect-error: error object may not have response property
      setError(err?.response?.data?.message || "Failed to update planet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If planet is passed in location.state, use it, otherwise fetch by ID
    const fetchPlanet = async () => {
      if (planet) {
        setTitle(planet.short_description || "");
        // Removed setTitleHi (no Hindi title modal)
        setContent(planet.description || "");
        setContentHi(planet.description_hi || "");
        setName(planet.name || "");
      } else if (planetId) {
        try {
          const token = localStorage.getItem("token") || "";
          const res = await axios.get(
            `https://test.swarnsiddhi.com/admin/api/v1/content/kundli/planets/${planetId}/`,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = res.data || {};
          console.log("planet data", data);
          setTitle(data.description || "");
          setContent(data.description_en || "");
          setContentHi(data.description_hi || "");
          setName(data.name || "");
        } catch (err) {
          // @ts-expect-error: error object may not have response property
          toast.error(err?.response?.data?.message || "Failed to fetch planet");
        }
      } else {
        toast.error("No planet ID provided");
        navigate("/kundli/planet/all");
      }
    };
    fetchPlanet();
    // (removed unused eslint-disable-next-line)
  }, [planet, planetId, navigate]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Edit3 className="h-8 w-8" />
        Edit Planet - Markdown Editor
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Language Control Only */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-blue-600" />
            <label className="text-sm font-medium text-gray-700">
              Language:
            </label>
            <select
              value={activeLanguage}
              onChange={(e) => setActiveLanguage(e.target.value as "en" | "hi")}
              className="px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
        </div>

        {/* Title Fields - always show both, no activeEditor logic */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="col-span-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name (English)
            </label>
            <select
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-required="true"
              required
              aria-describedby="title-error"
            >
              <option value="">Select Planet</option>
              {[
                "sun",
                "moon",
                "mars",
                "mercury",
                "jupiter",
                "venus",
                "saturn",
                "rahu",
                "ketu",
              ].map((rashi) => (
                <option key={rashi} value={rashi}>
                  {rashi}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label
              htmlFor="title"
              className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2"
            >
              Description (General)
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                onClick={handleOpenTitleEdit}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </label>
            <div
              className="min-h-[2.5rem] p-2 border border-gray-300 rounded-md bg-gray-50"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            {formErrors.title && (
              <p id="title-error" className="mt-1 text-sm text-red-600">
                {formErrors.title}
              </p>
            )}
            {/* Title Edit Modal Popup with Tiptap */}
            {showTitleEditModal && (
              <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Edit Description (General)
                  </h3>
                  <TiptapEditor
                    value={tiptapModalContent}
                    onChange={setTiptapModalContent}
                    height="80px"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                      onClick={() => setShowTitleEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                      onClick={handleSaveTitleEdit}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Content Fields - always show both, no activeEditor logic */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="content"
              className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2"
            >
              Description (English)
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                onClick={handleOpenContentEdit}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </label>
            <div
              className="min-h-[300px] p-4 border border-gray-300 rounded-md bg-gray-50 overflow-auto prose max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            {formErrors.content && (
              <p id="content-error" className="mt-1 text-sm text-red-600">
                {formErrors.content}
              </p>
            )}
            {/* Content Edit Modal Popup with Tiptap */}
            {showContentEditModal && (
              <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Edit Description (English)
                  </h3>
                  <TiptapEditor
                    value={tiptapModalContent}
                    onChange={setTiptapModalContent}
                    height="300px"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                      onClick={() => setShowContentEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                      onClick={handleSaveContentEdit}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="content_hi"
              className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2"
            >
              Description (Hindi)
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                onClick={handleOpenContentHiEdit}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </label>
            <div
              className="min-h-[300px] p-4 border border-gray-300 rounded-md bg-gray-50 overflow-auto prose max-w-none"
              dangerouslySetInnerHTML={{ __html: contentHi }}
            />
            {/* Content Hi Edit Modal Popup with Tiptap */}
            {showContentHiEditModal && (
              <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Edit Description (Hindi)
                  </h3>
                  <TiptapEditor
                    value={tiptapModalContentHi}
                    onChange={setTiptapModalContentHi}
                    height="300px"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                      onClick={() => setShowContentHiEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                      onClick={handleSaveContentHiEdit}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-lg"
            aria-label="Update planet"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Planet"}
          </button>
          <button
            type="button"
            className="w-full md:w-auto px-6 py-3 rounded-md font-medium text-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-600 text-white hover:bg-red-700"
            aria-label="Delete planet"
            onClick={() => handleDeleteClick(planetId)}
            disabled={loading || !planetId}
          >
            Delete Planet
          </button>
        </div>
        {addedSuccess && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 font-medium text-center">
            Planet updated successfully!
          </div>
        )}
        {error && <div className="mt-4 text-red-600">{error}</div>}
      </form>
      {/* DELETE: Delete Confirmation Popup */}
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

export default EditPlanet;
