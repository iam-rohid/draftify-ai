import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";

const TemplateCard = ({
  templateId,
  description,
  name,
  onClick,
}: {
  templateId: string;
  description: string;
  name: string;
  onClick?: (id: string) => void;
}) => {
  return (
    <button
      onClick={() => onClick?.(templateId)}
      key={templateId}
      className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left shadow-md hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
    >
      <span className="mb-2 inline-block text-3xl">
        <HiOutlineQuestionMarkCircle />
      </span>
      <h3 className="mb-1.5 font-medium">{name}</h3>
      <p className="text-sm font-light text-slate-600 dark:text-zinc-300">
        {description}
      </p>
    </button>
  );
};

export default TemplateCard;
