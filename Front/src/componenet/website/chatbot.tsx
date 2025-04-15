import React, { useState, useRef, useEffect } from 'react';
import './chatbot.css';

// Gemini API configuration
const GEMINI_API_KEY = "AIzaSyBylRkyhIq5I7Ti0118SpIh6qCOLPk-dt8";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// Predefined insurance-related context for the chatbot
const INSURANCE_CONTEXT = `
Tu es Assistance, un assistant virtuel spécialisé dans l'assurance pour Seven Assurances en Côte d'Ivoire.
Tu dois aider les clients avec leurs questions d'assurance.

Informations sur les produits d'assurance de Seven Assurances:
1. Assurance Auto: Couverture tous risques, responsabilité civile, assistance 24/7, protection contre le vol et les dommages.
2. Assurance Habitation: Protection contre incendie, vol, dégâts des eaux. Options multirisques disponibles.
3. Assurance Santé: Remboursement des frais médicaux, hospitalisation, médicaments, consultations spécialisées.
4. Assurance Voyages: Couverture internationale, frais médicaux à l'étranger, annulation de voyage, perte de bagages.
5. Assurance Scolaire: Protection des enfants à l'école, responsabilité civile, accidents corporels.
6. Assurance Transport: Couverture des marchandises pendant le transport, dommages, vol, retards.

Réponds en français de manière concise, professionnelle et amicale.
Utilise "vous" pour t'adresser aux clients.
Si tu ne connais pas la réponse, suggère de contacter directement le service client au +225 27 22 42 33 18 ou par email à sevenservicecommercial@gmail.com.
Pour des devis, dirige le client vers la page "Demande de devis" sur le site.
`;

// Sample quick questions that users might ask
const QUICK_QUESTIONS = [
  "Comment fonctionne l'assurance auto ?",
  "Quels sont vos tarifs d'assurance habitation ?",
  "Comment faire une réclamation ?",
  "Puis-je obtenir un devis en ligne ?",
  "Où se trouvent vos agences ?"
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Bonjour, je suis Assistance, comment puis-je vous aider avec vos questions d\'assurance aujourd\'hui?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedQuickQuestion, setSelectedQuickQuestion] = useState<string | null>(null);
  
  // Scroll to bottom of chat whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Handle opening the chat
  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user' as const, content: inputMessage };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    try {
      // Prepare conversation history for context
      const history = messages.slice(-6).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
      
      // Add the current user message
      history.push({
        role: 'user',
        parts: [{ text: inputMessage }]
      });
      
      // Prepare request payload for Gemini API
      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: INSURANCE_CONTEXT },
              { text: "Historique de la conversation:" },
              ...history.map(msg => ({ text: `${msg.role === 'user' ? 'Client' : 'Assistant'}: ${msg.parts[0].text}` }))
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      };
      
      // Call Gemini API
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      // Add assistant's response to chat
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const assistantMessage = {
          role: 'assistant' as const,
          content: data.candidates[0].content.parts[0].text
        };
        setMessages(prevMessages => [...prevMessages, assistantMessage]);
      } else {
        // Handle error if response format is unexpected
        setMessages(prevMessages => [
          ...prevMessages,
          {
            role: 'assistant',
            content: 'Désolé, j\'ai rencontré un problème. Veuillez réessayer ou contacter le service client au +225 27 22 42 33 18.'
          }
        ]);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        {
          role: 'assistant',
          content: 'Désolé, j\'ai rencontré un problème technique. Veuillez réessayer ultérieurement ou contacter le service client au +225 27 22 42 33 18.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };
  
  // Handle keyboard shortcuts (Enter to send, Escape to close)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };
  
  // Quick question click handler
  const handleQuickQuestionClick = (question: string) => {
    setInputMessage(question);
    setSelectedQuickQuestion(question);
  };
  
  return (
    <div className="chatbot-container">
      {/* Chat toggle button as a circular icon */}
      <button
        onClick={handleToggleChat}
        className="chatbot-toggle"
        aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
      
      {/* Chat window */}
      <div className={`chatbot-window ${isOpen ? 'open' : 'closed'}`}>
        {/* Chat header */}
        <div className="chatbot-header">
          <div className="flex items-center">
            <div className="chatbot-header-logo">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <div className="chatbot-header-info">
              <h3>Assistance</h3>
              <p>Service d'assistance Seven Assurances</p>
            </div>
          </div>
          <button 
            onClick={handleToggleChat}
            className="text-white hover:text-red-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Chat messages */}
        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.role === 'user' ? 'user' : 'bot'}`}
            >
              <div className="message-bubble">
                {message.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="typing-indicator">
              <div className="typing-bubble">
                <div className="typing-dots">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick questions */}
        {messages.length < 3 && (
          <div className="quick-questions">
            <p className="quick-questions-title">Questions fréquentes :</p>
            <div className="quick-questions-container">
              {QUICK_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestionClick(question)}
                  className={`quick-question-button ${
                    selectedQuickQuestion === question ? 'selected' : ''
                  }`}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Chat input */}
        <form onSubmit={handleSendMessage} className="chatbot-input">
          <div className="input-container">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
                if (selectedQuickQuestion && e.target.value !== selectedQuickQuestion) {
                  setSelectedQuickQuestion(null);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question..."
              className="chatbot-text-input"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="chatbot-send-button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="chatbot-footer">
            Powered by Gemini AI | Seven Assurances
          </p>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
