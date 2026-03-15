import "./globals.css"

export const metadata = {
  title: "NeoConnect | Staff Feedback Ecosystem",
  description: "Transparent, accountable, and secure staff feedback and complaint management platform.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}