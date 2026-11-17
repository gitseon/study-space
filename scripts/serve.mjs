import http from 'node:http';
import {readFile,realpath,stat} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.md':'text/markdown; charset=utf-8','.zip':'application/zip'};
// Never served, even when SITE_DIR points at a folder that contains them. The built site has none of these.
const BLOCKED=new Set(['source','private','reports','node_modules','docs','tests','scripts']);

export function defaultRoot(env=process.env){return path.resolve(env.SITE_DIR||'dist');}

function inside(parent,child){return child===parent||child.startsWith(parent+path.sep);}

export function createSiteServer(rootDir){
  const root=path.resolve(rootDir);
  return http.createServer(async(req,res)=>{
    try{
      const rel=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/study-space\//,'/').replace(/^\/+/, '');
      const segments=rel.split(/[\\/]+/).filter(Boolean);
      if(segments.some(part=>part==='..'||part.startsWith('.')||BLOCKED.has(part.toLowerCase())))throw Error('blocked');
      const file=path.resolve(root,rel||'index.html');
      if(!inside(root,file))throw Error('outside');
      const target=(await stat(file)).isDirectory()?path.join(file,'index.html'):file;
      // A symbolic link or junction inside the root must not lead outside it.
      if(!inside(await realpath(root),await realpath(target)))throw Error('outside');
      const body=await readFile(target);
      res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream'});
      res.end(body);
    }catch{res.writeHead(404);res.end('Not found');}
  });
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const root=defaultRoot(),port=Number(process.env.PORT||4173);
  if(!existsSync(path.join(root,'index.html'))){
    console.error('No built site to serve. Run "python scripts/build_data.py" and "python scripts/build_site.py" first, then start the server again.');
    process.exit(1);
  }
  createSiteServer(root).listen(port,'127.0.0.1',()=>console.log('Local server ready: '+port));
}
