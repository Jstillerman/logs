import requests
import time
r = requests.post('http://localhost:8080/api/logs', json={"action": "opened my", "what":"Macbook Pro", "when":time.strftime("%c")})

files = {'img': open('/Users/jts/Daily/logs/hooks/snapshot.png', 'rb')}
requests.post('http://localhost:8080/api/upload', files=files)
