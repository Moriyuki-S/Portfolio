import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    const formData = await request.formData();
    console.log(formData)

    return new Response(
        JSON.stringify({
            success: true,
        }),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
};

export const ALL: APIRoute = () =>
    new Response(null, {
        status: 405,
        statusText: 'Method Not Allowed',
    });
