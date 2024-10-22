import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request) {
    try {
        // Validate environment variables
        if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
            !process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET) {
            console.error('Missing Cloudinary environment variables');
            return NextResponse.json(
                { error: 'Cloudinary configuration is incomplete' },
                { status: 500 }
            );
        }

        // Parse request body
        const { public_id, type } = await request.json();

        // Validate required parameters
        if (!public_id || !type) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // Process resource type
        const resourceType = type.toLowerCase().replace(/s$/, '');

        // Delete the file
        const result = await cloudinary.uploader.destroy(public_id, {
            invalidate: true,
            resource_type: resourceType
        });

        console.log('Deletion result:', result);

        if (result.result === 'ok') {
            return NextResponse.json({
                message: 'File deleted successfully',
                result
            });
        } else {
            return NextResponse.json(
                { error: 'Failed to delete file', result },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete file from Cloudinary' },
            { status: 500 }
        );
    }
}