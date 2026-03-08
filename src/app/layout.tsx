import "./globals.css";
import { Providers } from "./providers";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
    title: "Ocean Aquarium Chic",
    description: "Your one-stop shop for elegant aquariums and aquatic life accessories.",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta name="apple-mobile-web-app-capable" content="yes" />
            </head>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
