import type { NextConfig } from "next";

const getApiHostname = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;
  try {
    return new URL(apiUrl).hostname;
  } catch {
    return null;
  }
};

const apiHostname = getApiHostname();

const nextConfig: NextConfig = {
  // Configuração para permitir acesso de outros IPs na rede
  // @ts-ignore
  allowedDevOrigins: ["localhost", "127.0.0.1", ...(apiHostname ? [apiHostname] : [])],

  // No Next.js 15, para silenciar o aviso de múltiplos lockfiles com Turbopack:
  // @ts-ignore
  transpilePackages: [], // Apenas para garantir que o objeto de config seja processado corretamente
};

export default nextConfig;
