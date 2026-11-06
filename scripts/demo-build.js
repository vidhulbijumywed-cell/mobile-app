import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import release from '../apps/mobile/release.json' with { type: 'json' };
export const DEMO_RELEASE = release.name;
const ignored = new Set(['node_modules','.expo','dist','dist-web','dist-native','dist-demo']);
async function sourceFiles(directory) {
  const entries = await readdir(directory,{withFileTypes:true});
  const files=[];
  for(const entry of entries) {
    if(ignored.has(entry.name)) continue;
    const path=resolve(directory,entry.name);
    if(entry.isDirectory()) files.push(...await sourceFiles(path));
    else if(entry.isFile()) files.push(path);
    else throw new Error('Unsupported entry in mobile sources; cannot verify the demo build');
  }
  return files;
}
export async function clientFingerprint(root) {
  const files=[...await sourceFiles(resolve(root,'apps/mobile')),resolve(root,'package-lock.json')];
  const hash=createHash('sha256').update('fitpilot-web-build-v1|api=/api|'+DEMO_RELEASE);
  for(const file of files.sort((a,b)=>relative(root,a).replaceAll('\\','/').localeCompare(relative(root,b).replaceAll('\\','/'),'en'))) {
    const bytes=await readFile(file);
    hash.update(relative(root,file).replaceAll('\\','/')).update('\0').update(String(bytes.length)).update('\0').update(bytes);
  }
  return hash.digest('hex');
}
export async function readBuildInfo(root) {
  const sourceHash=await clientFingerprint(root);
  try {
    const stamp=JSON.parse(await readFile(resolve(root,'apps/mobile/dist-demo/fitpilot-build.json'),'utf8'));
    const index=await readFile(resolve(root,'apps/mobile/dist-demo/index.html'));
    return {version:DEMO_RELEASE,sourceHash,needsBuild:stamp.sourceHash!==sourceHash||stamp.version!==DEMO_RELEASE||!index.length};
  } catch(error) {
    if(error.code==='ENOENT'||error instanceof SyntaxError) return {version:DEMO_RELEASE,sourceHash,needsBuild:true};
    throw error;
  }
}
export async function stampBuild(root, info) {
  if(await clientFingerprint(root)!==info.sourceHash) throw new Error('Client sources changed during build. Run npm run demo again.');
  await writeFile(resolve(root,'apps/mobile/dist-demo/fitpilot-build.json'),JSON.stringify({version:info.version,sourceHash:info.sourceHash})+'\n');
}
