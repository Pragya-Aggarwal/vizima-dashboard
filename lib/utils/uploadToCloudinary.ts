
import { toast } from "@/hooks/use-toast";

// Track uploaded files to prevent duplicates
const uploadedFiles = new Set<string>();

const showErrorToast = (message: string) => {
  toast({
    variant: "destructive",
    title: "Upload Error",
    description: message,
  });
};

const showSuccessToast = (message: string) => {
  toast({
    variant: "default",
    title: "Success",
    description: message,
  });
};

/**
 * Format public ID by replacing spaces with underscores
 */
const formatPublicId = (fileName: string): string => {
  return fileName.replace(/\s+/g, '_');
};

/**
 * Delete an image from the server
 * @param fileName The name of the file to delete (spaces will be replaced with underscores)
 * @returns Promise that resolves when deletion is complete
 */
export const deleteImage = async (fileName: string): Promise<void> => {
  const publicId = formatPublicId(fileName);
  
  try {
    const response = await fetch(`https://api.vizima.in/api/images/${publicId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete image');
    }

    // Remove from tracking if it was uploaded in this session
    const fileIdentifier = `${fileName}-${await getFileSize(fileName)}`;
    uploadedFiles.delete(fileIdentifier);
    
    showSuccessToast('Image deleted successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    showErrorToast(`Failed to delete image: ${errorMessage}`);
    throw error;
  }
};

/**
 * Helper function to get file size (mock implementation - adjust as needed)
 * This is used to maintain consistency with the upload tracking
 */
async function getFileSize(fileName: string): Promise<number> {
  // In a real implementation, you might want to fetch the file info from the server
  // For now, we'll return 0 as we're mainly interested in the file name for tracking
  return 0;
}

export const uploadToCloudinary = async (file: File, isSingleImageUpload: boolean = false): Promise<string> => {
  // Create a unique identifier for the file (name + size)
  const fileIdentifier = `${file.name}-${file.size}`;
  
  // For single image uploads, we don't need to track previous uploads
  // as they should be replaceable
  if (!isSingleImageUpload && uploadedFiles.has(fileIdentifier)) {
    const errorMessage = `The file "${file.name}" has already been uploaded.`;
    showErrorToast(errorMessage);
    return Promise.reject(new Error(errorMessage));
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_preset");

    const res = await fetch("https://api.cloudinary.com/v1_1/dwztiucdp/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMessage = data.error?.message || "Failed to upload image to Cloudinary";
      showErrorToast(errorMessage);
      return Promise.reject(new Error(errorMessage));
    }

    // Add file to the set of uploaded files
    uploadedFiles.add(fileIdentifier);
    
    return data.secure_url;
  } catch (error) {
    if (error instanceof Error) {
      if (!error.message.includes('already been uploaded')) {
        showErrorToast("An unexpected error occurred during file upload.");
      }
      return Promise.reject(error);
    }
    const unknownError = new Error("An unknown error occurred");
    showErrorToast(unknownError.message);
    return Promise.reject(unknownError);
  }
};
