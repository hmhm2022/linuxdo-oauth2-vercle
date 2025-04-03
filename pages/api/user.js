export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: '缺少访问令牌' });
  }

  const USER_INFO_ENDPOINT = 'https://connect.linux.do/api/user';

  try {
    const response = await fetch(USER_INFO_ENDPOINT, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error_description || data.message || '获取用户信息失败');
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return res.status(500).json({ error: error.message || '获取用户信息时发生服务器错误' });
  }
} 