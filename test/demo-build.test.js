import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { readBuildInfo, stampBuild } from '../scripts/demo-build.js';
async function fixture(fn) {
 const root=await mkdtemp(resolve(tmpdir(),'fitpilot-build-'));
 try {
  await mkdir(resolve(root,'apps/mobile/dist-demo'),{recursive:true});
  await writeFile(resolve(root,'apps/mobile/App.js'),'export default 1;');
  await writeFile(resolve(root,'package-lock.json'),'{}');
  await writeFile(resolve(root,'apps/mobile/dist-demo/index.html'),'<html>client</html>');
  await fn(root);
 } finally { await rm(root,{recursive:true,force:true}); }
}
test('an existing unstamped client bundle is rebuilt',()=>fixture(async root=>{
 assert.equal((await readBuildInfo(root)).needsBuild,true);
}));
test('unchanged stamped sources reuse the build, generated files do not invalidate it',()=>fixture(async root=>{
 const info=await readBuildInfo(root);await stampBuild(root,info);
 assert.equal((await readBuildInfo(root)).needsBuild,false);
 await writeFile(resolve(root,'apps/mobile/dist-demo/generated.js'),'generated output');
 assert.equal((await readBuildInfo(root)).needsBuild,false);
}));
test('changed client code or lockfile invalidates the bundle',()=>fixture(async root=>{
 await stampBuild(root,await readBuildInfo(root));
 await writeFile(resolve(root,'apps/mobile/App.js'),'export default 2;');
 assert.equal((await readBuildInfo(root)).needsBuild,true);
 await stampBuild(root,await readBuildInfo(root));
 await writeFile(resolve(root,'package-lock.json'),'{"updated":true}');
 assert.equal((await readBuildInfo(root)).needsBuild,true);
}));
test('broken build metadata or missing HTML triggers a rebuild',()=>fixture(async root=>{
 await writeFile(resolve(root,'apps/mobile/dist-demo/fitpilot-build.json'),'bad JSON');
 assert.equal((await readBuildInfo(root)).needsBuild,true);
 await stampBuild(root,await readBuildInfo(root));
 await rm(resolve(root,'apps/mobile/dist-demo/index.html'));
 assert.equal((await readBuildInfo(root)).needsBuild,true);
}));
test('a build cannot be stamped if the sources changed while it was compiling',()=>fixture(async root=>{
 const info=await readBuildInfo(root);
 await writeFile(resolve(root,'apps/mobile/App.js'),'changed during export');
 await assert.rejects(stampBuild(root,info),/changed during build/);
}));
