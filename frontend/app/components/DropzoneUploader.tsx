/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Label } from "../../components/ui/label";
import Image from "next/image";
import { FaUpload } from "react-icons/fa";
import { toast } from "react-hot-toast";

interface DropzoneUploaderProps {
  imageUrls: string[];
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
}

const uploadToImgDB = (file: File): Promise<string | null> => {
  const apiKey = "282bfc054bfb4a6130de7c03466f6e5c";

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        if (!reader.result) {
          reject(null);
          return;
        }

        const base64 = (reader.result as string).split(",")[1];
        if (!base64) {
          reject(null);
          return;
        }

        const formData = new FormData();
        formData.append("key", apiKey);
        formData.append("image", base64);

        const res = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (res.ok && data?.data?.url) {
          resolve(data.data.url);
        } else {
          reject(null);
        }
      } catch (error) {
        reject(null);
      }
    };

    reader.onerror = () => reject(null);
    reader.readAsDataURL(file);
  });
};

export const DropzoneUploader: React.FC<DropzoneUploaderProps> = ({
  imageUrls,
  setImageUrls,
}) => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const filteredFiles = acceptedFiles.filter((file) => {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`${file.name} is larger than 5MB.`);
          return false;
        }
        return true;
      });

      if (filteredFiles.length === 0) return;

      setIsUploading(true);

      for (const file of filteredFiles) {
        try {
          const url = await uploadToImgDB(file);
          if (url) {
            setImageUrls((prev) => [...prev, url]);
          } else {
            toast.error(`Failed to upload ${file.name}`);
          }
        } catch {
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      setIsUploading(false);
    },
    [setImageUrls]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
    disabled: isUploading,
    maxSize: MAX_FILE_SIZE,
  });

  return (
    <motion.div className="space-y-4">
      <Label className="text-lg font-medium text-white/90">Images</Label>

      {/* Upload box */}
      <div
        {...getRootProps()}
        className={`border border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-white/70 bg-white/5 transition
          ${isDragActive ? "border-orange-500/70 bg-white/10" : "border-white/10"}
          ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
          ${isDragReject ? "border-red-500" : ""}
        `}
      >
        <input {...getInputProps()} />
        <FaUpload className="text-orange-400 text-2xl mb-2" />
        {isUploading
          ? "Uploading images..."
          : isDragActive
          ? "Drop the images here..."
          : "Drag & drop or click to upload images"}
      </div>

      {/* grid style preview */}
      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full"
      >
        {imageUrls.map((url, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative group rounded-xl overflow-hidden border border-white/10 bg-white/10 shadow-md aspect-square"
          >
            <Image
              src={url}
              alt={`Uploaded ${index}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <button
              type="button"
              onClick={() =>
                setImageUrls((prev) => prev.filter((_, i) => i !== index))
              }
              className="absolute top-2 right-2 z-10 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-opacity duration-200 cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
