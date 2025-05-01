import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, X } from "lucide-react";
import { useStudy } from "../contexts/StudyContext";

const FileUpload: React.FC = () => {
  const { file, setFile } = useStudy();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/msword": [".doc"],
      "text/plain": [".txt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
    },
  });

  const removeFile = () => {
    setFile(null);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) {
      return "text-red-500";
    } else if (fileType.includes("word") || fileType.includes("docx")) {
      return "text-blue-500";
    } else {
      return "text-gray-500";
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Upload Document</label>

      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 transition-colors duration-200 text-center cursor-pointer
            ${
              isDragActive
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                : "border-gray-300 hover:border-purple-400"
            }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm">
            {isDragActive
              ? "Drop your file here..."
              : "Drag & drop your file here, or click to select"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Supported formats: PDF, DOCX, DOC, PPTX, TXT
          </p>
        </div>
      ) : (
        <div
          className={`flex items-center justify-between p-4 rounded-lg border ${
            file
              ? "border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-900/20"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center">
            <FileText className={`h-10 w-10 mr-3 ${getFileIcon(file.type)}`} />
            <div>
              <p className="font-medium truncate max-w-[200px] sm:max-w-xs">
                {file.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Remove file"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
