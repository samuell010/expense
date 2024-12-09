import React, { useState, ChangeEvent, FormEvent } from "react";
//import { useAuth0 } from "@auth0/auth0-react";

const PdfUploadTest: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      // Append the newly selected files to the existing list
      setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (selectedFiles.length === 0) {
      alert("Please select at least one PDF file to upload");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("http://localhost:3005/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Files uploaded successfully");
      } else {
        alert("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files");
    }
  };

  //const { isAuthenticated } = useAuth0();

  // Checking if the user is logged in. If not, the user will be directed to the welcome page
  //if (isAuthenticated == false){
    //navigate("/");
  //}

  return (
    <div className="flex h-[100vh] items-center justify-center">
      <div className="flex h-1/3 w-3/4 flex-col gap-y-5 border border-red-200 text-white">
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-8 my-5">
          <label htmlFor="file">Choose PDF files to upload:</label>
          <input
            type="file"
            id="file"
            name="files"
            accept=".pdf, .png, .jpg, .jpeg"
            multiple
            onChange={handleFileChange}
          />
          <div>
            <h4>Files ready for upload:</h4>
            {selectedFiles.length > 0 ? (
              <ul>
                {selectedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            ) : (
              <p>No files selected yet.</p>
            )}
          </div>
          <button type="submit" className="w-44 rounded-xl bg-blue-400 p-1">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default PdfUploadTest;
