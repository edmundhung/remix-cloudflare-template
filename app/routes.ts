import { get, route } from 'remix/fetch-router/routes'

export const routes = route({
  clientEntry: get('/client-entry'),
  home: '/',
  auth: '/auth',
})
