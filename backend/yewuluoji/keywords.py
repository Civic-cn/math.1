import jieba.analyse

def extract_keywords(text: str, top_k: int = 5) -> str:
    """TextRank 提取关键词；短文本提不出时退回 TF-IDF（避免空结果）"""
    words = jieba.analyse.textrank(text, topK=top_k)
    if not words:
        words = jieba.analyse.extract_tags(text, topK=top_k)
    return "、".join(words)