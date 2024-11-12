import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadToS3 = async (file, folder) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${folder}/${Date.now().toString()}_${file.originalname}`, // Key for file name
    Body: file.buffer,
    ContentType: file.mimetype, // Ensure correct file type
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location; // URL of the uploaded file
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('S3 upload failed');
  }
};
