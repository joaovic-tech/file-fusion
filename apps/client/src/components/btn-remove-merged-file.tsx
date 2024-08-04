import { RotateCcw } from "lucide-react";

// Defina os tipos das props
interface BtnRemoveMergedFileProps {
  setMergedFile: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const BtnRemoveMergedFile: React.FC<BtnRemoveMergedFileProps> = ({
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
    >
      <RotateCcw />
    </button>
  );
};

export default BtnRemoveMergedFile;
