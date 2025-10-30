import http from 'node:http'
import path from 'node:path'
import fs from 'node:fs/promises'
import { handleValue } from './handler/handleValue.js'
import { fileURLToPath } from 'url'


const PORT = 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const server = http.createServer(async (req,res) => {

    if(req.url === '/api'){
        return await handleValue(req,res)
    }

    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url)
    const ext = path.extname(filePath)

    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
    }

    try{
        const content = await fs.readFile(filePath, 'utf8')
        res.statusCode = 200
        res.setHeader('Content-Type', mimeTypes[ext] || 'text/plain')
        res.end(content)
    }
    catch(err){ 
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        return res.end('File can not find')
    }


})


server.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`)
})