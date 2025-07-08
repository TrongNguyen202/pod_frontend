import axios from 'axios';

export const uploadImagesConcurrently = async (imageFiles) => {
  try {
    const uploadPromises = imageFiles.map(async (file) => {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('source', 'tts_product');
      const response = await axios.post(
        'https://upload-service-staging-api.ecomdy.com/api/upload/image',
        uploadFormData,
        {
          headers: {
            Accept: 'application/json',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
            Authorization:
              `Bearer ${process.env.NEXT_PUBLIC_TOKEN_SELLGROW}`,
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

