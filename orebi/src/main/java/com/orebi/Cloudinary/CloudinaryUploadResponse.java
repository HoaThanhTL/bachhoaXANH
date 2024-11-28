package com.orebi.Cloudinary;


public class CloudinaryUploadResponse {
    private String url;
    private String publicId;

    public CloudinaryUploadResponse(String url, String publicId) {
        this.url = url;
        this.publicId = publicId;
    }

    // Getters and setters
    public String getUrl() {
        return url;
    }

    public String getPublicId() {
        return publicId;
    }
}