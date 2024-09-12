import OpenAI from "openai";
import { SocksProxyAgent } from 'socks-proxy-agent';
const agent = new SocksProxyAgent('socks5://14aeb2d09ec1a:d120ff77d6@185.112.242.39:12324');

export const openai = new OpenAI({ httpAgent: agent });
