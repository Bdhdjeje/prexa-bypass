exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { cookie } = JSON.parse(event.body);
        
        if (!cookie) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing cookie' })
            };
        }

        const response = await fetch('https://www.roblox.com/mobileapi/userinfo', {
            headers: {
                'Cookie': `.ROBLOSECURITY=${cookie}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: 'Failed to fetch Roblox profile' })
            };
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                username: data.UserName || 'Unknown',
                userID: data.UserID || 'Unknown',
                accountAge: data.AccountAge || 'Unknown',
                avatar: data.AvatarURL || null,
                robux: data.RobuxBalance || 'Unknown'
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
