import { Outlet } from 'react-router-dom'

import { Header } from '../components/Header'

export function DefaultLayout() {
  return (
    // outlet = aonde vai o conteúdo
    <div>
      <Header />
      <Outlet />
    </div>
  )
}
