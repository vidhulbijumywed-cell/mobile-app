import { createServer } from 'node:http';
import { readFile, access } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { spawnSync } from 'node:child_process';
import pg from 'pg';
import { Service, passwordHash } from '../apps/api/service.js';
import { createApi } from '../apps/api/server.js';
if (process.env.NODE_ENV === 'production') throw new Error('Fictional local demo only');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:fitpilot-local-only@127.0.0.1:54329/fitpilot';
const root = new pg.Pool({ connectionString });
try { await root.query('SELECT 1'); } catch (error) {
  await root.end();
  if (process.env.DATABASE_URL) throw error;
  const result = spawnSync('docker',['compose','up','-d','--wait','db'],{stdio:'inherit'});
  if(result.status !== 0) throw new Error('Start Docker and retry npm run demo');
}
const adminPool = new pg.Pool({ connectionString });
await adminPool.query('CREATE SCHEMA IF NOT EXISTS fitpilot_demo'); await adminPool.end();
const pool = new pg.Pool({connectionString,options:'-c search_path=fitpilot_demo'});
await pool.query(await readFile(new URL('../apps/api/schema.sql',import.meta.url),'utf8'));
const password='FitPilotDemo2026!';
const users=[['00000000-0000-4000-8000-000000000001','admin@fitpilot.test','admin'],['00000000-0000-4000-8000-000000000002','coach@fitpilot.test','coach'],['00000000-0000-4000-8000-000000000003','client@fitpilot.test','client']];
for(const [id,email,role] of users) await pool.query('INSERT INTO users VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING',[id,email,role,passwordHash(password)]);
const client=users[2][0],coach=users[1][0];
await pool.query("INSERT INTO assignments VALUES($1,$2,'training') ON CONFLICT DO NOTHING",[client,coach]);
await pool.query('INSERT INTO assessments(client_id,answers) VALUES($1,$2) ON CONFLICT DO NOTHING',[client,{displayName:'Alex (fictional)',goal:'Build a consistent training routine',trainingHistory:'Beginner',availability:'Three evenings each week',equipment:'Bodyweight and dumbbells',dietaryPreferences:'Vegetarian'}]);
await pool.query('INSERT INTO programme_revisions(client_id,revision,title,exercises,created_by) VALUES($1,1,$2,$3,$4) ON CONFLICT DO NOTHING',[client,'Foundation practice workout',JSON.stringify([{id:'exercise-1',name:'Chair squat',sets:2,reps:8,restSeconds:60},{id:'exercise-2',name:'Wall push-up',sets:2,reps:10,restSeconds:60}]),coach]);
const web=resolve('apps/mobile/dist-demo');
try { await access(resolve(web,'index.html')); } catch {
  const built=spawnSync(process.platform==='win32'?'npm.cmd':'npm',['run','export:web','--workspace','@fitpilot/mobile','--','--output-dir','dist-demo','--clear'],{stdio:'inherit',env:{...process.env,CI:'1',EXPO_NO_TELEMETRY:'1',EXPO_OFFLINE:'1',EXPO_PUBLIC_API_URL:'/api'}});
  if(built.status!==0) throw new Error('Demo client bundle failed');
}
const api=createApi(new Service(pool));
const server=createServer(async(req,res)=>{
  const path=new URL(req.url,'http://localhost').pathname;
  if(path==='/api'||path.startsWith('/api/')) { req.url=req.url.slice(4)||'/'; api.emit('request',req,res); return; }
  if(/^\/(coach|auth|invitations|assignments|clients|me|directory|workout-sets)(\/|$)/.test(path)) { api.emit('request',req,res);return; }
  try {
    let file;
    if(path==='/') file=new URL('../apps/demo/index.html',import.meta.url);
    else if(path==='/client'||path==='/client/') file=resolve(web,'index.html');
    else if(path.startsWith('/_expo/')) { file=resolve(web,'.'+decodeURIComponent(path));if(!file.startsWith(web+'/')){res.writeHead(403).end();return;} }
    else {res.writeHead(404).end();return;}
    const extension=extname(String(file));res.setHeader('Content-Type',extension==='.js'?'text/javascript':extension==='.css'?'text/css':'text/html');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
    res.end(await readFile(file));
  } catch {res.writeHead(404).end();}
});
server.listen(3001,'127.0.0.1',()=>console.log('FitPilot demo ready on loopback port 3001. Open the root page for the client and coach entry points. Fictional data only.'));
for(const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>server.close(async()=>{await pool.end();try{await root.end();}catch{}process.exit(0);}));
