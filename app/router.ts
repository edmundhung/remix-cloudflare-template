import { createRouter } from 'remix/fetch-router'

import { clientEntry } from './assets/client-entry.ts'
import { auth } from './controllers/auth.tsx'
import { home } from './controllers/home.tsx'
import { routes } from './routes.ts'

export const router = createRouter()

router.get(routes.clientEntry, clientEntry)

router.map(routes.home, home)
router.map(routes.auth, auth)
