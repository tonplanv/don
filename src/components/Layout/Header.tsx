import React, { useState } from 'react'
import { Moon, Sun, Globe, LogOut, Settings, User, Shield } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { LogoutModal } from '../Modals/LogoutModal'

interface HeaderProps {
  isAdmin?: boolean
  onTogglePanel?: () => void
}

export const Header: React.FC<HeaderProps> = ({ isAdmin = false, onTogglePanel }) => {
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)

  const languages = [
    { code: 'pt' as const, name: 'Português', flag: '🇧🇷' },
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'es' as const, name: 'Español', flag: '🇪🇸' }
  ]

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
                {isAdmin ? (
                  <Shield className="w-6 h-6 text-white" />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {isAdmin ? t('admin.panel') : t('user.panel')}
                </h1>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Panel Toggle */}
              {onTogglePanel && (
                <button
                  onClick={onTogglePanel}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  title={isAdmin ? t('user.panel') : t('admin.panel')}
                >
                  <Settings className="w-5 h-5" />
                </button>
              )}

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  title="Language"
                >
                  <Globe className="w-5 h-5" />
                </button>
                
                {showLanguageMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code)
                          setShowLanguageMenu(false)
                        }}
                        className={`w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                          language === lang.code ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>

              {/* Logout Button */}
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                title={t('logout')}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">{t('logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Language Menu Overlay */}
      {showLanguageMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowLanguageMenu(false)}
        />
      )}

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false)
          // Add logout logic here
          console.log('User logged out')
        }}
      />
    </>
  )
}