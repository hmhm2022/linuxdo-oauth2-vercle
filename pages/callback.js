import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Callback() {
  const router = useRouter();
  const [status, setStatus] = useState('处理中...');
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    const { code, state } = router.query;
    const savedState = typeof window !== 'undefined' ? localStorage.getItem('oauth_state') : null;

    if (!code) {
      setError('未收到授权码，授权失败');
      setLoading(false);
      return;
    }

    if (state !== savedState) {
      setError('状态验证失败，可能存在CSRF攻击风险');
      setLoading(false);
      return;
    }

    // 清除状态
    localStorage.removeItem('oauth_state');

    // 获取token
    setStatus('正在获取授权令牌...');
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
        
        setStatus('正在获取用户信息...');
        
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
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || '授权过程中发生错误');
        setLoading(false);
      });
  }, [router.isReady, router.query]);

  const getTrustLevelText = (level) => {
    const levels = {
      0: '新用户',
      1: '基础用户',
      2: '普通用户',
      3: '高级用户',
      4: '资深用户'
    };
    return levels[level] || `等级 ${level}`;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Linux.do OAuth2 认证 - {error ? '授权失败' : status}</title>
        <meta name="description" content="LinuxDo OAuth2 回调处理" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <h2 className={styles.statusText}>{status}</h2>
          </div>
        ) : (
          <>
            <h1 className={styles.title}>
              {error ? '授权失败' : '授权成功'}
            </h1>

            {error && (
              <div className={styles.error}>
                <p>{error}</p>
                <button onClick={() => router.push('/')} className={styles.backButton}>返回登录</button>
              </div>
            )}

            {userInfo && (
              <div className={styles.userInfoCard}>
                <div className={styles.userHeader}>
                  <div className={styles.avatarContainer}>
                    {userInfo.avatar_url ? (
                      <img src={userInfo.avatar_url} alt={userInfo.username} className={styles.avatar} />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {userInfo.username ? userInfo.username.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                  <div className={styles.userBasicInfo}>
                    <h2 className={styles.username}>{userInfo.username}</h2>
                    <div className={styles.userId}>ID: {userInfo.id}</div>
                    <div className={styles.trustLevel}>
                      <span className={styles.trustBadge}>
                        信任等级: {userInfo.trust_level}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.userDetails}>
                  <h3>用户详细信息</h3>
                  
                  {/* 邮箱和登录名行 */}
                  <div className={styles.userInfoRow}>
                    {userInfo.email && (
                      <div className={styles.userInfoField}>
                        <span className={styles.infoLabel}>邮箱:</span>
                        <span className={styles.infoValue}>{userInfo.email}</span>
                      </div>
                    )}
                    {userInfo.login && (
                      <div className={styles.userInfoField}>
                        <span className={styles.infoLabel}>登录名:</span>
                        <span className={styles.infoValue}>{userInfo.login}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* 其他用户信息 */}
                  <div className={styles.userDetailGrid}>
                    {userInfo.name && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>姓名:</span>
                        <span className={styles.detailValue}>{userInfo.name}</span>
                      </div>
                    )}
                    {userInfo.external_ids && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>外部ID:</span>
                        <span className={styles.detailValue}>{JSON.stringify(userInfo.external_ids)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={styles.buttonContainer}>
                  <button onClick={() => router.push('/')} className={styles.backButton}>返回首页</button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
} 