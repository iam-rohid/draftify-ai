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
      className="flex flex-col justify-start rounded-xl bg-white p-4 text-left shadow-sm hover:shadow-lg dark:border-none dark:bg-zinc-800 dark:shadow-none dark:hover:bg-zinc-700/70"
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
