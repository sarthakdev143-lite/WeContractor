export async function GET() {
    return Response.json({
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        uploadPreset: "user_pfp_upload",
        cloudinaryUrl: process.env.CLOUDINARY_URL
    });
}