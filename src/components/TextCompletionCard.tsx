import { formatDistanceToNow } from "date-fns";
import { useCallback, useState } from "react";
import {
  HiOutlineCheck,
  HiOutlineClipboard,
  HiOutlineDocumentDuplicate,
  HiOutlineTrash,
} from "react-icons/hi2";

const TextCompletionCard = ({
  completion,
  onRemove,
}: {
  completion: { id: string; text: string; createdAt: string };
  onRemove?: (id: string) => void;
}) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    if (copied) return;
    await window.navigator.clipboard.writeText(completion.text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }, [completion, copied]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white from-white to-slate-50 p-4 shadow-md hover:border-slate-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 md:p-6">
      <p className="mb-2 text-sm font-light text-slate-500 dark:text-zinc-400">
        Generated{" "}
        {formatDistanceToNow(new Date(completion.createdAt), {
          addSuffix: true,
        })}
      </p>
      <p className="whitespace-pre-wrap leading-7 text-slate-700 dark:text-zinc-200">
        {completion.text}
      </p>
      <div className="mt-4 flex items-center gap-2 md:mt-6">
        <button
          className="flex items-center rounded-lg border border-slate-200 px-3 py-2 text-sm hover:border-slate-300 dark:border-zinc-700 dark:hover:border-zinc-600"
          onClick={handleCopy}
          disabled={copied}
        >
          <span className="mr-2 -ml-1 text-lg">
            {copied ? <HiOutlineCheck /> : <HiOutlineClipboard />}
          </span>
          {copied ? "Copied" : "Copy"}
        </button>
        {/* <button className="flex items-center rounded-lg border border-slate-200 px-3 py-2 text-sm hover:border-slate-300 dark:border-zinc-700 dark:hover:border-zinc-600">
          <span className="mr-2 -ml-1 text-lg">
            <HiOutlineDocumentDuplicate />
          </span>
          More Variations
        </button> */}
        <button
          className="flex items-center rounded-lg border border-slate-200 px-3 py-2 text-sm hover:border-slate-300 dark:border-zinc-700 dark:hover:border-zinc-600"
          onClick={() => onRemove?.(completion.id)}
        >
          <span
            className="mr-2 -ml-1 text-lg"
            onClick={() => onRemove?.(completion.id)}
          >
            <HiOutlineTrash />
          </span>
          Remove
        </button>
      </div>
    </div>
  );
};

export default TextCompletionCard;
