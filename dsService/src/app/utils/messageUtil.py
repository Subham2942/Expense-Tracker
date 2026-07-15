import re

class MessageUtil:
    def is_bank_msg(self, message):
        words_to_search = ["bank", "account", "transaction", "debit", "credit", "statement"]
        pattern = r'\b(?:' + '|'.join(words_to_search) + r')\b'
        return bool(re.search(pattern, message, re.IGNORECASE))