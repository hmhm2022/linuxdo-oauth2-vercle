import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const loginWithLinuxDo = () => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_LINUXDO_CLIENT_ID;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_LINUXDO_REDIRECT_URI || 
                         `${window.location.origin}/callback`;
    const AUTHORIZATION_ENDPOINT = "https://connect.linux.do/oauth2/authorize";
    
    const state = generateRandomString(16);
    localStorage.setItem("oauth_state", state);
    
    const authUrl = `${AUTHORIZATION_ENDPOINT}?response_type=code&client_id=${encodeURIComponent(
      CLIENT_ID
    )}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&state=${state}`;
    
    window.location.href = authUrl;
  };

  // 生成随机字符串
  const generateRandomString = (length) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Linux.do OAuth2 认证</title>
        <meta name="description" content="使用LinuxDo账号登录" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          欢迎使用
        </h1>
        <h2 className={styles.subtitle}>
          本系统接入Linux.do OAuth2.0认证
        </h2>

        <p className={styles.description}>
          安全、便捷的认证方式，一键登录获取更多服务
        </p>

        <div className={styles.loginButton}>
          <button onClick={loginWithLinuxDo}>
            <img src="https://double.fkgpt.fun/?name=LDO&size=32" alt="LinuxDo Logo" className={styles.buttonIcon} />
            授权登录
          </button>
        </div>
        
        <div className={styles.footer}>
          <p>
            通过授权登录，即表示您同意我们的
            <a href="https://linux.do/terms" target="_blank" rel="noopener noreferrer">服务条款</a>
            和
            <a href="https://linux.do/privacy" target="_blank" rel="noopener noreferrer">隐私政策</a>
          </p>
        </div>
      </main>
    </div>
  );
} 