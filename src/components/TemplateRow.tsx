import { Template } from "@/models/template";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";

const TemplateRow = ({
  template,
  onClick,
}: {
  template: Template;
  onClick?: (template: Template) => void;
}) => {
  return (
    <button
      onClick={() => onClick?.(template)}
      key={template.id}
      className="flex items-center justify-start rounded-lg border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-2 text-start shadow-md hover:border-slate-200 hover:shadow-lg dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:hover:border-zinc-700"
    >
      <span className="mr-2 inline-block text-2xl">
        <HiOutlineQuestionMarkCircle />
      </span>
      <div className="flex-1">
        <h3 className="text-sm font-medium line-clamp-1">{template.name}</h3>
        <p className="text-sm font-light leading-4 text-slate-600 line-clamp-1 dark:text-zinc-300">
          {template.description}
        </p>
      </div>
    </button>
  );
};

export default TemplateRow;
