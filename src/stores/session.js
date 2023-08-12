import { persistentMap } from '@nanostores/persistent'
import { encrypt, decrypt } from '@helpers/crypto'

// export const session = persistentAtom('session', {
//   access_token: '',
//   refresh_token: '',
//   expires_at: 0,
// })

export const user = persistentMap('user', {
  id: '',
  email: '',
},
{
  encode (value) {
    let stringValue = JSON.stringify(value);
    return encrypt(stringValue);
  },
  decode (value ) {
    try {
      let decryptedValue = decrypt(value);
      return JSON.parse(decryptedValue);
    } catch(err) {
      console.error(err);
      return value
    }
  }
})