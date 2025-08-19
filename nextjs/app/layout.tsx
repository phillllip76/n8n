import './globals.css';
export const metadata = {
  title: 'n8n NodeView Next.js',
  description: 'Incremental port of NodeView components',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
