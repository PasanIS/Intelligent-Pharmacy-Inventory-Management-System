import React, { useEffect } from 'react';

interface TokenResponse {
  hexToken: string;
  base64Token: string;
}

const TokenFetcher: React.FC = () => {
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/token');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: TokenResponse = await response.json();
        localStorage.setItem('secureHexToken', data.hexToken);
        localStorage.setItem('secureBase64Token', data.base64Token);
        console.log('Tokens stored in localStorage');
      } catch (error) {
        console.error('Failed to fetch token:', error);
      }
    };

    fetchToken();
  }, []);

  return <div>Secure token fetched and stored.</div>;
};

export default TokenFetcher;