interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  
  return {
    chat: {
      completions: {
        create: async (params: {
          model: string;
          messages: ChatMessage[];
          max_tokens?: number;
          temperature?: number;
        }): Promise<OpenAIResponse> => {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
          });

          if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
          }

          return response.json();
        }
      }
    }
  };
}

export function getModelForRole(role?: string): string {
  const defaultModel = process.env.OPENAI_MODEL_DEFAULT || 'gpt-4o-mini';
  const guestModel = process.env.OPENAI_MODEL_GUEST || 'gpt-4o';
  const visitorModel = process.env.OPENAI_MODEL_VISITOR || 'gpt-3.5-turbo';

  switch (role) {
    case 'clientes':
    case 'propietarios':
      return guestModel;
    case 'monitor':
      return visitorModel;
    default:
      return defaultModel;
  }
}