import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Meeting Calendar",
	description: "Recurring meeting schedule viewer and editor",
	icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="flex min-h-full flex-col">
				{children}
				<Script
					src="https://static.cloudflareinsights.com/beacon.min.js"
					data-cf-beacon='{"token": "1bdabdc5de7445059b243e942f6e5ef2"}'
					strategy="afterInteractive"
				/>
			</body>
		</html>
	);
}
