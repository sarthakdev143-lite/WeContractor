import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

cloudinary.config({
    cloud_name: "dgbnelai8",
    api_key: "273135548264156",
    api_secret: "kJrvZM4VJmribGudOtaK24480l0",
});

export async function POST(request) {
    const { public_id, type } = await request.json();

    try {
        const result = await cloudinary.v2.uploader.destroy(public_id, { invalidate: true, resource_type: type.toLowerCase().replace(/s$/, '') });
        console.log('## Deletion result:', result); // Log the complete result
        return NextResponse.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('## Error deleting file from Cloudinary:', error);
        return NextResponse.json({ error: 'Failed to delete file from Cloudinary' }, { status: 500 });
    }

}