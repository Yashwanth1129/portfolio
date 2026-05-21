import React, { useState, useRef, useEffect } from 'react';

import { API_URL, sendContactMessage } from '../config/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm Yashwanth's portfolio assistant. Ask me about experience, projects, skills, or education. Recruiters can use the Contact tab to send a message directly."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactErrors, setContactErrors] = useState({});
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage = { role: 'user', content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const history = nextMessages
        .slice(0, -1)
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get a response');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "Sorry, I couldn't reach the server. Make sure the .NET API is running and Qdrant is indexed. You can still email Yashwanth via the Contact tab."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const validateContact = () => {
    const errors = {};
    if (!contactForm.name.trim()) errors.name = 'Required';
    if (!contactForm.email.trim()) errors.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(contactForm.email)) errors.email = 'Invalid email';
    if (!contactForm.subject.trim()) errors.subject = 'Required';
    if (!contactForm.message.trim()) errors.message = 'Required';
    return errors;
  };

  const sendContact = async (e) => {
    e.preventDefault();
    const errors = validateContact();
    if (Object.keys(errors).length > 0) {
      setContactErrors(errors);
      return;
    }

    setContactSubmitting(true);
    setContactSuccess(null);
    setContactErrors({});

    try {
      const data = await sendContactMessage(contactForm);
      setContactSuccess(data.message);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setContactSuccess(null);
      setContactErrors({ form: err.message });
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[min(100vw-3rem,380px)]"
          style={{ height: 'min(70vh, 520px)', maxHeight: 'calc(100vh - 8rem)' }}
        >
          <div className="h-full border-8 border-black shadow-2xl flex flex-col bg-black text-white font-mono">
            <div className="flex justify-between items-start p-4 border-b border-gray-700 shrink-0">
              <div>
                <h3 className="font-bold text-sm uppercase">Portfolio Assistant</h3>
                <p className="text-xs text-gray-400">Ask about Yashwanth</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-400 text-xl leading-none"
                aria-label="Close chat"
              >
                ×
              </button>
            </div>

            <div className="flex border-b border-gray-700 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2 text-xs uppercase ${
                  activeTab === 'chat' ? 'bg-white text-black' : 'hover:bg-gray-900'
                }`}
              >
                Chat
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('contact')}
                className={`flex-1 py-2 text-xs uppercase ${
                  activeTab === 'contact' ? 'bg-white text-black' : 'hover:bg-gray-900'
                }`}
              >
                Contact
              </button>
            </div>

            {activeTab === 'chat' ? (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white text-black min-h-0">
                  {messages.map((msg, i) => (
                    <div key={i} className="flex">
                      <div
                        className={`max-w-[90%] p-3 text-sm border-2 ${
                          msg.role === 'user'
                            ? 'ml-auto bg-black text-white border-black'
                            : 'mr-auto bg-white text-black border-black'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <p className="text-xs text-gray-500 font-mono animate-pulse">Thinking...</p>
                  )}
                  {error && <p className="text-xs text-red-600 font-mono">{error}</p>}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={sendMessage}
                  className="p-3 border-t-2 border-white bg-black flex gap-2 shrink-0"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about experience, skills..."
                    className="flex-1 bg-black border-2 border-white p-2 text-sm text-white font-mono placeholder-gray-500"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-white text-black px-4 py-2 text-sm font-mono hover:bg-gray-200 disabled:opacity-50"
                  >
                    →
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 bg-white text-black min-h-0">
                <p className="text-sm mb-4">
                  Recruiters: send a message and Yashwanth will reply by email.
                </p>
                {contactSuccess ? (
                  <div className="border-4 border-black p-4">
                    <p className="font-bold mb-2">MESSAGE SENT!</p>
                    <p className="text-sm mb-4">{contactSuccess}</p>
                    <button
                      type="button"
                      onClick={() => setContactSuccess(null)}
                      className="bg-black text-white font-mono py-2 px-4 text-sm hover:bg-gray-900"
                    >
                      SEND ANOTHER
                    </button>
                  </div>
                ) : (
                  <form onSubmit={sendContact} className="space-y-3">
                    {['name', 'email', 'subject'].map((field) => (
                      <div key={field}>
                        <label className="block text-xs uppercase mb-1">{field}</label>
                        <input
                          type={field === 'email' ? 'email' : 'text'}
                          name={field}
                          value={contactForm[field]}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, [field]: e.target.value })
                          }
                          className={`w-full border-2 p-2 text-sm font-mono ${
                            contactErrors[field] ? 'border-red-500' : 'border-black'
                          }`}
                        />
                        {contactErrors[field] && (
                          <p className="text-red-500 text-xs mt-1">{contactErrors[field]}</p>
                        )}
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs uppercase mb-1">message</label>
                      <textarea
                        name="message"
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, message: e.target.value })
                        }
                        className={`w-full border-2 p-2 text-sm font-mono h-24 ${
                          contactErrors.message ? 'border-red-500' : 'border-black'
                        }`}
                      />
                      {contactErrors.message && (
                        <p className="text-red-500 text-xs mt-1">{contactErrors.message}</p>
                      )}
                    </div>
                    {contactErrors.form && (
                      <p className="text-red-500 text-xs">{contactErrors.form}</p>
                    )}
                    <button
                      type="submit"
                      disabled={contactSubmitting}
                      className="w-full bg-black text-white font-mono py-3 text-sm hover:bg-gray-900 disabled:opacity-50"
                    >
                      {contactSubmitting ? 'SENDING...' : 'SEND MESSAGE →'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[100] font-mono text-sm uppercase tracking-wide
          border-4 border-black transition-all
          shadow-[5px_5px_0_0_#000000]
          hover:shadow-[3px_3px_0_0_#000000] hover:translate-x-[2px] hover:translate-y-[2px]
          ${isOpen
            ? 'bg-black text-white px-5 py-3'
            : 'bg-white text-black px-4 py-3 ring-4 ring-white/80'
          }`}
        aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
      >
        {isOpen ? (
          'Close ×'
        ) : (
          <span className="flex items-center gap-2">
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Ask AI
          </span>
        )}
      </button>
    </>
  );
};

export default Chatbot;
