import {Injectable, NotFoundException} from '@nestjs/common';
import {ChatDto} from '~/modules/AI/chat/chat.dto';
import {ChatAlibabaTongyi} from '@langchain/community/chat_models/alibaba_tongyi';
import {env, envBoolean, envNumber} from '~/global/env';
import {StringOutputParser} from '@langchain/core/output_parsers';
import {ChatPromptTemplate} from '@langchain/core/prompts';
import {getChatModel, getModelKey} from '~/utils/llm.util';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {XWSEntity} from '~/modules/AI/chat/entity/xws.entity';
import {BusinessException} from '~/common/exceptions/biz.exception';
import {ErrorEnum} from '~/constants/error-code.constant';
import * as console from 'console';


@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(XWSEntity)
        private XwsBookRepository: Repository<XWSEntity>,
    ) {
    }

    async chat(chatDto: ChatDto) {
        const outputParser = new StringOutputParser();

        if (chatDto.optionsObj) {
            const type = chatDto.optionsObj.type;
            const number = chatDto.optionsObj.number;

            console.log(chatDto, type, number);
            // 检索数据库作为context上下文
            const bookItem = await this.XwsBookRepository
                .createQueryBuilder('xws_book')
                .where({number})
                .getOne();

            if (!bookItem)
                throw new BusinessException(ErrorEnum.AI_NO_CONTEXT);

            console.log('bookItem', bookItem);

            // TODO: 获取APP的配置，prompt[]，模型
            const AppConfig: { prompt: any[]; model: string } = {
                prompt: [
                    ['system', '对' + bookItem.content + '进行解释'],
                    ['user', '{input}'],
                ],
                model: 'qwen-turbo',
            };


            const chatModel = getChatModel(AppConfig.model);
            const prompt = ChatPromptTemplate.fromMessages(AppConfig.prompt);


            const llmChain = prompt.pipe(chatModel).pipe(outputParser);
            const result = await llmChain.invoke({
                input: chatDto.message,
            });
            // console.log('result', result);
            return result;
        }
    }


    async talktest(chatDto: ChatDto) {
        const outputParser = new StringOutputParser();

        const qwen = new ChatAlibabaTongyi({
            model: 'qwen-turbo',
            temperature: 1,
            alibabaApiKey: env('QIANWEN_API_KEY'),
        });

        const prompt = ChatPromptTemplate.fromMessages([
            ['system', '.'],
            ['user', '{input}'],
        ]);

        const llmChain = prompt.pipe(qwen).pipe(outputParser);

        return await llmChain.invoke({
            input: chatDto.message,
        });
    }
}
