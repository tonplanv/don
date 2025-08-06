import React, { useState } from 'react'
import { Upload, Link, Image, Video, Save, X } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import toast from 'react-hot-toast'
import { supabase, Banner } from '../../lib/supabase'

interface BannerFormProps {
  banner?: Banner
  onSave: () => void
  onCancel: () => void
}

export const BannerForm: React.FC<BannerFormProps> = ({ banner, onSave, onCancel }) => {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: banner?.title || '',
    description: banner?.description || '',
    mediaType: banner?.media_type || 'image' as 'image' | 'video',
    videoOption: banner?.video_url ? 'link' : 'upload' as 'upload' | 'link',
    videoUrl: banner?.video_url || '',
    isActive: banner?.is_active ?? true
  })
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string>(banner?.media_url || '')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMediaFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `banners/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage
      .from('media')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let mediaUrl = banner?.media_url || ''

      // Upload new file if selected
      if (mediaFile) {
        mediaUrl = await uploadFile(mediaFile)
      }

      // Prepare banner data
      const bannerData = {
        title: formData.title || null,
        description: formData.description || null,
        media_url: mediaUrl,
        media_type: formData.mediaType,
        video_url: formData.mediaType === 'video' && formData.videoOption === 'link' ? formData.videoUrl : null,
        is_active: formData.isActive,
        order_index: banner?.order_index || 0,
        updated_at: new Date().toISOString()
      }

      if (banner) {
        // Update existing banner
        const { error } = await supabase
          .from('banners')
          .update(bannerData)
          .eq('id', banner.id)

        if (error) throw error
      } else {
        // Create new banner
        const { error } = await supabase
          .from('banners')
          .insert([bannerData])

        if (error) throw error
      }

      toast.success(t('banner.saved'))
      onSave()
    } catch (error) {
      console.error('Error saving banner:', error)
      toast.error(t('error.occurred'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {banner ? t('edit') : t('add.banner')}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('title.optional')}
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input"
            placeholder={t('title.optional')}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('description.optional')}
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="textarea"
            placeholder={t('description.optional')}
          />
        </div>

        {/* Media Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t('media.type')}
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="image"
                checked={formData.mediaType === 'image'}
                onChange={(e) => setFormData({ ...formData, mediaType: e.target.value as 'image' | 'video' })}
                className="mr-2"
              />
              <Image className="w-4 h-4 mr-2" />
              {t('image')}
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="video"
                checked={formData.mediaType === 'video'}
                onChange={(e) => setFormData({ ...formData, mediaType: e.target.value as 'image' | 'video' })}
                className="mr-2"
              />
              <Video className="w-4 h-4 mr-2" />
              {t('video')}
            </label>
          </div>
        </div>

        {/* Image Upload */}
        {formData.mediaType === 'image' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('upload.image')}
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              {t('recommended.size')}
            </p>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Clique para fazer upload da imagem
                </span>
              </label>
              {mediaPreview && (
                <div className="mt-4">
                  <img
                    src={mediaPreview}
                    alt="Preview"
                    className="max-w-full h-32 object-cover rounded-lg mx-auto"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Video Options */}
        {formData.mediaType === 'video' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('video.option')}
            </label>
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="upload"
                  checked={formData.videoOption === 'upload'}
                  onChange={(e) => setFormData({ ...formData, videoOption: e.target.value as 'upload' | 'link' })}
                  className="mr-2"
                />
                <Upload className="w-4 h-4 mr-2" />
                {t('upload.video')}
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="link"
                  checked={formData.videoOption === 'link'}
                  onChange={(e) => setFormData({ ...formData, videoOption: e.target.value as 'upload' | 'link' })}
                  className="mr-2"
                />
                <Link className="w-4 h-4 mr-2" />
                {t('video.link')}
              </label>
            </div>

            {formData.videoOption === 'upload' ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Clique para fazer upload do vídeo
                  </span>
                </label>
                {mediaPreview && (
                  <div className="mt-4">
                    <video
                      src={mediaPreview}
                      controls
                      className="max-w-full h-32 rounded-lg mx-auto"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="input"
                  placeholder={t('video.url.placeholder')}
                />
              </div>
            )}
          </div>
        )}

        {/* Active Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is-active"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="mr-3"
          />
          <label htmlFor="is-active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('active')}
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
            disabled={loading}
          >
            {loading ? (
              <div className="loading-spinner" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{t('save.banner')}</span>
          </button>
        </div>
      </form>
    </div>
  )
}