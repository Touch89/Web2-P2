import { useState } from 'react'
import { LoginPage, UserInfoPage, RegisterPage } from './Front/incio'

function App() {
  //maneja un estado view con register en defecto, de ahí pasa a login y de ahí a info por cookie
  const [view, setView] = useState<'register' | 'login' | 'userInfo'>('register')
  if (view === 'userInfo') {
    return <UserInfoPage />
  }

  if (view === 'login') {
    return (
      <LoginPage
        onLogin={() => setView('userInfo')}
        onGoToRegister={() => setView('register')}
      />
    )
  }

  return <RegisterPage onGoToLogin={() => setView('login')} />
}

export default App