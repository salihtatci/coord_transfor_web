import { DATA } from './data.js';
import { ELLIPSOIDS,SYSTEMS,geodeticToECEF,ecefToGeodetic,convertDatum,framePath,registered7 } from './engine.js';
const $=id=>document.getElementById(id);
const escapeText=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n=(value,digits=4)=>Number(value).toLocaleString('tr-TR',{minimumFractionDigits:digits,maximumFractionDigits:digits,useGrouping:true});
const fmtPlain=(value,d=9)=>Number(value).toFixed(d);
let lastResult=null;
let lastCopyText='';
function num(id){const raw=$(id).value.trim().replace(/\s/g,'').replace(',','.');if(!raw)throw new Error('Lütfen boş koordinat/parametre alanlarını doldurun.');const val=Number(raw);if(!Number.isFinite(val))throw new Error(`Geçersiz sayı: ${id}`);return val;}
function optionHTML(obj){return Object.keys(obj).map(x=>`<option value="${escapeText(x)}">${escapeText(x)}</option>`).join('');}
$('geo-ellipsoid').innerHTML=optionHTML(ELLIPSOIDS);
$('geo-ellipsoid').value='GRS80';
$('datum-from').innerHTML=optionHTML(SYSTEMS);
$('datum-to').innerHTML=optionHTML(SYSTEMS);
$('datum-from').value='WGS84 (G2139)';
$('datum-to').value='ITRF96';
const PAIRS=[['tx','Tx (m)'],['ty','Ty (m)'],['tz','Tz (m)'],['d','D (ppm)'],['rx','Rx (″)'],['ry','Ry (″)'],['rz','Rz (″)'],['xm','Xm (m)'],['ym','Ym (m)'],['zm','Zm (m)']];
$('param-grid').innerHTML=PAIRS.map(([id,label])=>`<div class="field"><label for="param-${id}">${label}</label><input id="param-${id}" type="text" inputmode="decimal" placeholder="${label}" value=""></div>`).join('');
const xyzLabels=['X','Y','Z'];
function clearResultError(error){
  $('result-main').innerHTML=`<div class="empty-result"><div class="empty-icon" style="color:#eeaa90">!</div><h3>Hesaplama yapılamadı</h3><p>${escapeText(error.message||error)}</p></div>`;
  $('copy-result').disabled=true;$('download-result').disabled=true;lastResult=null;
}
function resultCoords(title,labels,values,decimals){return `<div class="result-success"><div class="result-eyebrow">DÖNÜŞÜM TAMAMLANDI</div><h3>${escapeText(title)}</h3><div class="result-coords">${labels.map((label,i)=>`<div class="result-coord"><span>${escapeText(label)}</span><strong>${n(values[i],decimals[i])}</strong></div>`).join('')}</div>`;}
function secondaryGroup(title,rows){return `<section class="result-secondary"><h4>${escapeText(title)}</h4><div class="secondary-grid">${rows.map(([a,b])=>`<div>${escapeText(a)}<strong>${escapeText(b)}</strong></div>`).join('')}</div></section>`;}
function message(text,isError=false){return `<div class="result-message${isError?' error':''}">${escapeText(text)}</div>`;}
function saveResult(object,copyText){lastResult=object;lastCopyText=copyText;$('copy-result').disabled=false;$('download-result').disabled=false;}
function calcGeo(evt){evt?.preventDefault();try{
  const ellipsoid=$('geo-ellipsoid').value,reverse=$('geo-direction').value==='reverse';
  const coords=[num('geo-a'),num('geo-b'),num('geo-c')];
  const out=reverse?ecefToGeodetic(...coords,ellipsoid):geodeticToECEF(...coords,ellipsoid);
  let html;
  if(reverse){
    html=resultCoords('Coğrafi koordinatlar',['φ · Enlem (°)','λ · Boylam (°)','h · Yükseklik (m)'],out,[9,9,4]);
    html+=secondaryGroup('Girdi · Kartezyen',[['X (m)',n(coords[0],4)],['Y (m)',n(coords[1],4)],['Z (m)',n(coords[2],4)],['Elipsoit',ellipsoid]]);
  }else{
    html=resultCoords('Kartezyen koordinatlar',['X (m)','Y (m)','Z (m)'],out,[4,4,4]);
    html+=secondaryGroup('Girdi · Coğrafi', [['φ (°)',n(coords[0],8)],['λ (°)',n(coords[1],8)],['h (m)',n(coords[2],4)],['Elipsoit',ellipsoid]]);
  }
  const back=reverse?geodeticToECEF(...out,ellipsoid):ecefToGeodetic(...out,ellipsoid);
  const closure=back.map((v,i)=>v-coords[i]);
  const closureText=reverse?`${n(Math.hypot(...closure)*1000,6)} mm`: `Δφ ${n(closure[0],11)}° · Δλ ${n(closure[1],11)}° · Δh ${n(closure[2]*1000,6)} mm`;
  html+=message(`İleri–ters kapanma kontrolü: ${closureText}. Hesaplamada ${ellipsoid} elipsoidi kullanıldı.`);
  $('result-main').innerHTML=html+'</div>';
  $('result-mode-label').textContent=reverse?'ECEF → GEO':'GEO → ECEF';
  saveResult({operation:reverse?'ECEF_TO_GEODETIC':'GEODETIC_TO_ECEF',ellipsoid,source:coords,result:out},`${reverse?'φ, λ, h':'X, Y, Z'}\n${out.join(', ')}`);
}catch(err){clearResultError(err);}}
function updateGeoLabels(){const reverse=$('geo-direction').value==='reverse';
  if(reverse){$('geo-l1').innerHTML='X <em>(m)</em>';$('geo-l2').innerHTML='Y <em>(m)</em>';$('geo-l3').innerHTML='Z <em>(m)</em>';
    ['4116037.2588','2656358.3524','4072204.7958'].forEach((v,i)=>$(['geo-a','geo-b','geo-c'][i]).value=v);
  }else{$('geo-l1').innerHTML='Enlem φ <em>(°)</em>';$('geo-l2').innerHTML='Boylam λ <em>(°)</em>';$('geo-l3').innerHTML='Yükseklik h <em>(m)</em>';
    ['41.0082','28.9784','50'].forEach((v,i)=>$(['geo-a','geo-b','geo-c'][i]).value=v);}
}
function updateDatumLabels(){const geo=$('datum-input-type').value==='geo';
  if(geo){$('datum-l1').innerHTML='φ Enlem <em>(°)</em>';$('datum-l2').innerHTML='λ Boylam <em>(°)</em>';$('datum-l3').innerHTML='h <em>(m)</em>';['41.0082','28.9784','50'].forEach((v,i)=>$(['datum-a','datum-b','datum-c'][i]).value=v);
  }else{$('datum-l1').innerHTML='X <em>(m)</em>';$('datum-l2').innerHTML='Y <em>(m)</em>';$('datum-l3').innerHTML='Z <em>(m)</em>';['4116037.2588','2656358.3524','4072204.7958'].forEach((v,i)=>$(['datum-a','datum-b','datum-c'][i]).value=v);}
}
function updateParameterPreview(){
  const from=$('datum-from').value,to=$('datum-to').value,model=$('datum-model').value;
  const is7=['BURSA_WOLF','MOLODENSKY_BADEKAS'].includes(model);const manual=$('manual-toggle').checked;
  $('epoch-field').classList.toggle('hidden',!['IERS14','HELMERT7'].includes(model));
  $('manual-option').classList.toggle('hidden',!is7);
  $('manual-fields').classList.toggle('hidden',!is7||!manual);
  ['xm','ym','zm'].forEach(id=>{const input=$('param-'+id);input.disabled=model!=='MOLODENSKY_BADEKAS';input.parentElement.classList.toggle('hidden',model!=='MOLODENSKY_BADEKAS');});
  const box=$('parameter-preview');
  box.className='parameter-preview';
  if(from===to){box.innerHTML='<div class="preview-title">Aynı referans sistemi</div><p class="preview-description">Datum dönüşümü uygulanmaz, giriş koordinatı aynen korunur.</p>';$('datum-submit').disabled=false;return;}
  if(is7){
    const rec=registered7(from,to,model);
    if(manual){box.innerHTML='<div class="preview-title">◉ Manuel parametre girişi</div><p class="preview-description">Kaynak-hedef için geçerli Tx, Ty, Tz, D, Rx, Ry, Rz değerlerini ve dönüklük konvansiyonunu siz girin. Kullanıcı parametrelerinin doğruluğu burada kontrol edilemez.</p>';
      $('datum-submit').disabled=false;
    }else if(rec){box.innerHTML=`<div class="preview-title"><span>✓ Hazır parametre bulundu</span><span>${escapeText(rec.code||'')}</span></div><p class="preview-description">${escapeText(rec.reverse?'Ters yönde uygulanacak. ':'')}${escapeText(rec.note||'')}</p><div class="param-source">Kaynak: ${escapeText(rec.source)} · ${rec.params.map((p,i)=>`${['Tx','Ty','Tz','D','Rx','Ry','Rz'][i]} ${p}`).join(' · ')}</div>`;$('datum-submit').disabled=false;
    }else{box.classList.add('warn');box.innerHTML='<div class="preview-title">Parametre kaydı bulunamadı</div><p class="preview-description">Seçtiğiniz datum çifti ve yöntem için doğrulanmış hazır parametre yok. Manuel parametre girişi açılmadan hesaplama yapılmaz.</p>';$('datum-submit').disabled=true;}
  }else{
    const path=framePath(from,to);
    if(path===null){box.classList.add('warn');box.innerHTML='<div class="preview-title">Dönüşüm zinciri bulunamadı</div><p class="preview-description">Bu sistem çifti için kayıtlı IERS/EUREF dönüşüm yolu yok. Yanlış parametre veya özdeşlik varsayılmayacak.</p>';$('datum-submit').disabled=true;}
    else{const approx=path.some(p=>p.edge.approx);box.innerHTML=`<div class="preview-title">✓ ${path.length} adımlı dönüşüm zinciri</div><p class="preview-description">${escapeText([from,...path.map(p=>p.to)].join(' → '))}</p><div class="param-source">${model==='IERS14'?'Parametreler ölçü epoğuna taşınır.':'Her adımın sabit referans epoğu kullanılır (hızsız eğitim karşılaştırması).'}${approx?' · WGS84–ITRF yaklaşık özdeşliği içeriyor.':''}</div>`;$('datum-submit').disabled=false;}
  }
}
function calcDatum(evt){evt?.preventDefault();try{
  const from=$('datum-from').value,to=$('datum-to').value,model=$('datum-model').value,epoch=['IERS14','HELMERT7'].includes(model)?num('datum-epoch'):2025;
  const coordinates=[num('datum-a'),num('datum-b'),num('datum-c')];
  let manual=null;
  if(['BURSA_WOLF','MOLODENSKY_BADEKAS'].includes(model)&&$('manual-toggle').checked){
    const params=['tx','ty','tz','d','rx','ry','rz'].map(id=>num('param-'+id));
    const center=model==='MOLODENSKY_BADEKAS'?['xm','ym','zm'].map(id=>num('param-'+id)):[0,0,0];
    manual={params,center,convention:$('manual-convention').value,reverse:$('manual-inverse').checked};
  }
  const r=convertDatum({from,to,model,epoch,inputType:$('datum-input-type').value,coordinates,manual});
  let html=resultCoords('Hedef Kartezyen koordinatlar',['X₂ (m)','Y₂ (m)','Z₂ (m)'],r.xyz,[4,4,4]);
  html+=secondaryGroup(`Hedef coğrafi · ${SYSTEMS[to]}`,[['φ (°)',n(r.geodetic[0],9)],['λ (°)',n(r.geodetic[1],9)],['h (m)',n(r.geodetic[2],4)],['Kaynak elipsoit',SYSTEMS[from]]]);
  html+=secondaryGroup('Kartezyen farklar', [['ΔX (m)',n(r.delta[0],5)],['ΔY (m)',n(r.delta[1],5)],['ΔZ (m)',n(r.delta[2],5)],['3B fark büyüklüğü',n(Math.hypot(...r.delta),5)+' m']]);
  if(r.details.type==='frame'){
    const {steps}=r.details;
    html+='<section class="result-secondary"><h4>Kullanılan dönüşüm yolu</h4><div class="step-list">';
    for(const [i,s] of steps.entries()){
      html+=`<details ${i===0?'open':''}><summary>${escapeText(s.from)} → ${escapeText(s.to)}${s.approx?' (yaklaşık)':''}</summary><pre>Kaynak: ${escapeText(s.source)}\nEpok: ${s.epoch.toFixed(2)}\nT (mm): ${s.params.Tmm.map(v=>v.toFixed(4)).join(', ')}\nD (ppb): ${s.params.Dppb.toFixed(5)}\nR (mas): ${s.params.Rmas.map(v=>v.toFixed(5)).join(', ')}\n${s.direction===-1?'Matrisin tersi uygulanmıştır.':'İleri dönüşüm uygulanmıştır.'}</pre></details>`;
    }
    html+='</div></section>';
    if(steps.some(s=>s.approx))html+=message('Bu hesap zinciri yaklaşık WGS84–ITRF özdeşlik kabulü içerir; milimetrik doğruluk iddiası değildir.');
    if(model==='HELMERT7')html+=message('Hızsız karşılaştırma: Her adım kendi t₀ referans epoğunda hesaplandı. Bu, aynı epoktaki IERS 14-parametre dönüşümüyle eşdeğer değildir.');
  }else if(r.details.type==='seven'){
    const p=r.details.record;
    html+=message(`Parametre kaynağı: ${p.source} (${p.code||'manuel'}) · ${p.reverse?'Ters':'İleri'} yön · ${p.convention}. ${p.accuracy?`Kaynak doğruluğu: ${p.accuracy}. `:''}${p.note||''}`);
  }
  if(from==='ITRF96'||to==='ITRF96')html+=message('ITRF96 çıktısı girilen koordinat epoğundadır; bu işlem tek başına TUREF 2005.0 epok kaydırması yapmaz.');
  if(from==='WGS84 (ensemble)'||to==='WGS84 (ensemble)')html+=message('WGS84 ensemble birden çok gerçekleşimi temsil eder. Hassas uygulamalarda gerçekleşim ve epok ayrıca tanımlanmalıdır.');
  if(r.details.type==='identity')html+=message('Kaynak ve hedef aynıdır; datum/çerçeve dönüşümü yapılmadı.');
  $('result-main').innerHTML=html+'</div>';
  $('result-mode-label').textContent='3D DATUM / ECEF';
  saveResult({operation:'DATUM_TRANSFORMATION',from,to,model,epoch,source:coordinates,inputType:$('datum-input-type').value,result: r.xyz,geodetic:r.geodetic,delta:r.delta,details:r.details}, `${from} → ${to}\nModel: ${model}\nXYZ: ${r.xyz.join(', ')}\nφλh: ${r.geodetic.join(', ')}`);
}catch(err){clearResultError(err);}}
for(const btn of document.querySelectorAll('[data-panel]'))btn.addEventListener('click',()=>{
  const tab=btn.dataset.panel;
  document.querySelectorAll('[data-panel]').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));});
  $('geo-form').classList.toggle('hidden',tab!=='geo');$('datum-form').classList.toggle('hidden',tab!=='datum');
  $('result-mode-label').textContent=tab==='geo'?'GEO / ECEF':'3D DATUM / ECEF';
  $('result-main').innerHTML='<div class="empty-result"><div class="empty-icon">⌖</div><h3>Hesaplamaya hazırsınız</h3><p>Koordinatlarınızı girip dönüşüm işlemini başlatın.</p></div>';
  $('copy-result').disabled=true;$('download-result').disabled=true;lastResult=null;
});
$('geo-form').addEventListener('submit',calcGeo);
$('datum-form').addEventListener('submit',calcDatum);
$('geo-direction').addEventListener('change',updateGeoLabels);
$('datum-input-type').addEventListener('change',updateDatumLabels);
$('swap-datums').addEventListener('click',()=>{const a=$('datum-from').value;$('datum-from').value=$('datum-to').value;$('datum-to').value=a;updateParameterPreview();});
for(const id of ['datum-from','datum-to','datum-model'])$(id).addEventListener('change',()=>{
  // Never silently carry custom parameters from a previous datum pair or model.
  $('manual-toggle').checked=false;
  PAIRS.forEach(([key])=>$('param-'+key).value='');
  updateParameterPreview();
});
$('manual-toggle').addEventListener('change',updateParameterPreview);
$('datum-epoch').addEventListener('input',updateParameterPreview);
$('copy-result').addEventListener('click',async()=>{
  if(!lastResult)return;
  try{await navigator.clipboard.writeText(lastCopyText);$('copy-result').textContent='Kopyalandı ✓';setTimeout(()=>$('copy-result').textContent='Kopyala ↗',1600);}catch(e){window.prompt('Sonucu kopyalayın:',lastCopyText);}
});
$('download-result').addEventListener('click',()=>{
  if(!lastResult)return;
  const blob=new Blob([JSON.stringify({...lastResult,exportedAt:new Date().toISOString(),tool:'GEO532 Web'},null,2)],{type:'application/json'});
  const href=URL.createObjectURL(blob),a=document.createElement('a');a.href=href;a.download='geo532-hesaplama.json';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(href);
});
updateParameterPreview();
calcGeo();
