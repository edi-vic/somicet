import { persistentMap } from '@nanostores/persistent'
import { encoding } from '@helpers/crypto'

export const user = persistentMap('_somicet_user_', {
  id: '',
  email: '',
})

export const session = persistentAtom('_somicet_session_', {
  access_token: '',
  refresh_token: '',
}, encoding)

export const expiration = persistentAtom('_somicet_expiration_', 0)
