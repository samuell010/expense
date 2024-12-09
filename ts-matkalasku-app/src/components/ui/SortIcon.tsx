import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

const SortIcon: React.FC = () => {
  return (
    <div className="flex flex-col">
      <ChevronUpIcon className="h-4 w-4 text-gray-800" />
      <ChevronDownIcon className="h-4 w-4 text-gray-800" />
    </div>
  );
};

export default SortIcon;
