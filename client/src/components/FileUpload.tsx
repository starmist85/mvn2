import { useState, useRef } from "react";
import { Upload, X, Music, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  fileType: "image" | "audio";
  label: string;
  currentUrl?: string;
}

export default function FileUpload({ onUploadComplete, fileType, label, currentUrl }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptTypes = fileType === "image" ? "image/jpeg,image/png,image/webp" : "audio/mpeg,audio/wav,audio/ogg,audio/mp4";
  const maxSize = fileType === "image" ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB for images, 50MB for audio

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith(fileType === "image" ? "image" : "audio")) {
      toast.error(`Please select a valid ${fileType} file`);
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", fileType);

      // Upload to backend endpoint
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const uploadedUrl = data.url;

      // Set preview
      if (fileType === "image") {
        setPreview(uploadedUrl);
      } else {
        setPreview(`audio-${file.name}`); // Show filename for audio
      }

      onUploadComplete(uploadedUrl);
      toast.success(`${fileType === "image" ? "Image" : "Audio"} uploaded successfully!`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const event = {
        target: {
          files: [file],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      await handleFileSelect(event);
    }
  };

  const handleClear = () => {
    setPreview(null);
    onUploadComplete("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">{label}</label>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center cursor-pointer hover:border-accent transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptTypes}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {fileType === "image" ? (
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            ) : (
              <Music className="w-8 h-8 text-muted-foreground" />
            )}
            <p className="text-sm font-medium">
              Drag and drop your {fileType} here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              {fileType === "image" ? "PNG, JPG, WebP up to 5MB" : "MP3, WAV, OGG, M4A up to 50MB"}
            </p>
          </div>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <div className="space-y-2">
          {fileType === "image" ? (
            <div className="relative w-full h-40 bg-muted rounded-lg overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleClear}
                className="absolute top-2 right-2 p-1 bg-destructive rounded-full text-white hover:bg-destructive/90"
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium truncate">{preview}</span>
              </div>
              <button
                onClick={handleClear}
                className="p-1 hover:bg-background rounded transition-colors"
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
