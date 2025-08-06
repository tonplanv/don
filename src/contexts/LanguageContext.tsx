import React, { createContext, useContext, useState } from 'react'

type Language = 'pt' | 'en' | 'es'

interface Translations {
  [key: string]: {
    [key in Language]: string
  }
}

const translations: Translations = {
  // Header
  'admin.panel': { pt: 'Painel Admin', en: 'Admin Panel', es: 'Panel Admin' },
  'user.panel': { pt: 'Painel Usuário', en: 'User Panel', es: 'Panel Usuario' },
  'logout': { pt: 'Sair', en: 'Logout', es: 'Salir' },
  
  // Logout Modal
  'logout.confirm': { pt: 'Tem certeza que deseja sair?', en: 'Are you sure you want to logout?', es: '¿Estás seguro de que quieres salir?' },
  'logout.message': { pt: 'Você será desconectado do sistema.', en: 'You will be disconnected from the system.', es: 'Serás desconectado del sistema.' },
  'cancel': { pt: 'Cancelar', en: 'Cancel', es: 'Cancelar' },
  'confirm': { pt: 'Confirmar', en: 'Confirm', es: 'Confirmar' },
  
  // Admin Panel
  'banners': { pt: 'Banners', en: 'Banners', es: 'Banners' },
  'add.banner': { pt: 'Adicionar Banner', en: 'Add Banner', es: 'Agregar Banner' },
  'title.optional': { pt: 'Título (opcional)', en: 'Title (optional)', es: 'Título (opcional)' },
  'description.optional': { pt: 'Descrição (opcional)', en: 'Description (optional)', es: 'Descripción (opcional)' },
  'media.type': { pt: 'Tipo de Mídia', en: 'Media Type', es: 'Tipo de Medio' },
  'image': { pt: 'Imagem', en: 'Image', es: 'Imagen' },
  'video': { pt: 'Vídeo', en: 'Video', es: 'Video' },
  'upload.image': { pt: 'Upload de Imagem', en: 'Upload Image', es: 'Subir Imagen' },
  'recommended.size': { pt: 'Tamanho recomendado: 1920x1080px', en: 'Recommended size: 1920x1080px', es: 'Tamaño recomendado: 1920x1080px' },
  'video.option': { pt: 'Opção de Vídeo', en: 'Video Option', es: 'Opción de Video' },
  'upload.video': { pt: 'Upload de Vídeo', en: 'Upload Video', es: 'Subir Video' },
  'video.link': { pt: 'Link do Vídeo', en: 'Video Link', es: 'Enlace de Video' },
  'video.url.placeholder': { pt: 'Cole o link do YouTube, Vimeo, etc.', en: 'Paste YouTube, Vimeo, etc. link', es: 'Pega el enlace de YouTube, Vimeo, etc.' },
  'save.banner': { pt: 'Salvar Banner', en: 'Save Banner', es: 'Guardar Banner' },
  'active': { pt: 'Ativo', en: 'Active', es: 'Activo' },
  'inactive': { pt: 'Inativo', en: 'Inactive', es: 'Inactivo' },
  'edit': { pt: 'Editar', en: 'Edit', es: 'Editar' },
  'delete': { pt: 'Excluir', en: 'Delete', es: 'Eliminar' },
  
  // User Panel
  'welcome': { pt: 'Bem-vindo', en: 'Welcome', es: 'Bienvenido' },
  'no.banners': { pt: 'Nenhum banner disponível', en: 'No banners available', es: 'No hay banners disponibles' },
  
  // Messages
  'banner.saved': { pt: 'Banner salvo com sucesso!', en: 'Banner saved successfully!', es: '¡Banner guardado exitosamente!' },
  'banner.deleted': { pt: 'Banner excluído com sucesso!', en: 'Banner deleted successfully!', es: '¡Banner eliminado exitosamente!' },
  'error.occurred': { pt: 'Ocorreu um erro', en: 'An error occurred', es: 'Ocurrió un error' },
  'loading': { pt: 'Carregando...', en: 'Loading...', es: 'Cargando...' }
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: React.ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language')
    return (saved as Language) || 'pt'
  })

  const t = (key: string): string => {
    const translation = translations[key]
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }
    return translation[language] || translation.pt || key
  }

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}