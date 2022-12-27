import {
  useRemirror,
  Remirror,
  EditorComponent,
  useCommands,
  useChainedCommands,
  useActive,
  useHelpers,
} from "@remirror/react";
import clsx from "clsx";
import {
  MdCheckBox,
  MdCode,
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatStrikethrough,
  MdFormatUnderlined,
  MdRedo,
  MdUndo,
} from "react-icons/md";
import { RemirrorJSON, getRemirrorJSON } from "remirror";
import { extensions } from "./extensions";

const RemirrorEditor = ({
  initialContent,
  onChange,
  placeholder,
}: {
  defaultValue?: string;
  initialContent?: RemirrorJSON;
  placeholder?: string;
  onChange?: (json: RemirrorJSON) => void;
}) => {
  const { manager, state, setState } = useRemirror({
    extensions,
    content: initialContent,
  });
  return (
    <Remirror
      manager={manager}
      state={state}
      onChange={({ state }) => {
        setState(state);
        const json = getRemirrorJSON(state);
        onChange?.(json);
      }}
      placeholder={placeholder}
    >
      <div className="editor-wrapper">
        <Toolbar />
        <EditorComponent />
        <Footer />
      </div>
    </Remirror>
  );
};

export default RemirrorEditor;

const iconButtonClsx = clsx(
  "rounded-md h-8 w-8 flex items-center justify-center font-medium hover:bg-slate-200 dark:hover:bg-zinc-800 [&.active]:bg-indigo-500 [&.active]:text-white disabled:opacity-50 disabled:pointer-events-none"
);

const Toolbar = () => {
  const { undo, redo } = useCommands();
  const chain = useChainedCommands();
  const active = useActive();
  const { undoDepth, redoDepth } = useHelpers();
  return (
    <header className="flex h-12 w-full items-center gap-px overflow-x-auto border-b border-slate-200 px-4 dark:border-zinc-800">
      <button
        className={clsx(iconButtonClsx, {
          active: active.heading({ level: 1 }),
        })}
        onClick={() => {
          chain
            .toggleHeading({
              level: 1,
            })
            .focus()
            .run();
        }}
      >
        H1
      </button>

      <button
        className={clsx(iconButtonClsx, {
          active: active.heading({ level: 2 }),
        })}
        onClick={() => {
          chain
            .toggleHeading({
              level: 2,
            })
            .focus()
            .run();
        }}
      >
        H2
      </button>

      <button
        className={clsx(iconButtonClsx, {
          active: active.heading({ level: 3 }),
        })}
        onClick={() => {
          chain
            .toggleHeading({
              level: 3,
            })
            .focus()
            .run();
        }}
      >
        H3
      </button>

      <div className="mx-2 h-6 w-px bg-slate-100 dark:bg-zinc-800"></div>

      <button
        className={clsx(iconButtonClsx, {
          active: active.bold(),
        })}
        onClick={() => chain.toggleBold().focus().run()}
      >
        <MdFormatBold className="text-xl" />
      </button>

      <button
        className={clsx(iconButtonClsx, {
          active: active.italic(),
        })}
        onClick={() => chain.toggleItalic().focus().run()}
      >
        <MdFormatItalic className="text-xl" />
      </button>

      <button
        className={clsx(iconButtonClsx, {
          active: active.strike(),
        })}
        onClick={() => chain.toggleStrike().focus().run()}
      >
        <MdFormatStrikethrough className="text-xl" />
      </button>

      <button
        className={clsx(iconButtonClsx, {
          active: active.underline(),
        })}
        onClick={() => chain.toggleUnderline().focus().run()}
      >
        <MdFormatUnderlined className="text-xl" />
      </button>

      <button
        className={clsx(iconButtonClsx, {
          active: active.code(),
        })}
        onClick={() => chain.toggleCode().focus().run()}
      >
        <MdCode />
      </button>

      <button
        className={clsx(iconButtonClsx, {
          active: active.codeBlock(),
        })}
        onClick={() => chain.toggleCodeBlock().focus().run()}
      >
        <MdCode />
      </button>

      <div className="mx-2 h-6 w-px bg-slate-100 dark:bg-zinc-800"></div>

      <button
        className={clsx(iconButtonClsx, {
          active: active.taskList(),
        })}
        onClick={() => {
          chain.toggleTaskList().focus().run();
        }}
      >
        <MdCheckBox className="text-xl" />
      </button>

      <button
        className={clsx(iconButtonClsx, {
          active: active.bulletList(),
        })}
        onClick={() => {
          chain.toggleBulletList().focus().run();
        }}
      >
        <MdFormatListBulleted className="text-xl" />
      </button>

      <button
        className={clsx(iconButtonClsx, {
          active: active.orderedList(),
        })}
        onClick={() => {
          chain.toggleOrderedList().focus().run();
        }}
      >
        <MdFormatListNumbered className="text-xl" />
      </button>

      <div className="mx-2 h-6 w-px bg-slate-100 dark:bg-zinc-800"></div>

      <button
        className={clsx(iconButtonClsx, {})}
        onClick={() => {
          undo();
        }}
        disabled={undoDepth() === 0}
      >
        <MdUndo className="text-xl" />
      </button>

      <button
        className={clsx(iconButtonClsx, {})}
        disabled={redoDepth() === 0}
        onClick={() => {
          redo();
        }}
      >
        <MdRedo className="text-xl" />
      </button>
    </header>
  );
};

const Footer = () => {
  const { getCharacterCount, getWordCount } = useHelpers();

  return (
    <footer className="flex h-10 w-full items-center border-t border-slate-200 px-4 text-sm text-slate-600 dark:border-zinc-800 dark:text-zinc-300">
      <span className="mr-2">{getCharacterCount()} characters</span>
      <span className="mr-2">•</span>
      <span>{getWordCount()} words</span>
    </footer>
  );
};
