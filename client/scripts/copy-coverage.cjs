const fs = require('fs')
const path = require('path')

const src = path.join(__dirname, '..', 'coverage')
const dest = path.join(__dirname, '..', 'public', 'client', 'coverage')

if (!fs.existsSync(src)) {
  console.error('coverage/ not found. Run vitest with --coverage first.')
  process.exit(1)
}

fs.rmSync(dest, { recursive: true, force: true })
fs.mkdirSync(path.dirname(dest), { recursive: true })
fs.cpSync(src, dest, { recursive: true })

console.log('Coverage available at http://localhost:5173/client/coverage/index.html')
