/**
 * Vercel Serverless Function - DART API Proxy
 *
 * DART API 키를 서버사이드에서 관리하여 클라이언트에 노출되지 않도록 합니다.
 * 환경변수 DART_API_KEY에 API 키를 설정하세요.
 *
 * 사용: GET /api/dart?endpoint=list.json&bgn_de=20250101&end_de=20250326&page_count=100
 */

export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': '*',
    };

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    const API_KEY = process.env.DART_API_KEY;
    if (!API_KEY) {
        return new Response(
            JSON.stringify({ status: '500', message: 'DART_API_KEY 환경변수가 설정되지 않았습니다.' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const endpoint = params.endpoint;

    if (!endpoint) {
        return new Response(
            JSON.stringify({ status: '400', message: 'endpoint 파라미터가 필요합니다.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    // Whitelist allowed endpoints
    const allowedEndpoints = ['list.json', 'company.json', 'corpCode.xml'];
    if (!allowedEndpoints.includes(endpoint)) {
        return new Response(
            JSON.stringify({ status: '403', message: '허용되지 않은 API 엔드포인트입니다.' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    // Build DART API URL
    const dartUrl = new URL(`https://opendart.fss.or.kr/api/${endpoint}`);
    dartUrl.searchParams.set('crtfc_key', API_KEY);

    // Forward all params except 'endpoint'
    for (const [key, value] of Object.entries(params)) {
        if (key !== 'endpoint') {
            dartUrl.searchParams.set(key, value);
        }
    }

    try {
        const response = await fetch(dartUrl.toString(), {
            headers: { 'User-Agent': 'DART-Monitor/1.0' },
        });

        const contentType = response.headers.get('Content-Type') || 'application/json';
        const body = await response.arrayBuffer();

        return new Response(body, {
            status: response.status,
            headers: {
                ...corsHeaders,
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=60',
            },
        });
    } catch (err) {
        return new Response(
            JSON.stringify({ status: '502', message: `DART API 요청 실패: ${err.message}` }),
            { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
}
