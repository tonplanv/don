import React, { useState, useEffect } from 'react'
import { Edit, Trash2, Eye, EyeOff, Plus } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { supabase, Banner } from '../../lib/supabase'
import toast from 'react-hot-toast'

interface BannerListProps {
  onEdit: (banner: Banner) => void
  onAdd: () => void
  refresh: number
}

export const BannerList: React.FC<BannerListProps> = ({ onEdit, onAdd, refresh }) => {
  const { t } = useLanguage()
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error
      setBanners(data || [])
    } catch (error) {
      console.error('Error fetching banners:', error)
      toast.error(t('error.occurred'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [refresh])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este banner?')) return

    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success(t('banner.deleted'))
      fetchBanners()
    } catch (error) {
      console.error('Error deleting banner:', error)
      toast.error(t('error.occurred'))
    }
  }

  const toggleActive = async (banner: Banner) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({ is_active: !banner.is_active })
        .eq('id', banner.id)

      if (error) throw error

      fetchBanners()
    } catch (error) {
      console.error('Error updating banner:', error)
      toast.error(t('error.occurred'))
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="loading-spinner" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">{t('loading')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {t('banners')}
        </h2>
        <button
          onClick={onAdd}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>{t('add.banner')}</span>
        </button>
      </div>

      {banners.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {t('no.banners')}
          </p>
          <button
            onClick={onAdd}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t('add.banner')}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
            >
              {/* Media Preview */}
              <div className="flex-shrink-0 w-20 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                {banner.media_type === 'image' ? (
                  <img
                    src={banner.media_url}
                    alt={banner.title || 'Banner'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <video
                      src={banner.video_url || banner.media_url}
                      className="w-full h-full object-cover"
                      muted
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {banner.title || 'Sem título'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {banner.description || 'Sem descrição'}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    banner.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {banner.is_active ? t('active') : t('inactive')}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {banner.media_type === 'image' ? t('image') : t('video')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleActive(banner)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  title={banner.is_active ? 'Desativar' : 'Ativar'}
                >
                  {banner.is_active ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => onEdit(banner)}
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  title={t('edit')}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  title={t('delete')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}