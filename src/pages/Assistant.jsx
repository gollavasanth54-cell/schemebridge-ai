import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import ChatMessage from '../components/chat/ChatMessage'
import ChatInput from '../components/chat/ChatInput'
import ExampleQuestions from '../components/chat/ExampleQuestions'
import TypingIndicator from '../components/chat/TypingIndicator'
import { useAuth } from '../context/AuthContext'
import { getBotReply } from '../utils/chatbotEngine'

const WELCOME = {
  id: 'welcome',
  role: 'bot',
  text:
    "👋 Hi! I'm the **SchemeBridge AI Assistant**.\n\n" +
    'I answer using only the verified scheme database — no invented information.\n\n' +
    'Ask me about schemes, eligibility, documents, benefits, or application steps.',
  timestamp: Date.now(),
}

export default function Assistant() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([WELCOME])
  const [isTyping, setIsTyping] = useState(false)
  const [lastSchemeId, setLastSchemeId] = useState(null)
  const [lastCategory, setLastCategory] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isTyping])

  const send = (rawText) => {
    const text = String(rawText || '').trim()
    if (!text || isTyping) return

    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user',
      text,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    setTimeout(() => {
      try {
        const reply = getBotReply(text, messages, {
          lastSchemeId,
          lastCategory,
          profile: user?.profile || {},
        })

        const botMsg = {
          id: crypto.randomUUID(),
          role: 'bot',
          text: reply.text,
          links: reply.links || [],
          schemeRef: reply.schemeRef || null,
          timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, botMsg])

        // Update context
        if (reply.schemeRef) setLastSchemeId(reply.schemeRef)
        if (reply.categoryRef) setLastCategory(reply.categoryRef)
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'bot',
            text:
              'Sorry, I ran into an error processing that. Please try rephrasing your question or start a new chat.',
            timestamp: Date.now(),
          },
        ])
      } finally {
        setIsTyping(false)
      }
    }, 450 + Math.random() * 400)
  }

  const reset = () => {
    setMessages([WELCOME])
    setLastSchemeId(null)
    setLastCategory(null)
    setIsTyping(false)
  }

  return (
    <div className="mx-auto flex h-[78vh] min-h-[560px] max-w-3xl flex-col">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">SchemeBridge AI Assistant</h1>
          <p className="mt-1 text-sm text-slate-500">
            Answers are drawn only from the verified scheme database.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={reset}>
          New chat
        </Button>
      </div>

      <Card className="mb-3 border-amber-200 bg-amber-50 p-3">
        <p className="text-xs text-amber-900">
          <span className="font-semibold">ℹ️ </span>
          The assistant never invents scheme information. Eligibility suggestions are
          preliminary and not an official government approval.
        </p>
      </Card>

      <Card className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={scrollRef} />
        </div>
      </Card>

      {messages.length <= 2 && (
        <div className="mt-3">
          <ExampleQuestions onPick={send} />
        </div>
      )}

      <div className="mt-3">
        <ChatInput onSend={send} disabled={isTyping} />
      </div>

      <div className="mt-2 text-center text-xs text-slate-400">
        Need filters or full details?{' '}
        <Link to="/schemes" className="text-brand-700 hover:underline">
          Browse all schemes →
        </Link>
      </div>
    </div>
  )
}