import { DATA } from './data.js';

export const ELLIPSOIDS = DATA.ellipsoids;
export const SYSTEMS = DATA.systems;
export const ARC_SECOND = Math.PI / (180*3600);
export const MAS_RAD = ARC_SECOND/1000;
const deg2rad = x => x*Math.PI/180;
const rad2deg = x => x*180/Math.PI;

export function geodeticToECEF(lat,lon,h,ellipsoid='GRS80') {
  const el=ELLIPSOIDS[ellipsoid];
  if (!el) throw new Error('Bilinmeyen elipsoit.');
  for (const n of [lat,lon,h]) if (!Number.isFinite(n)) throw new Error('Geçersiz sayısal koordinat.');
  if (Math.abs(lat)>90 || Math.abs(lon)>180) throw new Error('Enlem -90° ile 90°, boylam -180° ile 180° arasında olmalı.');
  const [a,invf]=el, f=1/invf, e2=f*(2-f), p=deg2rad(lat), l=deg2rad(lon), sin=Math.sin(p),cos=Math.cos(p);
  const N=a/Math.sqrt(1-e2*sin*sin);
  return [(N+h)*cos*Math.cos(l),(N+h)*cos*Math.sin(l),(N*(1-e2)+h)*sin];
}
export function ecefToGeodetic(X,Y,Z,ellipsoid='GRS80') {
  const el=ELLIPSOIDS[ellipsoid];
  if (!el) throw new Error('Bilinmeyen elipsoit.');
  for (const n of [X,Y,Z]) if (!Number.isFinite(n)) throw new Error('Geçersiz sayısal koordinat.');
  const [a,invf]=el, f=1/invf,b=a*(1-f),e2=f*(2-f), ep2=e2/(1-e2);
  const p=Math.hypot(X,Y),lon=Math.atan2(Y,X);
  if(p<1e-9){if(Math.abs(Z)<1e-9)throw new Error('Dünya merkezinde coğrafi koordinat tekil tanımlı değil.');return [rad2deg(Math.sign(Z)*Math.PI/2),rad2deg(lon),Math.abs(Z)-b];}
  if(Math.hypot(p,Z)<1e6) throw new Error('Dünya merkezine yakın konumda güvenilir coğrafi dönüşüm yapılamıyor.');
  let theta=Math.atan2(Z*a,p*b);
  const phi0=Math.atan2(Z+ep2*b*Math.sin(theta)**3,p-e2*a*Math.cos(theta)**3);
  let phi=phi0;
  for(let i=0;i<20;i++){
    const N=a/Math.sqrt(1-e2*Math.sin(phi)**2);
    const h=p/Math.cos(phi)-N;
    const next=Math.atan2(Z,p*(1-e2*N/(N+h)));
    if(!Number.isFinite(next)) break;
    if(Math.abs(next-phi)<1e-14){phi=next;break;}
    phi=next;
  }
  const sin=Math.sin(phi), N=a/Math.sqrt(1-e2*sin*sin);
  const h=p*Math.cos(phi)+Z*sin-a*a/N;
  return [rad2deg(phi),rad2deg(lon),h];
}
export function matVec(M,x){return M.map(row=>row.reduce((v,a,i)=>v+a*x[i],0));}
export function inv3(m){
  const [a,b,c]=m[0],[d,e,f]=m[1],[g,h,i]=m[2];
  const A=e*i-f*h,B=f*g-d*i,C=d*h-e*g;
  const det=a*A+b*B+c*C;
  if(Math.abs(det)<1e-20)throw new Error('Dönüşüm matrisi terslenemiyor.');
  return [[A,c*h-b*i,b*f-c*e],[B,a*i-c*g,c*d-a*f],[C,b*g-a*h,a*e-b*d]].map(r=>r.map(v=>v/det));
}
function rotationSmall(rx,ry,rz,convention='PV'){
  const s=convention==='CF'?-1:1;
  const x=rx*ARC_SECOND*s,y=ry*ARC_SECOND*s,z=rz*ARC_SECOND*s;
  return [[1,-z,y],[z,1,-x],[-y,x,1]];
}
export function transform7(X,p,model='BURSA_WOLF',center=[0,0,0],convention='PV',reverse=false){
  const [tx,ty,tz,ppm,rx,ry,rz]=p;
  if(p.length!==7||![...p,...center].every(Number.isFinite))throw new Error('Geçersiz parametre seti.');
  const k=1+ppm*1e-6;
  if(Math.abs(k)<1e-12)throw new Error('Geçersiz ölçek faktörü.');
  const R=rotationSmall(rx,ry,rz,convention);
  const M=R.map(row=>row.map(v=>v*k));
  const T=[tx,ty,tz],c=model==='MOLODENSKY_BADEKAS'?center:[0,0,0];
  if(reverse){const d=X.map((v,i)=>v-c[i]-T[i]);return matVec(inv3(M),d).map((v,i)=>v+c[i]);}
  return matVec(M,X.map((v,i)=>v-c[i])).map((v,i)=>v+c[i]+T[i]);
}
function edgeMatrix(edge,epoch,withRates=true){
  const dt=withRates?epoch-edge.t0:0;
  const T=edge.T.map((x,i)=>(x+edge.Tdot[i]*dt)/1000);
  const d=(edge.D+edge.Ddot*dt)*1e-9;
  const [rx,ry,rz]=edge.R.map((v,i)=>(v+edge.Rdot[i]*dt)*MAS_RAD);
  return {T,M:[[1+d,-rz,ry],[rz,1+d,-rx],[-ry,rx,1+d]],params:{Tmm:T.map(x=>x*1000),Dppb:d*1e9,Rmas:[rx,ry,rz].map(x=>x/MAS_RAD)},epoch:withRates?epoch:edge.t0};
}
export function framePath(from,to){
  if(from===to)return [];
  const graph={};
  for(const edge of DATA.frameTransforms){
    (graph[edge.from]??=[]).push({edge,dir:1,to:edge.to});
    (graph[edge.to]??=[]).push({edge,dir:-1,to:edge.from});
  }
  const queue=[from], seen=new Set([from]),parent=new Map();
  while(queue.length){const curr=queue.shift();if(curr===to)break;
    for(const next of graph[curr]??[]){if(!seen.has(next.to)){seen.add(next.to);parent.set(next.to,{...next,from:curr});queue.push(next.to);}}}
  if(!seen.has(to))return null;
  const path=[];for(let node=to;node!==from;){const step=parent.get(node);path.push(step);node=step.from;}
  return path.reverse();
}
export function transformFrame(X,from,to,epoch,withRates=true){
  if(!Number.isFinite(epoch)||epoch<1850||epoch>2200)throw new Error('Ölçü epoğu geçersiz.');
  const path=framePath(from,to);
  if(path===null)throw new Error('Bu çerçeve çifti için kayıtlı IERS/EUREF dönüşüm yolu bulunamadı.');
  let XYZ=X.slice();const steps=[];
  for(const s of path){const {T,M,params,epoch:usedEpoch}=edgeMatrix(s.edge,epoch,withRates);const before=XYZ;
    if(s.dir===1)XYZ=matVec(M,XYZ).map((v,i)=>v+T[i]);
    else XYZ=matVec(inv3(M),XYZ.map((v,i)=>v-T[i]));
    steps.push({from:s.from,to:s.to,source:s.edge.source,approx:s.edge.approx,direction:s.dir,params,epoch:usedEpoch,delta:XYZ.map((v,i)=>v-before[i])});
  }
  return {XYZ,steps};
}
export function registered7(from,to,model){
  let r=DATA.datumTransforms.find(x=>x.from===from&&x.to===to&&x.model===model);
  if(r)return {...r,reverse:false};
  r=DATA.datumTransforms.find(x=>x.from===to&&x.to===from&&x.model===model);
  return r?{...r,reverse:true}:null;
}
export function convertDatum({from,to,model,epoch=2025,inputType='cart',coordinates,manual=null}){
  const se=SYSTEMS[from],de=SYSTEMS[to];
  if(!se||!de)throw new Error('Kaynak veya hedef referans sistemi bilinmiyor.');
  const sourceXYZ=inputType==='geo'?geodeticToECEF(...coordinates,se):coordinates.map(Number);
  if(sourceXYZ.length!==3||sourceXYZ.some(v=>!Number.isFinite(v)))throw new Error('Üç geçerli koordinat girilmeli.');
  let xyz,details;
  if(from===to){xyz=sourceXYZ.slice();details={type:'identity',steps:[]};}
  else if(model==='IERS14'||model==='HELMERT7'){
    const r=transformFrame(sourceXYZ,from,to,epoch,model==='IERS14');xyz=r.XYZ;details={type:'frame',steps:r.steps};
  }else if(model==='BURSA_WOLF'||model==='MOLODENSKY_BADEKAS'){
    const p=manual?.params?{params:manual.params,center:manual.center||[0,0,0],convention:manual.convention||'PV',reverse:!!manual.reverse,source:'Kullanıcı tarafından girildi',code:'MANUEL',note:'Parametreler kullanıcı sorumluluğundadır.'}:registered7(from,to,model);
    if(!p)throw new Error('Bu sistem ve model için hazır parametre yok. Manuel modda doğrulanmış parametre girmen gerekiyor.');
    xyz=transform7(sourceXYZ,p.params,model,p.center,p.convention,p.reverse);
    details={type:'seven',record:p};
  }else throw new Error('Bilinmeyen dönüşüm modeli.');
  return {sourceXYZ,xyz,geodetic:ecefToGeodetic(...xyz,de),details,delta:xyz.map((v,i)=>v-sourceXYZ[i]),from,to,model,epoch};
}
