import axios from 'axios'
import { text } from 'stream/consumers';

const insults = [
    'Con lợn này',
    'Pock Pock, nghe tiếng con gà đâu đây',
    'Giảm cân đi bạn ơi',
    'Bạn có bồ chưa , mình có rồi nè hẹ hẹ',
    'Bạn có biết bạn trông như con lợn không?',
    'Nhắn loz j lắm z',
    'Bố mẹ bạn biết bạn gay chưa',
    'Sao mày ko đi tắm cho thơm',
    'Thứ dơ dáy',
    'Tầm này chỉ có ăn cức',
    'Ước gì tao có đc cái mồm như mày',
    'Mày nghĩ mày là ai mà nói chuyện với tao',
    'Mày có biết mày ngu ko',
    'Heo kìa ahaha',
    'Ko biết mày là con gì nữa',
];

export async function generateToast(): Promise<string> {
    console.log('Generating toast for:', text);

    const prompt = `You are a Vietnamese friend making playful roasts. Create a short Vietnamese roast that is:
- 1-2 lines maximum
- Direct and witty like Vietnamese internet humor
- Playful teasing between friends
- Uses Vietnamese slang mixed with English
- No explanations, just the roast
- No use same jokes before
- Similar style to: "${insults.slice(0, 3).join('", "')}"`;

    const response = await axios.post(
        'https://api.cohere.ai/v1/chat',
        {
            model: 'command-a-03-2025',
            message: `Generate a funny Vietnamese roast based on the following instructions:\n\n${prompt}`,
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

    console.log('Cohere response:', response.data);
    return response.data.text.trim();


}