import { RotateCcw } from "lucide-react";

// Defina os tipos das props
interface CancelMergeProps {
  setMergedFile: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const CancelMerge: React.FC<CancelMergeProps> = ({
  setMergedFile,
  setSelectedFiles,
}) => {
  const removeMergedFile = (): void => {
    setMergedFile(null);
    setSelectedFiles([]);
  };

  return (
    <button
      onClick={removeMergedFile}
      className="absolute top-0 right-0 px-2 py-2 bg-transparent text-zinc-950 hover:text-zinc-400 dark:text-zinc-50"
      title="Voltar"
    >
      <RotateCcw />
    </button>
  );
};

export default CancelMerge;
