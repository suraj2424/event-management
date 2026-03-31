'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: 'dark' | 'light'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ 
  children,
  enableTransitions = true 
}: { 
  children: React.ReactNode
  enableTransitions?: boolean
}) {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)
  const [actualTheme, setActualTheme] = useState<'dark' | 'light'>('light')

  const getActualTheme = useCallback((currentTheme: Theme): 'dark' | 'light' => {
    if (currentTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return currentTheme as 'dark' | 'light'
  }, [])

  // 1. Initial Mount & Load from LocalStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
    }
    setMounted(true)
  }, [])

  // 2. Apply theme to Document
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    
    const updateTheme = () => {
      const newActual = getActualTheme(theme)
      setActualTheme(newActual)

      // Manage transitions
      if (!enableTransitions) {
        root.classList.add('transition-none')
      }

      root.classList.remove('light', 'dark')
      root.classList.add(newActual)
      
      // Force color-scheme for system UI elements (scrollbars, etc)
      root.style.colorScheme = newActual

      if (!enableTransitions) {
        // Force reflow
        void window.getComputedStyle(root).opacity
        root.classList.remove('transition-none')
      }
    }

    updateTheme()

    // Listen for system changes if in system mode
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const listener = () => updateTheme()
      mediaQuery.addEventListener('change', listener)
      return () => mediaQuery.removeEventListener('change', listener)
    }
  }, [theme, mounted, enableTransitions, getActualTheme])

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  // To prevent FOUC without breaking Radix, we return null or a fragment 
  // only if your app structure allows. Otherwise, just return children.
  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, actualTheme }}>
      {/* Removed the visibility div wrapper to prevent layout/interaction bugs */}
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}