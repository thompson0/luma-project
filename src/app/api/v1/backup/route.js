import { NextResponse } from "next/server"
import crypto from "crypto"

function md5(str) {
  return crypto.createHash("md5").update(str).digest("hex")
}

async function digestFetch(url, publicKey, privateKey) {
  const initialRes = await fetch(url, { method: "GET" })

  if (initialRes.status !== 401) {
    return initialRes
  }

  const wwwAuth = initialRes.headers.get("www-authenticate")
  if (!wwwAuth) throw new Error("Sem header WWW-Authenticate na resposta 401")

  const realm = wwwAuth.match(/realm="([^"]+)"/)?.[1]
  const nonce = wwwAuth.match(/nonce="([^"]+)"/)?.[1]
  const qop = wwwAuth.match(/qop="([^"]+)"/)?.[1]

  if (!realm || !nonce) throw new Error("Challenge digest inválido")

  const nc = "00000001"
  const cnonce = crypto.randomBytes(16).toString("hex")
  const uri = new URL(url).pathname + new URL(url).search

  const ha1 = md5(`${publicKey}:${realm}:${privateKey}`)
  const ha2 = md5(`GET:${uri}`)

  const response = qop
    ? md5(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`)
    : md5(`${ha1}:${nonce}:${ha2}`)

  const authHeader = [
    `Digest username="${publicKey}"`,
    `realm="${realm}"`,
    `nonce="${nonce}"`,
    `uri="${uri}"`,
    `qop=${qop}`,
    `nc=${nc}`,
    `cnonce="${cnonce}"`,
    `response="${response}"`,
  ].join(", ")

  // 2º request: autenticado
  return fetch(url, {
    headers: {
      Authorization: authHeader,
      Accept: "application/vnd.atlas.2023-01-01+json",
    },
  })
}

export async function GET() {
  try {
    const projectId = process.env.ATLAS_PROJECT_ID
    const clusterName = process.env.ATLAS_CLUSTER_NAME
    const publicKey = process.env.ATLAS_PUBLIC_KEY
    const privateKey = process.env.ATLAS_PRIVATE_KEY

    if (!projectId || !clusterName || !publicKey || !privateKey) {
      return NextResponse.json(
        { error: "Variáveis de ambiente do Atlas não configuradas" },
        { status: 500 }
      )
    }

    const url = `https://cloud.mongodb.com/api/atlas/v2/groups/${projectId}/clusters/${clusterName}/backup/snapshots?itemsPerPage=1`

    const res = await digestFetch(url, publicKey, privateKey)

    if (!res.ok) {
      const errorText = await res.text()
      return NextResponse.json(
        { error: `Atlas API erro: ${res.status}`, details: errorText },
        { status: res.status }
      )
    }

    const data = await res.json()
    const lastSnapshot = data.results?.[0]

    if (!lastSnapshot) {
      return NextResponse.json({
        lastBackup: null,
        status: "nenhum snapshot encontrado",
        type: null,
      })
    }

    return NextResponse.json({
      lastBackup: lastSnapshot.createdAt,
      status: lastSnapshot.status,
      type: lastSnapshot.type,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}