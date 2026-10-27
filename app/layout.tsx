import type { Metadata } from 'next';
import './styles.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://projex-tech.vercel.app'),
  title: { default: 'Projex Tech | Tecnología comercial para crecer', template: '%s | Projex Tech' },
  description: 'Automatización, CRM, dashboards e integraciones para empresas que quieren vender y operar mejor.',
  alternates: { languages: { es: '/', pt: '/?lang=pt' } },
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body>{children}</body></html>; }
