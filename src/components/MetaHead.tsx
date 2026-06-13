"use client";
import Head from 'next/head';
import { usePathname } from 'next/navigation';

export default function MetaHead() {
  const pathname = usePathname() || '/';
  const titleMap: Record<string, string> = {
    '/': 'Titicaca Report – Inicio',
    '/dashboard': 'Panel de Usuario',
    '/rewards': 'Recompensas',
    '/admin': 'Administración',
    '/report/new': 'Crear Reporte',
  };
  const title = titleMap[pathname] || 'Titicaca Report';
  const description =
    'Plataforma de reporte ciudadano para focos de contaminación en el Lago Titicaca. Gestiona tus puntos y canjea recompensas.';

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://titicaca-rewards.vercel.app${pathname}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#0284c7" />
      <link rel="apple-touch-icon" href="https://www.svgrepo.com/show/475656/google-color.svg" />
    </Head>
  );
}
