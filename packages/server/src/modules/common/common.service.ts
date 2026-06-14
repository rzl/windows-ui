import fs from 'fs'
import path from 'path'

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads')

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

export function getUploadDir() {
  return UPLOAD_DIR
}

export function getUploadUrl(filename: string) {
  return `/uploads/${filename}`
}
