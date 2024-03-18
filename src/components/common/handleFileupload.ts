
import toast from 'react-hot-toast';
import axios from 'axios';

const uploadTos3AndSaveComment = async (file: any, url: string, formData: any, fields: any, setSignedUrls: any) => {
  try {
    const uploadResponse = await fetch(url, {
      method: 'POST',
      body: formData,
    })
    console.log(uploadResponse, "uploadResponseuploadResponseuploadResponse")
    if (uploadResponse.ok) {
      setSignedUrls((prevImageUrls: string[]) => [...prevImageUrls, { filename: file.name, contentType: file.type, url: `${uploadResponse.url}${fields.key}` }])
    } else {
      console.error('S3 Upload Error:', uploadResponse)
    }
  } catch (error) {
    console.error('S3 Upload Error:', error)
  }
}

export const handleFileSubmit = async (files: any, setSignedUrls: any, setUploading: any) => {
  if (files.length > 0) {
    setUploading(true)
    const toastId = toast.loading('Uploading...');
    try {
      const uploadPromises = files.map(async (file: any) => {
        if (!file) {
          alert('Please select a file to upload.')
          return;
        }
        const res = await axios.post('/api/upload', { filename: file.name, contentType: file.type });
        if (res.data && res.data.url) {
          const { url, fields } = res.data;
          const formData = new FormData();
          Object.entries(fields).forEach(([key, value]) => {
            formData.append(key, value as string);
          });
          formData.append('file', file);
          await uploadTos3AndSaveComment(file, url, formData, fields, setSignedUrls);
        }
      });

      await Promise.all(uploadPromises);
    } catch (error) {
      toast.error('Failed to upload file.');
    } finally {
      toast.dismiss(toastId)
      setUploading(false)
    }
  }
};