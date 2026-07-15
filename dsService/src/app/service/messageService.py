from ..utils.messageUtil import MessageUtil
from .LLMService import LLMService

class MessageService:
    def __init__(self):
        self.message_util = MessageUtil()
        self.llm_service = LLMService()
    
    def process_message(self, message):
        if self.message_util.is_bank_msg(message):
            return self.llm_service.run_llm(message)
        return {'message': 'The supplied text does not appear to be a bank message.'}
