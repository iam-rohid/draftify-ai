import { Template } from "@/models/template";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";

const TemplateCard = ({
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
      className="flex flex-col justify-start rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-4 text-start shadow-md hover:border-slate-200 hover:shadow-lg dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:hover:border-zinc-700"
    >
      <span className="mb-2 inline-block text-3xl">
        <HiOutlineQuestionMarkCircle />
      </span>
      <h3 className="mb-2 font-medium">{template.name}</h3>
      <p className="text-sm font-light text-slate-600 dark:text-zinc-300">
        {template.description}
      </p>
    </button>
  );
};

export default TemplateCard;
