// server.js
require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');

const app = express();
app.use(cors());

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION,           // e.g., 'us-west-1'
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

// Endpoint to generate a pre-signed POST URL for uploading files
app.get('/presigned-url', (req, res) => {
  const fileName = req.query.fileName;

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Fields: {
      key: fileName,
    },
    Expires: 60, // URL expires in 60 seconds
  };

  s3.createPresignedPost(params, (err, data) => {
    if (err) {
      console.error('Error creating pre-signed POST URL', err);
      return res.status(500).json({ error: 'Error creating pre-signed POST URL' });
    }
    res.json(data);
  });
});

// New endpoint to generate a pre-signed GET URL for accessing the uploaded file
app.get('/get-object-url', (req, res) => {
  const fileName = req.query.fileName;

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    Expires: 60 * 5, // URL expires in 5 minutes
  };

  s3.getSignedUrl('getObject', params, (err, url) => {
    if (err) {
      console.error('Error generating pre-signed GET URL', err);
      return res.status(500).json({ error: 'Error generating pre-signed GET URL' });
    }
    res.json({ url });
  });
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});