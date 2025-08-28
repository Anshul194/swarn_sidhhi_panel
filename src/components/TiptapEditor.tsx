import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import TextAlign from "@tiptap/extension-text-align";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  CodeXml,
  Link2,
  List,
  ListOrdered,
  Bold,
  Italic,
  UnderlineIcon,
} from "lucide-react";

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  value,
  onChange,
  height = "400px",
}) => {
  const [, setSelectionUpdate] = React.useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3], // only h1, h2, h3
        },
      }),
      Underline,
      Link,
      Blockquote,
      CodeBlock,
      BulletList,
      OrderedList,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: () => {
      setSelectionUpdate((v) => v + 1);
    },
    editable: true,
  });

  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
    // eslint-disable-next-line
  }, [value]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-100 rounded-lg">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={
            editor?.isActive("bold") ? "bg-blue-200 px-2 py-1 rounded" : "px-2 py-1"
          }
        >
          <Bold strokeWidth={3} className="h-5 w-5" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={
            editor?.isActive("italic")
              ? "bg-blue-200 px-2 py-1 rounded"
              : "px-2 py-1"
          }
        >
          <Italic className="h-5 w-5" />
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={
            editor?.isActive("underline")
              ? "bg-blue-200 px-2 py-1 rounded"
              : "px-2 py-1"
          }
        >
          <UnderlineIcon className="h-5 w-5" />
        </button>

        {/* Heading dropdown */}
        <div className="relative inline-block">
          <select
            className="px-2 py-1 rounded border border-gray-300 bg-white focus:outline-none"
            value={
              editor?.isActive("heading", { level: 1 })
                ? "h1"
                : editor?.isActive("heading", { level: 2 })
                ? "h2"
                : editor?.isActive("heading", { level: 3 })
                ? "h3"
                : "paragraph"
            }
            onChange={(e) => {
              const value = e.target.value;
              editor?.chain().focus().run(({ commands }) => {
                if (value === "h1") commands.setHeading({ level: 1 });
                else if (value === "h2") commands.setHeading({ level: 2 });
                else if (value === "h3") commands.setHeading({ level: 3 });
                else commands.setParagraph();
              });
            }}
          >
            <option value="paragraph">H</option>
            <option value="h1">H1</option>
            <option value="h2">H2</option>
            <option value="h3">H3</option>
          </select>
        </div>

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={
            editor?.isActive("bulletList")
              ? "bg-blue-200 px-2 py-1 rounded"
              : "px-2 py-1"
          }
        >
          <List className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={
            editor?.isActive("orderedList")
              ? "bg-blue-200 px-2 py-1 rounded"
              : "px-2 py-1"
          }
        >
          <ListOrdered className="h-5 w-5" />
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={
            editor?.isActive("blockquote")
              ? "bg-blue-200 px-2 py-1 rounded"
              : "px-2 py-1"
          }
        >
          ❝ Quote
        </button>

        {/* CodeBlock */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          className={
            editor?.isActive("codeBlock")
              ? "bg-blue-200 px-2 py-1 rounded"
              : "px-2 py-1"
          }
        >
          <CodeXml className="h-5 w-5" />
        </button>

        {/* Link */}
        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter link URL");
            if (url) editor?.chain().focus().setLink({ href: url }).run();
          }}
          className="px-2 py-1"
        >
          <Link2 className="h-5 w-5" />
        </button>

        {/* Text alignment */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          className={
            editor?.isActive({ textAlign: "left" })
              ? "bg-blue-200 px-2 py-1 rounded"
              : "px-2 py-1"
          }
        >
          <AlignLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          className={
            editor?.isActive({ textAlign: "center" })
              ? "bg-blue-200 px-2 py-1 rounded"
              : "px-2 py-1"
          }
        >
          <AlignCenter className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          className={
            editor?.isActive({ textAlign: "right" })
              ? "bg-blue-200 px-2 py-1 rounded"
              : "px-2 py-1"
          }
        >
          <AlignRight className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
          className={
            editor?.isActive({ textAlign: "justify" })
              ? "bg-blue-200 px-2 py-1 rounded"
              : "px-2 py-1"
          }
        >
          <AlignJustify className="h-5 w-5" />
        </button>
      </div>

      {/* Editor Content */}
      <div
        className="border border-gray-300 rounded mb-4"
        style={{ height, overflowY: "scroll" }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
