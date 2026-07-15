import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_mistralai import ChatMistralAI
from .Expense import Expense
from dotenv import load_dotenv

class LLMService:
    def __init__(self):
        load_dotenv()
        self.prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are an expert extraction algorithm. "
                "Only extract relevant information from the text. "
                "If you do not know the value of an attribute asked to extract, "
                "return null for the attribute's value.",
            ),
            ("human", "{text}")
        ]
        )
        self.api_key = os.getenv('MISTRAL_API_KEY')
        if not self.api_key:
            raise RuntimeError('MISTRAL_API_KEY is not set. Add it to dsService/.env.')

        self.llm = ChatMistralAI(
            api_key=self.api_key,
            model="ministral-3b-latest",
            temperature=0,
        )
        self.runnable = self.prompt | self.llm.with_structured_output(schema=Expense)

    def run_llm(self, message):
        result = self.runnable.invoke({"text": message})
        return result.model_dump()
