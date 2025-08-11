import './App.css'
import { router } from './Router'
import { useRoutes } from 'react-router-dom'

function App() {
  const routerElement = useRoutes(router);

  return (
    <>
    {routerElement}
    </>
  )
}

export default App
