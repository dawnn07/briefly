import axios from 'axios'

export async function summarizeText(text: string): Promise<string> {
    console.log('Summarizing text:', text);
    const response = await axios.post(
        'https://api.cohere.ai/v1/chat',
        {
            model: 'command-a-03-2025',
            message: `Tell me what this conversation is about, summarize it, and give me the main points (same language):\n\n${text}`,
            temperature: 0.3,
            stream: false
        },
        {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );

    console.log('Cohere summary response:', response.data);
    return response.data.text.trim();


}