import { Outlet } from 'react-router-dom'
import { Header } from '../../components/Header/Index'

// Styles
import { LayoutContainer } from './styles'

export function DefaultLayout() {
  return (
    // outlet = aonde vai o conteúdo
    <LayoutContainer>
      <Header />
      <Outlet />
    </LayoutContainer>
  )
}
