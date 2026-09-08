# 业务层：情感分析 函数定义
from snownlp import SnowNLP

def analyze_sentiment(text: str):
    #规定analyze的格式要求是str basemodel继承了str的格式给到analyze
    #"""用 SnowNLP 计算情感分数"""
    try:
        score = SnowNLP(text).sentiments
        return round(float(score), 2)
    except Exception:
        return 0.5  # 出错给中等分
    
def score_label(score):
    if score >= 0.8:
        return "乐观主义者"      
    elif score >= 0.6:
        return "至少是positive"     
    elif score >= 0.4:
        return "中！！！"        
    elif score >= 0.2:
        return "似乎有点糟糕"      
    else:
        return "看起来很糟糕"     

# label单独用一个函数来实现，因为逻辑较为简单