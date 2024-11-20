# S3 File Upload React App with Pre-signed URLs

This application enables secure file uploads to AWS S3 using pre-signed URLs from Sigma workbooks, implemented as a Sigma plugin. It provides a secure way to handle file uploads and downloads without exposing AWS credentials to end users, while tying unstructured data to structured data within the Sigma environment!

## Key Features
- Secure file uploads using pre-signed URLs
- Temporary (configurable time horizon) download links for uploaded files
- Integration with Sigma
- Configurable server endpoint
- Automatic file URL synchronization with Sigma variables

## Prerequisites

1. **Git**: Version control
2. **Node.js**: v14 or higher
3. **AWS Account**: With S3 permissions
4. **Sigma Computing Account**: For plugin deployment

## Step 1: Clone the Repository

```bash
git clone <REPO_URL>
cd <REPO_DIRECTORY>
```

## Step 2: Set Up Environment Variables

Create a `.env` file in the backend folder:

```
AWS_REGION=your-aws-region         # Region where your S3 bucket exists
AWS_ACCESS_KEY_ID=your-key-id      # IAM user access key with S3 permissions
AWS_SECRET_ACCESS_KEY=your-secret  # IAM user secret
BUCKET_NAME=your-bucket-name       # Target S3 bucket for file uploads
```

## Step 3: Configure AWS S3

1. **Create S3 Bucket**
   - Navigate to S3 Dashboard
   - Create bucket with unique name
   - Set appropriate region
   - Configure bucket policy for your use case

2. **Configure CORS** (Required for browser uploads)
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["POST", "GET"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

3. **IAM Setup**
   - Create user with `AmazonS3FullAccess` or custom policy:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject"
         ],
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```

## Step 4: Installation & Setup

**Backend:**
```bash
npm install
```

**Frontend:**
```bash
npm install
```

## Step 5: Launch Application

**Backend Server:**
```bash
node server.js   # Runs on port 5000
```

**Frontend Development:**
```bash
npm start       # Access via http://localhost:3000
```

## Sigma Computing Integration

1. Set the `serverUrl` config in the plugin settings
2. Bind the `Upload-URL` variable to your desired worksheet cell
3. Upload files to receive temporary download URLs

## Security Notes

- Pre-signed URLs expire after 60 seconds (upload) and 5 minutes (download)
- Rotate AWS credentials regularly
- Configure S3 bucket with appropriate access policies

## Troubleshooting

- **Upload Fails**: Check AWS credentials and bucket permissions
- **CORS Errors**: Verify CORS configuration matches your domain
- **Variable Not Updating**: Ensure Sigma variable binding is correct
- **Server Connection**: Verify server URL in plugin config

## Component Architecture

**Backend (`server.js`)**:
- Express server handling pre-signed URL generation
- Separate endpoints for upload and download URLs
- Environmental configuration for AWS services

**Frontend (`UploadFile.js`)**:
- React component with Sigma plugin integration
- File upload handling with progress feedback
- Automatic URL synchronization with Sigma variables
