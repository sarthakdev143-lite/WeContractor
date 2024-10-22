export async function GET() {
    console.log("#" + process.env.CLOUDINARY_URL);

    return Response.json({
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        uploadPreset: "user_pfp_upload",
        cloudinaryUrl: "https://api.cloudinary.com/v1_1/dgbnelai8/upload"
    });
}