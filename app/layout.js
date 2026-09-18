import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/sw-register";

export const metadata = {
  title: "Sales Board · Samsung · Karnataka",
  description: "Samsung Karnataka distribution dashboard — Day, Model, Category, Cluster and ASM views.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sales Board",
  },
};

export const viewport = {
  themeColor: "#0b0e1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body text-ink bg-bg">
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
