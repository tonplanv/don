import React from 'react'
import { Header } from '../components/Layout/Header'
import { BannerSlider } from '../components/User/BannerSlider'
import { useLanguage } from '../contexts/LanguageContext'

interface UserPageProps {
  onTogglePanel: () => void
}

export const UserPage: React.FC<UserPageProps> = ({ onTogglePanel }) => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onTogglePanel={onTogglePanel} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('welcome')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Confira os destaques e novidades
          </p>
        </div>

        {/* Banner Slider */}
        <div className="mb-8">
          <BannerSlider />
        </div>

        {/* Additional Content Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Seção 1
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Conteúdo adicional será adicionado aqui conforme novas funcionalidades forem implementadas.
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Seção 2
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Espaço reservado para futuras funcionalidades do painel do usuário.
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Seção 3
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Área disponível para expansão do sistema conforme necessário.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}