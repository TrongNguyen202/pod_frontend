import axios from 'axios';
import imageCompression from 'browser-image-compression';

const compressImageAdvanced = async (file) => {
  const options = {
    maxSizeMB: 5, // Giới hạn 5MB
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.8,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Compression failed:', error);
    return file;
  }
};

export const uploadImagesConcurrently = async (imageFiles) => {
  try {
    const uploadPromises = imageFiles.map(async (file) => {
      const compressedFile = await compressImageAdvanced(file);

      const uploadFormData = new FormData();
      uploadFormData.append('file', compressedFile);
      uploadFormData.append('source', 'tts_product');

      const response = await axios.post(
        'https://upload-service-staging-api.ecomdy.com/api/upload/image',
        uploadFormData,
        {
          headers: {
            Accept: 'application/json',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODUyNjFlN2M5ZDRkYTYwMWQyNGI5YTAiLCJsb2NhbFVzZXJJZCI6MTAyOTcyOCwiZW1haWwiOiJ0cm9uZ3Byb3RlaW5AZ21haWwuY29tIiwiZnVsbE5hbWUiOiJuZ3V5ZW4gZGluaCB0cm9uZyIsImdyYW50U2VydmljZVR5cGUiOiJUVFMiLCJpYXQiOjE3NTQwMDkwNjgsImV4cCI6MTc1NTAwOTA2OH0.SzuWd2H_wXJdgtoO_HDrNjEcJuU9J1ZjSjT2r0Dz5es`,
            Origin: 'https://shop.sellgrow.ai',
            priority: 'u=1, i',
            referer: 'https://shop.sellgrow.ai/',
            'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': 'Windows',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
          },
        },
      );

      return response.data.result.imageUrl;
    });

    // Chờ tất cả upload hoàn thành song song
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};
