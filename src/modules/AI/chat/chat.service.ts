import {Injectable} from '@nestjs/common';
import {ChatDto} from '~/modules/AI/chat/chat.dto';
import {OpenAI} from '@langchain/openai';
import {ChatAlibabaTongyi} from '@langchain/community/chat_models/alibaba_tongyi';
import {env, envBoolean, envNumber} from '~/global/env';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';


@Injectable()
export class ChatService {
    async talk(chatDto: ChatDto) {
        const outputParser = new StringOutputParser();

        const qwen = new ChatAlibabaTongyi({
            model: 'qwen-turbo',
            temperature: 1,
            alibabaApiKey: env('QIANWEN_API_KEY'),
        });

        const prompt = ChatPromptTemplate.fromMessages([
            ['system', '你是一个旅游专家.'],
            ['user', '{input}'],
        ]);

        const llmChain = prompt.pipe(qwen).pipe(outputParser);

        return await llmChain.invoke({
            input: chatDto.message,
        });
    }
}
