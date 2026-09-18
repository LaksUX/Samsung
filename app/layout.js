import "./globals.css";

export const metadata = {
  title: "Sales Board · Samsung · Karnataka",
  description: "Daily sales dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body text-ink bg-bg">{children}</body>
    </html>
  );
}
