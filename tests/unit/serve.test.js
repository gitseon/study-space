import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createSiteServer,defaultRoot} from '../../scripts/serve.mjs';

function fixture(){
  const base=fs.mkdtempSync(path.join(os.tmpdir(),'serve-test-'));
  const root=path.join(base,'site'),outside=path.join(base,'outside');
  for(const [rel,text] of [['index.html','<p>home</p>'],['pages/quiz.html','<p>quiz</p>'],['data/manifest.json','{"ok":true}'],
    ['data/spring-projects/p/stage-1.zip','PK'],['private/secret.txt','secret'],['source/a.md','source'],['.git/config','config'],
    ['reports/r.json','{}'],['node_modules/x/index.js','x']]){
    fs.mkdirSync(path.dirname(path.join(root,rel)),{recursive:true});fs.writeFileSync(path.join(root,rel),text);
  }
  fs.mkdirSync(outside);fs.writeFileSync(path.join(outside,'secret.txt'),'outside');
  fs.symlinkSync(outside,path.join(root,'link'),'junction');
  return {base,root};
}
async function withServer(root,run){
  const server=createSiteServer(root);
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try{await run(`http://127.0.0.1:${server.address().port}`);}finally{await new Promise(resolve=>server.close(resolve));}
}
// fetch normalises dot segments, so traversal attempts are sent as raw request lines.
async function rawStatus(origin,rawPath){
  const {default:http}=await import('node:http');const url=new URL(origin);
  return new Promise((resolve,reject)=>{http.request({host:url.hostname,port:url.port,path:rawPath},res=>{res.resume();resolve(res.statusCode);}).on('error',reject).end();});
}

test('pages, data and ZIP files are served under the Pages path and at the root',async()=>{
  const {base,root}=fixture();
  await withServer(root,async origin=>{
    for(const url of ['/study-space/','/study-space/index.html','/study-space/pages/quiz.html','/study-space/data/manifest.json','/data/manifest.json','/study-space/data/spring-projects/p/stage-1.zip']){
      assert.equal((await fetch(origin+url)).status,200,url);
    }
    assert.match((await fetch(origin+'/study-space/data/manifest.json')).headers.get('content-type'),/application\/json/);
  });
  fs.rmSync(base,{recursive:true,force:true});
});

test('private folders are refused even when the served root contains them',async()=>{
  const {base,root}=fixture();
  await withServer(root,async origin=>{
    for(const url of ['/private/secret.txt','/study-space/private/secret.txt','/source/a.md','/.git/config','/reports/r.json','/node_modules/x/index.js','/PRIVATE/secret.txt','/study-space/Source/a.md']){
      assert.equal(await rawStatus(origin,url),404,url);
    }
  });
  fs.rmSync(base,{recursive:true,force:true});
});

test('encoded traversal and links that leave the root are refused',async()=>{
  const {base,root}=fixture();
  await withServer(root,async origin=>{
    for(const url of ['/..%2Foutside/secret.txt','/study-space/%2e%2e/outside/secret.txt','/%2e%2e%5coutside%5csecret.txt','/data/..%2F..%2Foutside/secret.txt','/link/secret.txt','/study-space/link/secret.txt','/%E0%A4%A']){
      assert.equal(await rawStatus(origin,url),404,url);
    }
  });
  fs.rmSync(base,{recursive:true,force:true});
});

test('the default root is dist and the server binds to loopback only',()=>{
  assert.equal(defaultRoot({}),path.resolve('dist'));
  assert.equal(defaultRoot({SITE_DIR:'somewhere'}),path.resolve('somewhere'));
  assert.match(fs.readFileSync(new URL('../../scripts/serve.mjs',import.meta.url),'utf8'),/listen\(port,'127\.0\.0\.1'/);
});
