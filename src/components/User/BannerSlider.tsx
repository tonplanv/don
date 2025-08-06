import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { supabase, Banner } from '../../lib/supabase'

export const BannerSlider: React.FC = () => {
  const { t } = useLanguage()
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [loading, setLoading] = useState(true)

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (error) throw error
      setBanners(data || [])
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  useEffect(() => {
    if (!isPlaying || banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isPlaying, banners.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  if (loading) {
    return (
      <div className="relative w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="loading-spinner" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">{t('loading')}</span>
        </div>
      </div>
    )
  }

  if (banners.length === 0) {
    return (
      <div className="relative w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">{t('no.banners')}</p>
      </div>
    )
  }

  const currentBanner = banners[currentIndex]

  return (
    <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden group">
      {/* Media Content */}
      <div className="relative w-full h-full">
        {currentBanner.media_type === 'image' ? (
          <img
            src={currentBanner.media_url}
            alt={currentBanner.title || 'Banner'}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={currentBanner.video_url || currentBanner.media_url}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Content */}
        {(currentBanner.title || currentBanner.description) && (
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            {currentBanner.title && (
              <h2 className="text-2xl font-bold mb-2">{currentBanner.title}</h2>
            )}
            {currentBanner.description && (
              <p className="text-gray-200 text-sm">{currentBanner.description}</p>
            )}
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Play/Pause Button */}
      {banners.length > 1 && (
        <button
          onClick={togglePlayPause}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>
      )}

      {/* Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}