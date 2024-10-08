import React, { useState, useRef, useEffect } from 'react'
import { ArrowRight, Trash2, Copy, Loader2, Sun, Moon } from 'lucide-react'
import { Toaster, toast } from 'react-hot-toast'
import { useSpring, animated } from 'react-spring'
import { useTheme } from './ThemeContext'

function App() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const outputRef = useRef<HTMLPreElement>(null)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [input])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.style.height = 'auto'
      outputRef.current.style.height = outputRef.current.scrollHeight + 'px'
    }
  }, [output])

  const fadeIn = useSpring({
    opacity: isInitialLoading ? 0 : 1,
    transform: isInitialLoading ? 'translateY(20px)' : 'translateY(0)',
    config: { duration: 500 },
  })

  const processLinks = () => {
    setIsLoading(true)
    setTimeout(() => {
      const links = input.split(',').map(link => link.trim())
      const formattedLinks = links.map(link => `#lora\n${link}`).join('\n')
      setOutput(formattedLinks)
      setIsLoading(false)
    }, 1000)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output).then(() => {
      toast.success('Copiado al portapapeles', {
        duration: 2000,
        position: 'bottom-center',
        style: {
          background: theme === 'dark' ? '#333' : '#fff',
          color: theme === 'dark' ? '#fff' : '#333',
        },
      })
    }, (err) => {
      console.error('Error al copiar: ', err)
      toast.error('Error al copiar', {
        duration: 2000,
        position: 'bottom-center',
        style: {
          background: theme === 'dark' ? '#333' : '#fff',
          color: theme === 'dark' ? '#fff' : '#333',
        },
      })
    })
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-100'} transition-colors duration-300 overflow-hidden`}>
      {isInitialLoading ? (
        <div className="h-screen flex items-center justify-center">
          <Loader2 className={`animate-spin ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`} size={48} />
        </div>
      ) : (
        <animated.div style={fadeIn} className="h-screen flex flex-col items-center justify-center p-4 overflow-auto">
          <Toaster />
          <h1 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Links for BatchLinks</h1>
          <div className="w-full max-w-4xl flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/2">
              <textarea
                ref={textareaRef}
                className={`w-full p-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800'} border rounded mb-4 text-xs md:text-sm lg:text-base font-mono leading-relaxed resize-none overflow-hidden transition-colors duration-300`}
                placeholder="Ingrese los links de los modelos de LoRA separados por comas"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ minHeight: '150px' }}
              />
              <div className="flex space-x-2">
                <button
                  className={`flex-1 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} text-${theme === 'dark' ? 'white' : 'gray-800'} p-2 rounded flex items-center justify-center transition-colors duration-200 text-xs md:text-sm`}
                  onClick={processLinks}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin mr-2" size={16} />
                  ) : (
                    <ArrowRight className="mr-2" size={16} />
                  )}
                  {isLoading ? 'Procesando...' : 'Procesar'}
                </button>
                <button
                  className={`${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white p-2 rounded flex items-center justify-center transition-colors duration-200 text-xs md:text-sm`}
                  onClick={clearAll}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/2 relative group">
              <pre
                ref={outputRef}
                className={`w-full p-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800'} border rounded text-xs md:text-sm lg:text-base font-mono leading-relaxed whitespace-pre-wrap overflow-hidden transition-colors duration-300`}
                style={{ minHeight: '150px' }}
              >
                {output}
              </pre>
              <button
                className={`absolute top-2 right-2 p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} opacity-0 group-hover:opacity-100 transition-all duration-300`}
                onClick={copyToClipboard}
                disabled={!output}
                title="Copiar al portapapeles"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
          <button
            className={`fixed bottom-4 left-4 p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} transition-colors duration-300`}
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </animated.div>
      )}
    </div>
  )
}

export default App