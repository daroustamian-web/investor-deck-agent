import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '@/lib/questions';

const anthropic = new Anthropic();

export async function POST(request: Request) {
  try {
    const { messages, projectData } = await request.json();

    // Build context from collected data
    const contextSummary = Object.entries(projectData || {})
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const systemMessage = contextSummary
      ? `${SYSTEM_PROMPT}\n\n## Data Collected So Far\n${contextSummary}`
      : SYSTEM_PROMPT;

    // Convert messages to Anthropic format
    const formattedMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemMessage,
      messages: formattedMessages,
    });

    const textContent = response.content.find((block) => block.type === 'text');
    const text = textContent?.type === 'text' ? textContent.text : '';

    return Response.json({ content: text });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
