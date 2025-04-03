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
        <title>LinuxDo OAuth2 登录</title>
        <meta name="description" content="使用LinuxDo账号登录" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          欢迎使用 LinuxDo OAuth2 登录
        </h1>

        <div className={styles.loginButton}>
          <img src="/linuxdo.png" alt="LinuxDo Logo" height="30px" />
          <button onClick={loginWithLinuxDo}>
            使用LinuxDo账号登录
          </button>
        </div>
      </main>
    </div>
  );
} 