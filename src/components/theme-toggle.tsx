'use client'

import * as React from 'react'
import { Moon, Sun, Monitor, Check } from 'lucide-react'
import { useTheme } from '@/providers/contexts/theme-context'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-9 h-9" />

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Using your Organic Button physics (lift + scale) */}
        <Button 
          variant="outline" 
          size="icon" 
          className="relative rounded-full border-[hsl(var(--primary)/0.2)] bg-[hsl(var(--card))] shadow-sm"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] dark:-rotate-90 dark:scale-0 text-[hsl(var(--primary))]" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] dark:rotate-0 dark:scale-100 text-[hsl(var(--primary))]" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className="gap-3 py-2.5"
        >
          <Sun className="h-4 w-4 opacity-70" />
          <span className="font-medium">Light</span>
          {theme === 'light' && (
            <Check className="ml-auto h-4 w-4 text-[hsl(var(--primary))]" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className="gap-3 py-2.5"
        >
          <Moon className="h-4 w-4 opacity-70" />
          <span className="font-medium">Dark</span>
          {theme === 'dark' && (
            <Check className="ml-auto h-4 w-4 text-[hsl(var(--primary))]" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className="gap-3 py-2.5"
        >
          <Monitor className="h-4 w-4 opacity-70" />
          <span className="font-medium">System</span>
          {theme === 'system' && (
            <Check className="ml-auto h-4 w-4 text-[hsl(var(--primary))]" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}