
import { useRef } from 'react';
import { Paperclip } from 'lucide-react';

interface FilePickerProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function FilePicker({ onFileSelect, disabled }: FilePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="p-2 rounded-full text-mental-green-600 hover:bg-mental-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Paperclip size={20} />
        <span className="sr-only">Attach file</span>
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.txt,.doc,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />
    </>
  );
}

export default FilePicker;
