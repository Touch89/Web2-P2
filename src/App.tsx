import { useState } from 'react'
import { LoginPage, UserInfoPage } from './Front/incio'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [token, setToken] = useState('')

  if (loggedIn) {
    return <UserInfoPage token={token} />
  }

  return (
    <LoginPage
      onLogin={(t = '') => {
        setToken(t)
        setLoggedIn(true)
      }}
    />
  )
}

export default App