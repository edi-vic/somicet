import CryptoJS from 'crypto-js'

const secret = import.meta.env.PUBLIC_CRYPTO_SECRET

const encrypt = (data) => CryptoJS.AES.encrypt(data, secret).toString()

const decrypt = (data) => {
  const bytes = CryptoJS.AES.decrypt(data, secret)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export const encoding = {
  encode (value) {
    let stringValue = JSON.stringify(value)
    return encrypt(stringValue)
  },
  decode (value) {
    try {
      let decryptedValue = decrypt(value)
      return JSON.parse(decryptedValue)
    } catch (err) {
      console.error(err)
      return value
    }
  }
}