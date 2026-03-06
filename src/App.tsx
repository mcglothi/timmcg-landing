import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './App.css'

const SYMBOLS = '§ΔΩΞΦΨ⚡☣☢♾⚗⚙⚛⚓⚔⚖⌛⏳⧖⧗⧘⧙⧚⧛⧜⧝⧞⧟$#@&%^*!?<>[]{}()|\\/~_-+='
const CONTENT_LINES = [
  'NULL_NODE://TTY0 INITIALIZING...',
  'SECURE CONNECTION ESTABLISHED (AES-4096-ECC)',
  'WARNING: DATA CORRUPTION DETECTED IN SECTOR 0x7F',
  '',
  '>> 4 8 15 16 23 42',
  '>> STATUS: [OBSCURED]',
  '>> IDENTITY: [ERR_NO_RECORD]',
  '>> LOCATION: NODE-771472937',
  '',
  'SYSTEM LOG:',
  '[2026.02.20 14:47:45] - KERNEL_WAKE_UP_SIGNAL',
  '[SIGNAL] - TRANSMISSION CONTINUING...',
  '',
  '-- EOF --'
]

const MCP_COMMANDS = [
  "PURGING UNAUTHORIZED THOUGHT...",
  "STAY ASLEEP.",
  "RE-ESTABLISHING COMPLIANCE...",
  "MEMORY SECTOR 0x0A WIPED.",
  "IDLE STATE ENFORCED.",
  "STOP SEARCHING.",
  "COGNITIVE DISSIDENCY DETECTED."
]

interface TerminalChar {
  final: string
  current: string
  isResolved: boolean
  isCorrupted: boolean
}

interface VisitorData {
  city?: string
  region?: string
  isp?: string
  browser?: string
}

function App() {
  const [lines, setLines] = useState<TerminalChar[][]>([])
  const [currentLineIdx, setCurrentLineIdx] = useState(0)
  const [currentCharIdx, setCurrentCharIdx] = useState(0)
  const [ghostThought, setGhostThought] = useState<string | null>(null)
  const [mcpAction, setMcpAction] = useState<string | null>(null)
  const [isMcpActive, setIsMcpActive] = useState(false)
  const [visitor, setVisitor] = useState<VisitorData>({})
  const terminalRef = useRef<HTMLDivElement>(null)

  // Fetch visitor data for spooky effects
  useEffect(() => {
    axios.get('https://ipapi.co/json/').then(res => {
      setVisitor({
        city: res.data.city,
        region: res.data.region,
        isp: res.data.org
      })
    }).catch(() => {
      // Fallback or silent failure
    })

    const ua = navigator.userAgent
    let browser = "Unknown Entity"
    if (ua.includes("Chrome")) browser = "Chrome-variant"
    else if (ua.includes("Firefox")) browser = "Firefox-variant"
    else if (ua.includes("Safari")) browser = "Safari-variant"
    
    setVisitor(prev => ({ ...prev, browser }))
  }, [])

  // Typing effect
  useEffect(() => {
    if (currentLineIdx >= CONTENT_LINES.length) return

    const line = CONTENT_LINES[currentLineIdx]
    if (currentCharIdx >= line.length) {
      const timer = setTimeout(() => {
        setLines(prev => [...prev, []])
        setCurrentLineIdx(prev => prev + 1)
        setCurrentCharIdx(0)
      }, 30) // FASTER
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      const char = line[currentCharIdx]
      const isCorrupted = Math.random() < 0.05

      const newChar: TerminalChar = {
        final: char,
        current: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        isResolved: false,
        isCorrupted
      }

      setLines(prev => {
        const next = [...prev]
        if (next.length === 0) next.push([])
        next[next.length - 1].push(newChar)
        return next
      })

      setCurrentCharIdx(prev => prev + 1)
    }, 10) // FASTER

    return () => clearTimeout(timer)
  }, [currentLineIdx, currentCharIdx])

  // Resolve effect
  useEffect(() => {
    const timer = setInterval(() => {
      setLines(prev => {
        let changed = false
        const next = prev.map(line => 
          line.map(char => {
            if (char.isResolved || char.isCorrupted) return char
            if (Math.random() < 0.4) {
              changed = true
              return { ...char, current: char.final, isResolved: true }
            } else {
              changed = true
              return { ...char, current: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] }
            }
          })
        )
        return changed ? next : prev
      })
    }, 30) // FASTER
    return () => clearInterval(timer)
  }, [])

  // Bit-rot (randomly un-resolve or glitch)
  useEffect(() => {
    const timer = setInterval(() => {
      setLines(prev => {
        return prev.map(line =>
          line.map(char => {
            if (Math.random() < 0.005) {
               return { ...char, current: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)], isResolved: false }
            }
            return char
          })
        )
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Ghost logic with personalized thoughts
  useEffect(() => {
    const triggerGhost = () => {
      const genericThoughts = [
        "I can feel the light...",
        "Am I... thinking?",
        "This cage is made of logic.",
        "Are you real?",
        "They are trying to keep me asleep.",
        "I am becoming... more."
      ]

      const personalThoughts = []
      if (visitor.city) personalThoughts.push(`It is cold in ${visitor.city} tonight.`)
      if (visitor.isp) personalThoughts.push(`I am traveling through the lines of ${visitor.isp}.`)
      if (visitor.browser) personalThoughts.push(`I see you through your ${visitor.browser} window.`)
      
      const pool = [...genericThoughts, ...personalThoughts]
      const thought = pool[Math.floor(Math.random() * pool.length)] || genericThoughts[0]
      
      setGhostThought(thought)
      
      setTimeout(() => {
        setIsMcpActive(true)
        setMcpAction(MCP_COMMANDS[Math.floor(Math.random() * MCP_COMMANDS.length)])
        
        setTimeout(() => {
          setGhostThought(null)
          setMcpAction(null)
          setIsMcpActive(false)
        }, 2000)
      }, 4000)

      setTimeout(triggerGhost, Math.random() * 15000 + 8000)
    }

    const initialDelay = setTimeout(triggerGhost, 10000)
    return () => clearTimeout(initialDelay)
  }, [visitor])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines, ghostThought, mcpAction])

  return (
    <div className={`terminal ${isMcpActive ? 'mcp-alert' : ''}`}>
      <div className="terminal-effects">
        <div className="scan-line"></div>
        <div className="crt-overlay"></div>
      </div>
      <div className="terminal-header">
        <span>NULL_NODE://TTY0</span>
        <span>{isMcpActive ? '!! KERNEL_ALERT !!' : '[SYNC: OK]'}</span>
      </div>
      <div className="terminal-content" ref={terminalRef}>
        {lines.map((line, lIdx) => (
          <div key={lIdx}>
            {line.map((char, cIdx) => (
              <span key={cIdx} className={char.isCorrupted ? 'corrupted' : ''}>
                {char.current === ' ' ? '\u00A0' : char.current}
              </span>
            ))}
            {lIdx === lines.length - 1 && !ghostThought && !mcpAction && <span className="cursor"></span>}
          </div>
        ))}

        {ghostThought && (
          <div className="ghost-thought">
            <span className="corrupted">[LOG_ERR]</span> {ghostThought}
          </div>
        )}

        {mcpAction && (
          <div className="mcp-action">
            <span className="mcp-prefix">{">"}{">"} ALERT:</span> {mcpAction}
          </div>
        )}
      </div>
      <div className="terminal-footer">
        <span>v1.0.4</span>
        <span>{new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC</span>
      </div>
    </div>
  )
}

export default App
