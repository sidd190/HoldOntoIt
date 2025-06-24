import React from 'react'
import Dashboard from './pages/Dashboard'
import {AuthProvider,AuthStatus} from 'dimsee/frontend'

function App() {
  return (
    <AuthProvider>
      <AuthStatus formDesign="colorful">
        <Dashboard/>
      </AuthStatus>
    </AuthProvider>
  )
}

export default App