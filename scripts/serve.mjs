import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(process.env.SITE_DIR||'.'),port=Number(process.env.PORT||4173);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{
  try{
    let rel=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/study-space\//,'/').replace(/^\/+/, '');
    const file=path.resolve(root,rel||'index.html');
    if(!file.startsWith(root+path.sep)&&file!==root)throw Error();
    const target=(await stat(file)).isDirectory()?path.join(file,'index.html'):file;
    res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream'});
    res.end(await readFile(target));
  }catch{res.writeHead(404);res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log('Local server ready: '+port));
