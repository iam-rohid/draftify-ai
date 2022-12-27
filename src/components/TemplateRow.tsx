import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";

const TemplateRow = ({
  templateId,
  description,
  name,
  onClick,
}: {
  templateId: string;
  description: string;
  name: string;
  onClick?: (templateId: string) => void;
}) => {
  return (
    <button
      onClick={() => onClick?.(templateId)}
      className="flex w-full items-center justify-start overflow-hidden rounded-lg bg-white p-2 text-left shadow-sm hover:shadow-lg dark:bg-zinc-800 dark:hover:bg-zinc-700/70"
    >
      <span className="mr-2 inline-block text-2xl">
        <HiOutlineQuestionMarkCircle />
      </span>
      <div className="flex-1">
        <h3 className="text-sm font-medium line-clamp-1">{name}</h3>
        <p className="text-xs font-light leading-4 text-slate-600 line-clamp-1 dark:text-zinc-300">
          {description}
        </p>
      </div>
    </button>
  );
};

export default TemplateRow;
