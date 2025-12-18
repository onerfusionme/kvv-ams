'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
}

// Default context value for SSR
const defaultContextValue: ThemeContextType = {
    theme: 'dark',
    toggleTheme: () => { },
    setTheme: () => { },
}

const ThemeContext = createContext<ThemeContextType>(defaultContextValue)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('dark')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Check localStorage for saved preference
        const savedTheme = localStorage.getItem('theme') as Theme | null
        if (savedTheme) {
            setThemeState(savedTheme)
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setThemeState(prefersDark ? 'dark' : 'light')
        }
    }, [])

    useEffect(() => {
        if (mounted) {
            // Apply theme class to document
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add(theme)
            localStorage.setItem('theme', theme)
        }
    }, [theme, mounted])

    const toggleTheme = () => {
        setThemeState(prev => prev === 'dark' ? 'light' : 'dark')
    }

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
    }

    // Always provide context, even during SSR
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    // Always return context - defaults are provided by createContext
    return context
}

