import {env} from '~/global/env';
import {BaseChatModel} from '@langchain/core/language_models/chat_models';
import {ChatAlibabaTongyi} from '@langchain/community/chat_models/alibaba_tongyi';

/**
 * 获取模型配置key
 * TODO： 数据库存储
 * @param model
 */
export function getModelKey(model: string): string {
    if (model.startsWith('qwen')) {
        return env('QIANWEN_API_KEY');
    }
}


/**
 * 获取模型
 * @param model
 */
export function getChatModel(model: string): BaseChatModel {
    switch (model) {
        case 'qwen-turbo':
            return new ChatAlibabaTongyi({
                model: model,
                temperature: 1,
                alibabaApiKey: getModelKey(model),
            });
    }
}
