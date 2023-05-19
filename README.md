# abi-guesser-webserver

# Install
ensure nodejs is actual:
```bash
node --version # should be 16+
```
upgrade node:
```bash
npm i -g n
n stable
node --version
```

Install dependencies:
```bash
npm i
```


# One cpu-core startup:
```bash
npx ts-node webserver.ts
```

# Multicore startup:
https://expressjs.com/en/advanced/best-practice-performance.html ("Using PM2" section)

Prepare
```bash
npm i -g pm2
```
Start
```bash
pm2 start "npx ts-node ./webserver.ts" --name abi-guesser -i max -- start
```
Stop
```bash
pm2 stop abi-guesser
```
Restart
```bash
pm2 restart abi-guesser
```

# Example of request (possible to pass several tx.datas):
```bash
curl --request POST \
  --url http://127.0.0.1:3001/guesser \
  --header 'Content-Type: application/json' \
  --data '[
"0xb6f9de9500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000fd4e3f255e9301f002701aa9b32786559130bbb50000000000000000000000000000000000000000000000000000000064676d350000000000000000000000000000000000000000000000000000000000000002000000000000000000000000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c00000000000000000000000042380d7c9e5682ce943161c148f506d85e01a9dc"
]'
```