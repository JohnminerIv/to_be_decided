const http = require('http') // To use the HTTP interfaces in Node.js
const fs = require('fs') // For interacting with the file system
const path = require('path') // For working with file and directory paths
const url = require('url') // For URL resolution and parsing
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
}


const server = http.createServer()
server.on('request', (req, res) => {
    const parsedUrl = new URL(req.url, 'https://hidden-taiga-11992.herokuapp.com/')
  let pathName = parsedUrl.pathname
  let ext = path.extname(pathName)

  // To handle URLs with trailing '/' by removing aforementioned '/'
  // then redirecting the user to that URL using the 'Location' header
  if (pathName !== '/' && pathName[pathName.length - 1] === '/') {
    res.writeHead(302, {'Location': pathName.slice(0, -1)})
    res.end()
    return
  }

  // If the request is for the root directory, return index.html
  // Otherwise, append '.html' to any other request without an extension
  if (pathName === '/') {
    ext = '.html'
    pathName = '/index.html'
  } else if (!ext) {
    ext = '.html'
    pathName += ext
  }
  // Construct a valid file path so the relevant assets can be accessed
const filePath = path.join(process.cwd(), '/public', pathName)
// Check if the requested asset exists on the server
fs.exists(filePath, function (exists, err) {
  // If the asset does not exist, respond with a 404 Not Found
  if (!exists || !mimeTypes[ext]) {
    console.log('File does not exist: ' + pathName)
    res.writeHead(404, {'Content-Type': 'text/plain'})
    res.write('404 Not Found')
    res.end()
    return
  }
  // Otherwise, respond with a 200 OK status,
  // and add the correct content-type header
  res.writeHead(200, {'Content-Type': mimeTypes[ext]})
  // Read file from the computer and stream it to the response
  const fileStream = fs.createReadStream(filePath)
  fileStream.pipe(res)
})
})


server.listen(5000)
