import fetch from 'node-fetch';
import { NextResponse } from 'next/server'

export async function POST(request) {
    const { url } = await request.json();

    if (!url) {
        return NextResponse.json({ error: 'URL is required' });
    }

    try {
        const response = await fetch(url);
        console.log(response);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Response(buffer, {
            headers: {
                'Content-Type': response.headers.get('content-type'),
                'Content-Length': String(buffer.length),
                'Content-Disposition': `attachment; filename="${url.split('/').pop().split('?')[0]}"`,
            },
        });
    } catch (error) {
        console.error('Error fetching the image:', error);
        return new Response(JSON.stringify({ error: 'Error fetching the image' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
