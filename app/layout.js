import "./globals.css";

export const metadata = {
  title: "Oost-Marokko Vastgoed — Saidia, Berkane, Oujda",
  description: "Vastgoedaanbod in Saidia, Berkane en Oujda voor investeerders en terugkeerders.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
