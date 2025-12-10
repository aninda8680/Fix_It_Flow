# Cloudinary Setup Guide

## Environment Variables Required

Add these to your `.env` file in the `fif_backend` directory:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## How to Get Cloudinary Credentials

1. Go to [Cloudinary](https://cloudinary.com/) and sign up for a free account
2. Once logged in, go to your Dashboard
3. You'll find your credentials in the Dashboard:
   - **Cloud Name**: Found at the top of the dashboard
   - **API Key**: Found in the "Account Details" section
   - **API Secret**: Found in the "Account Details" section (click "Reveal" to see it)

## Features

- ✅ Multiple image upload support (up to 10 images per complaint)
- ✅ Images stored in Cloudinary cloud storage
- ✅ Automatic image optimization
- ✅ Secure image URLs
- ✅ Images organized by complaint ID: `fixitflow/complaints/{complaintId}/`
- ✅ Each complaint has its own folder/collection for easy management

## Image Limits

- Maximum file size: 5MB per image
- Maximum images per complaint: 10
- Supported formats: All image formats (JPEG, PNG, GIF, WebP, etc.)

