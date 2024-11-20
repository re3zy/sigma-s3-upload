import React, { useRef } from 'react';
import './UploadFile.css';
import { useVariable, useConfig, client } from '@sigmacomputing/plugin';

// Configure the editor panel
client.config.configureEditorPanel([
  {
    name: 'Upload-URL',
    type: 'variable',
    allowedTypes: ['text'],
  },
  {
    name: 'serverUrl',
    type: 'text',
    defaultValue: 'http://localhost:5000', // Change this to your server's URL when deployed
  },
]);

function UploadFile() {
  const fileInputRef = useRef(null);

  // Get the server URL from the plugin config
  const serverUrl = useConfig('serverUrl');

  // Bind to the Upload-URL variable
  const [, setUploadUrl] = useVariable('Upload-URL');

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    try {
      const response = await fetch(
        `${serverUrl}/presigned-url?fileName=${encodeURIComponent(selectedFile.name)}`
      );
      const { url, fields } = await response.json();

      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
      formData.append('file', selectedFile);

      const uploadResponse = await fetch(url, { method: 'POST', body: formData });

      if (uploadResponse.ok) {
        const getUrlResponse = await fetch(
          `${serverUrl}/get-object-url?fileName=${encodeURIComponent(selectedFile.name)}`
        );
        const { url: uploadedFileUrl } = await getUrlResponse.json();

        // Set the control value
        setUploadUrl(uploadedFileUrl);
        console.log('Upload-URL control value set to:', uploadedFileUrl);
      } else {
        console.error('Failed to upload file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="upload-container">
      <button onClick={handleButtonClick} className="upload-button">
        Upload File
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}

export default UploadFile;