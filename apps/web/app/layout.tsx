import '../styles/main.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head>
        <title>Virtualform</title>

        <script
          src='https://kit.fontawesome.com/b4e298da1a.js'
          crossOrigin='anonymous'
          async
        />
      </head>

      <body>
        <div className='flex'>
          <main className='w-full'>{children}</main>
        </div>
      </body>
    </html>
  )
}
