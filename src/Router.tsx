import { Route, Routes } from 'react-router'
import { DefaultLayout } from './layouts/DefaultLayout'
import { Home } from './pages/Home/Index'


export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Route>
    </Routes>
  )
}
