import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

import { SocksProxyAgent } from 'socks-proxy-agent';
const agent = new SocksProxyAgent('socks5://14aeb2d09ec1a:d120ff77d6@185.112.242.39:12324');

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
    httpAgent: agent
});

export async function POST(req: Request) {
    const reqBody = await req.json();
    const model = reqBody.data.model;

    let gptModel = 'gpt-3.5-turbo'

    switch (model) {
        case "GPT-3.5":
            gptModel = 'gpt-3.5-turbo';
            break;
        case "GPT-4":
            gptModel = 'gpt-4-turbo';
            break;
        case "GPT-4o":
            gptModel = 'gpt-4o';
            break;
    }

    const response = await client.chat.completions.create({
        model: gptModel,
        stream: true,
        messages: reqBody.messages,
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
}
