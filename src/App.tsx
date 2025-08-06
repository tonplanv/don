import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { AdminPage } from './pages/AdminPage'
import { UserPage } from './pages/UserPage'

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false)

  const togglePanel = () => {
    setIsAdminMode(!isAdminMode)
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="App">
          {isAdminMode ? (
            <AdminPage onTogglePanel={togglePanel} />
          ) : (
            <UserPage onTogglePanel={togglePanel} />
          )}
          
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
              },
            }}
          />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App