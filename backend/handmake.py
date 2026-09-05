from http.server import BaseHTTPRequestHandler, HTTPServer
import json

profile = {
    "heroTitle": "关于我",
    "heroSubtitle": "项目，创意，灵感，心得，我的作品",
}

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        print(self.headers)          # 打印收到的请求头
        print(self.client_address)   #打印 客户ip
        if self.path == "/api/profile":
            self.send_response(200) #状态头
            self.send_header("Content-Type", "application/json")#响应头
            self.end_headers()#空行
            body = json.dumps(profile, ensure_ascii=False)  # 响应体 ensure_ascii=False：让中文原样输出
            self.wfile.write(body.encode("utf-8"))

        else:
            self.send_response(404)
            self.end_headers()

print("后端已启动：http://localhost:8000/api/profile")
HTTPServer(("", 8000), Handler).serve_forever()

#一个守在8000端口上等待调用方服务的进程