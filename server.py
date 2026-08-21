import http.server
import socketserver
import urllib.parse
import urllib.request
import json
import re
from bs4 import BeautifulSoup

PORT = 8080

class ComplianceHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        
        # Internal API Endpoint for 100% Reliable Local URL Crawling
        if parsed_url.path == '/api/crawl':
            query_params = urllib.parse.parse_qs(parsed_url.query)
            target_url = query_params.get('url', [''])[0]
            
            if not target_url:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Missing url parameter'}).encode('utf-8'))
                return

            try:
                req = urllib.request.Request(
                    target_url,
                    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
                )
                with urllib.request.urlopen(req, timeout=10) as res:
                    raw_html = res.read().decode('utf-8', errors='ignore')
                    
                soup = BeautifulSoup(raw_html, 'html.parser')
                for tag in soup(['script', 'style', 'header', 'footer', 'nav', 'iframe']):
                    tag.decompose()
                    
                text_content = soup.get_text(separator='\n')
                cleaned_text = '\n'.join([line.strip() for line in text_content.splitlines() if line.strip()])
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response_data = {
                    'status': 'success',
                    'url': target_url,
                    'length': len(cleaned_text),
                    'text': cleaned_text
                }
                self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))
                return

            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'error', 'message': str(e)}).encode('utf-8'))
                return

        # Serve static web app files
        super().do_GET()

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), ComplianceHandler) as httpd:
        print(f"SME Privacy Compliance Server started at http://localhost:{PORT}")
        httpd.serve_forever()
