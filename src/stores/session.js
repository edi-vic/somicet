import { persistentAtom, persistentMap } from '@nanostores/persistent'

export const session = persistentMap('_somicet_session_', {
  user_id: '',
  user_email: '',
})

