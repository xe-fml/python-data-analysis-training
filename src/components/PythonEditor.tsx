import React, { useState, useRef, useEffect } from 'react'
import { Play, RotateCcw, Terminal, Copy, Check, AlertCircle } from 'lucide-react'

interface PythonEditorProps {
  initialCode?: string
  expectedOutput?: string
  hint?: string
  onComplete?: (success: boolean) => void
}

// Global pyodide instance (shared across exercises)
let pyodideInstance: any = null
let pyodideLoadingPromise: Promise<any> | null = null

const defaultCode = `# 在这里编写你的 Python 代码
# 点击"运行"按钮执行代码

print("Hello, Python 数据分析!")
`

const PythonEditor: React.FC<PythonEditorProps> = ({
  initialCode = defaultCode,
  expectedOutput,
  hint,
  onComplete
}) => {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load Pyodide once
  useEffect(() => {
    if (pyodideInstance) return

    if (pyodideLoadingPromise) {
      pyodideLoadingPromise.then((py) => {
        setIsLoading(false)
      })
      return
    }

    setIsLoading(true)

    pyodideLoadingPromise = new Promise(async (resolve, reject) => {
      try {
        // @ts-ignore: loadPyodide from CDN
        const { loadPyodide } = window as any

        if (!loadPyodide) {
          // Load the Pyodide script from CDN
          const script = document.createElement('script')
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js'
          script.async = true
          script.onload = async () => {
            try {
              // @ts-ignore
              const pyodide = await (window as any).loadPyodide({
                indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
              })

              pyodideInstance = pyodide
              setIsLoading(false)
              resolve(pyodide)
            } catch (err) {
              setIsLoading(false)
              reject(err)
            }
          }
          script.onerror = () => {
            setIsLoading(false)
            setOutput('❌ 无法加载 Pyodide。请检查网络连接。')
            reject(new Error('Failed to load Pyodide'))
          }
          document.head.appendChild(script)
        } else {
          const pyodide = await loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
          })
          pyodideInstance = pyodide
          setIsLoading(false)
          resolve(pyodide)
        }
      } catch (error) {
        setIsLoading(false)
        reject(error)
      }
    })
  }, [])

  const runCode = async () => {
    if (isRunning || isLoading) return

    setIsRunning(true)
    setOutput('⏳ 正在执行代码...\n')

    try {
      if (!pyodideInstance) {
        // Wait for pyodide to load
        setOutput('⏳ 正在加载 Python 运行环境...\n')
        pyodideInstance = await pyodideLoadingPromise
      }

      // Capture print output by redirecting stdout
      pyodideInstance.runPython(`
        import sys
        import io
        sys.stdout = io.StringIO()
        sys.stderr = io.StringIO()
      `)

      try {
        await pyodideInstance.runPythonAsync(code)
      } catch (e: any) {
        // Capture the error
        pyodideInstance.runPython(`
          import sys
          import traceback
          print(traceback.format_exc(), file=sys.stdout)
        `)
      }

      // Get captured output
      const stdout = pyodideInstance.runPython('sys.stdout.getvalue()')
      const stderr = pyodideInstance.runPython('sys.stderr.getvalue()')

      let result = ''
      if (stdout && stdout.trim()) {
        result += stdout
      }
      if (stderr && stderr.trim()) {
        result += (result ? '\n' : '') + '[错误输出]\n' + stderr
      }

      if (!result.trim()) {
        result = '(代码运行完成，但没有输出内容)'
      }

      setOutput(result)

      // Check if output matches expected output
      if (expectedOutput && expectedOutput.trim() && result.includes(expectedOutput.trim())) {
        setOutput(result + '\n\n✅ 恭喜！你的输出与预期相符。')
        if (onComplete) onComplete(true)
      }

    } catch (error: any) {
      setOutput('❌ 执行错误:\n' + (error?.message || String(error)))
    } finally {
      setIsRunning(false)
    }
  }

  const resetCode = () => {
    setCode(initialCode)
    setOutput('')
  }

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  const insertTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = textareaRef.current!.selectionStart
      const end = textareaRef.current!.selectionEnd
      const newValue = code.substring(0, start) + '    ' + code.substring(end)
      setCode(newValue)
      setTimeout(() => {
        textareaRef.current!.selectionStart = textareaRef.current!.selectionEnd = start + 4
      }, 0)
    }
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-700 bg-gray-900 shadow-lg">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
          </div>
          <span className="text-gray-300 text-sm font-medium ml-2">Python 3.11</span>
          {isLoading && (
            <span className="text-yellow-400 text-xs ml-2 animate-pulse">
              ⏳ 正在加载 Python 运行环境...
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hint && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-3 py-1 text-xs font-medium bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors"
            >
              {showHint ? '隐藏提示' : '💡 提示'}
            </button>
          )}
          <button
            onClick={resetCode}
            className="px-3 py-1 text-xs font-medium bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            重置
          </button>
          <button
            onClick={runCode}
            disabled={isRunning || isLoading}
            className="px-4 py-1.5 text-xs font-semibold bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3 h-3" />
            {isRunning ? '运行中...' : '▶ 运行'}
          </button>
        </div>
      </div>

      {/* Hint */}
      {showHint && hint && (
        <div className="bg-yellow-900/30 border-b border-yellow-800 px-4 py-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-200 whitespace-pre-wrap">{hint}</p>
          </div>
        </div>
      )}

      {/* Code Editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={insertTab}
          spellCheck={false}
          className="w-full h-64 p-4 bg-gray-900 text-green-400 font-mono text-sm leading-relaxed resize-none outline-none focus:ring-2 focus:ring-inset focus:ring-green-500/30"
          placeholder="# 在这里编写 Python 代码..."
        />
      </div>

      {/* Output Panel */}
      <div className="border-t border-gray-700">
        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-300 text-xs">
            <Terminal className="w-3.5 h-3.5" />
            <span className="font-medium">输出</span>
            {expectedOutput && (
              <span className="text-gray-500 ml-2">
                (预期: {expectedOutput.slice(0, 40)}{expectedOutput.length > 40 ? '...' : ''})
              </span>
            )}
          </div>
          {output && (
            <button
              onClick={copyOutput}
              className="text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? '已复制' : '复制'}
            </button>
          )}
        </div>
        <pre className="h-40 p-4 bg-black text-gray-300 font-mono text-sm overflow-auto whitespace-pre-wrap">
          {output || <span className="text-gray-600">(点击"运行"按钮查看输出)</span>}
        </pre>
      </div>
    </div>
  )
}

export default PythonEditor
