import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Callback() {
  const router = useRouter();
  const [status, setStatus] = useState('处理中...');
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;

    const { code, state } = router.query;
    const savedState = typeof window !== 'undefined' ? localStorage.getItem('oauth_state') : null;

    if (!code) {
      setError('未收到授权码，授权失败');
      return;
    }

    if (state !== savedState) {
      setError('状态验证失败，可能存在CSRF攻击风险');
      return;
    }

    // 清除状态
    localStorage.removeItem('oauth_state');

    // 获取token
    fetch('/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('获取token失败');
        }
        return response.json();
      })
      .then(data => {
        if (!data.access_token) {
          throw new Error('未获取到有效token');
        }
        
        setStatus('获取用户信息中...');
        
        // 获取用户信息
        return fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: data.access_token }),
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('获取用户信息失败');
        }
        return response.json();
      })
      .then(userData => {
        setStatus('授权成功');
        setUserInfo(userData);
      })
      .catch(err => {
        setError(err.message || '授权过程中发生错误');
      });
  }, [router.isReady, router.query]);

  return (
    <div className={styles.container}>
      <Head>
        <title>LinuxDo OAuth2 回调</title>
        <meta name="description" content="LinuxDo OAuth2 回调处理" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {error ? '授权失败' : status}
        </h1>

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
            <button onClick={() => router.push('/')}>返回登录</button>
          </div>
        )}

        {userInfo && (
          <div className={styles.userInfo}>
            <h2>用户信息</h2>
            <p><strong>ID:</strong> {userInfo.id}</p>
            <p><strong>用户名:</strong> {userInfo.username}</p>
            <pre>{JSON.stringify(userInfo, null, 2)}</pre>
            <button onClick={() => router.push('/')}>返回首页</button>
          </div>
        )}
      </main>
    </div>
  );
} 