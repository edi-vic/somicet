import CryptoJS from 'crypto-js'

const secret = import.meta.env.PUBLIC_CRYPTO_SECRET

export function encrypt(data) {
  return CryptoJS.AES.encrypt(data, secret).toString()
}

export function decrypt(data) {
  const bytes = CryptoJS.AES.decrypt(data, secret)
  return bytes.toString(CryptoJS.enc.Utf8)
}

