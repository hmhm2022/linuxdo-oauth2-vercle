export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: '缺少授权码' });
  }

  const CLIENT_ID = process.env.LINUXDO_CLIENT_ID;
  const CLIENT_SECRET = process.env.LINUXDO_CLIENT_SECRET;
  const REDIRECT_URI = process.env.LINUXDO_REDIRECT_URI || 
                       `${req.headers.origin}/callback`;
  const TOKEN_ENDPOINT = 'https://connect.linux.do/oauth2/token';

  try {
    // 构建请求体
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', REDIRECT_URI);

    // 创建Basic认证头
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: params.toString()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error_description || data.message || '获取token失败');
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('获取token错误:', error);
    return res.status(500).json({ error: error.message || '获取token时发生服务器错误' });
  }
} 