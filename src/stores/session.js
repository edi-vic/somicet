import { persistentAtom, persistentMap } from '@nanostores/persistent'

export const user = persistentMap('_somicet_user_', {
  id: '',
  email: '',
})

export const session = persistentMap('_somicet_session_', {
  access_token: '',
  refresh_token: '',
})

export const expiration = persistentAtom('_somicet_expiration', 0)
