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
      className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left shadow-md hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
    >
      <span className="mb-2 inline-block text-3xl">
        <HiOutlineQuestionMarkCircle />
      </span>
      <h3 className="mb-1.5 font-medium">{template.name}</h3>
      <p className="text-sm font-light text-slate-600 dark:text-zinc-300">
        {template.description}
      </p>
    </button>
  );
};

export default TemplateCard;
