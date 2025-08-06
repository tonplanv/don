import React, { useState } from 'react'
import { Header } from '../components/Layout/Header'
import { BannerList } from '../components/Admin/BannerList'
import { BannerForm } from '../components/Admin/BannerForm'
import { useLanguage } from '../contexts/LanguageContext'
import { Banner } from '../lib/supabase'

interface AdminPageProps {
  onTogglePanel: () => void
}

export const AdminPage: React.FC<AdminPageProps> = ({ onTogglePanel }) => {
  const { t } = useLanguage()
  const [showForm, setShowForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | undefined>()
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAddBanner = () => {
    setEditingBanner(undefined)
    setShowForm(true)
  }

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner)
    setShowForm(true)
  }

  const handleSaveBanner = () => {
    setShowForm(false)
    setEditingBanner(undefined)
    setRefreshKey(prev => prev + 1)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingBanner(undefined)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header isAdmin onTogglePanel={onTogglePanel} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('admin.panel')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gerencie o conteúdo que será exibido para os usuários
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button className="border-b-2 border-primary-600 text-primary-600 dark:text-primary-400 pb-2 px-1 text-sm font-medium">
              {t('banners')}
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {showForm ? (
            <BannerForm
              banner={editingBanner}
              onSave={handleSaveBanner}
              onCancel={handleCancelForm}
            />
          ) : (
            <BannerList
              onEdit={handleEditBanner}
              onAdd={handleAddBanner}
              refresh={refreshKey}
            />
          )}
        </div>
      </main>
    </div>
  )
}