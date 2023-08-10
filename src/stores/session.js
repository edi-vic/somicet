import { persistentMap } from '@nanostores/persistent'

// export const session = persistentAtom('session', {
//   access_token: '',
//   refresh_token: '',
//   expires_at: 0,
// })

export const user = persistentMap('user', {
  id: '',
  email: '',
})