import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { verifyDownloadToken } from '@/lib/downloads'
import { getProduct } from '@/lib/products'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function errorPage(message: string, status: number) {
  return new NextResponse(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Download link problem | Leaf Coaching</title>
    <style>
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #F6F1E7; color: #2B2622; font-family: Georgia, serif; padding: 2rem; }
      main { max-width: 34rem; border: 1px solid rgba(43,38,34,.12); border-radius: 1.5rem; background: rgba(255,255,255,.7); padding: 2.5rem; }
      h1 { margin: 0 0 1rem; font-size: 1.9rem; }
      p { line-height: 1.7; color: #5C554D; }
      a { color: #1F3D2B; }
    </style>
  </head>
  <body>
    <main>
      <h1>We could not open that download</h1>
      <p>${message}</p>
      <p>Email <a href="mailto:hello@leafcoaching.com?subject=Workbook%20download">hello@leafcoaching.com</a> with your PayPal receipt and we will send your workbook straight away.</p>
    </main>
  </body>
</html>`,
    {
      status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    }
  )
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token') ?? ''
  const payload = verifyDownloadToken(token)

  if (!payload) {
    return errorPage(
      'This link is invalid or has expired. Download links stay live for seven days after payment.',
      403
    )
  }

  const product = getProduct(payload.productId)
  if (!product?.download) {
    return errorPage(
      'This product is not available as a download. Please email us and we will help.',
      404
    )
  }

  try {
    const file = await readFile(
      path.join(process.cwd(), product.download.file)
    )

    return new NextResponse(new Uint8Array(file), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${product.download.filename}"`,
        'Content-Length': String(file.byteLength),
        'Cache-Control': 'private, no-store, max-age=0',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    })
  } catch (error) {
    console.error('[downloads] file read failed', {
      productId: payload.productId,
      error,
    })
    return errorPage(
      'The file is temporarily unavailable. Please try again in a moment, or email us and we will send it to you.',
      404
    )
  }
}
