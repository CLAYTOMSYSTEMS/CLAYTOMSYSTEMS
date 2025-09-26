'use client';

import { useState } from 'react';
import ChatWidget from './ChatWidget';

export default function FABSandra() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fab-sandra w-16 h-16 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-2xl transform hover:scale-110"
        aria-label="Abrir chat con Sandra IA"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Widget Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[1001] flex items-end justify-end p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Chat Widget */}
          <div className="relative w-full max-w-md h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-primary-500 text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  🤖
                </div>
                <div>
                  <h3 className="font-semibold">Sandra IA</h3>
                  <p className="text-xs text-primary-100">Tu asistente virtual</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Cerrar chat"
              >
                ✕
              </button>
            </div>
            
            <div className="h-[calc(100%-64px)]">
              <ChatWidget />
            </div>
          </div>
        </div>
      )}
    </>
  );
}