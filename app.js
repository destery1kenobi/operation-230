/* ============ DATA ============ */
const MEALS = {
  B1:{t:'Egg scramble + toast',d:'3 eggs + 4 whites, 1 slice 45-cal toast, ½ cup cottage cheese',cal:420,pro:48},
  B2:{t:'Yogurt power bowl',d:'12 oz Greek yogurt, 2 tbsp PB powder, ½ banana, honey',cal:400,pro:42},
  L1:{t:'Chicken & rice bowl',d:'6 oz chicken, 1 cup rice, 1 cup green beans, hot sauce',cal:525,pro:58},
  L2:{t:'Chicken burrito',d:'5 oz chicken, tortilla, ¼ cup cheese, salsa, ½ cup rice',cal:585,pro:55},
  D1:{t:'Beef & rice skillet',d:'6 oz 93% beef, 1 cup rice, 1 cup veg',cal:585,pro:50},
  D2:{t:'Air-fryer chicken plate',d:'7 oz chicken, 1 cup rice, 1.5 cups veg',cal:590,pro:63},
  D3:{t:'Beef & egg fried rice',d:'5 oz beef, 2 eggs, 1 cup rice, 1 cup veg, soy sauce',cal:675,pro:52}
};
const SNACKS = {
  mousse:{t:'Cottage cheese chocolate mousse',cal:180,pro:22},
  mug:{t:'Protein mug cake',cal:230,pro:30},
  bark:{t:'Frozen yogurt bark',cal:150,pro:15},
  whip:{t:'Whipped cottage cheese + berries',cal:160,pro:20}
};
const LIFTS = {
  A:{tag:'Strength A',name:'Push + Legs',ex:['Leg press — 3×10-12','Chest press — 3×10-12','Shoulder press — 3×10-12','Triceps pushdown — 3×12','Dumbbell curls — 3×10-12']},
  B:{tag:'Strength B',name:'Pull + Legs',ex:['Lat pulldown — 3×10-12','Seated cable row — 3×10-12','Leg curl — 3×12','Calf raise — 3×15','Concentration curls — 3×10-12']},
  C:{tag:'Strength C',name:'Full body',ex:['Goblet squat — 3×10','Incline press — 3×10-12','Cable row — 3×12','Lateral raise — 3×12-15','Alt. dumbbell curls — 3×12']}
};
const DAYS = [
  {k:'MON',name:'Monday',tag:'Strength A',b:'B1',l:'L1',d:'D2',s:'mousse',lift:'A'},
  {k:'TUE',name:'Tuesday',tag:'Walk + Recover',b:'B2',l:'L1',d:'D1',s:'mug',lift:null},
  {k:'WED',name:'Wednesday',tag:'Strength B',b:'B1',l:'L2',d:'D2',s:'bark',lift:'B'},
  {k:'THU',name:'Thursday',tag:'Weigh-in + Walk',b:'B2',l:'L1',d:'D3',s:'mousse',lift:null,weigh:true},
  {k:'FRI',name:'Friday',tag:'Strength C',b:'B1',l:'L2',d:'D1',s:'mug',lift:'C'},
  {k:'SAT',name:'Saturday',tag:'Optional Lift',b:'B2',l:'L1',d:'D2',s:'whip',lift:'A',optional:true},
  {k:'SUN',name:'Sunday',tag:'Batch Cook',b:'B1',l:'L1',d:'D3',s:'bark',lift:null,cook:true}
];
const RANKS = [[0,'TENDERFOOT'],[500,'SCOUT'],[1500,'PATHFINDER'],[3500,'TRAILBLAZER'],[7000,'RELIC HUNTER'],[12000,'EXPEDITION LEAD'],[20000,'LEGEND']];
const FIELD_NOTES = ['Camp made before dark.','Trail cleared, full pack.','Ground covered, ledger closed.','Route held to the line today.','Base camp would be proud.','Fire\u2019s lit, boots off \u2014 day\u2019s done right.','Every waypoint logged. Well traveled.','The map matches the miles today.','No detours. Straight to the finish flag.','Provisions held, pace held, day held.','Compass true all day long.','Ledger squared before the sun set.','A clean page in the field journal.','Ration and route, both accounted for.','Ridge to river, nothing left undone.','The trail behind is fully marked.','Steady hands, steady miles.','Full route, full pack, full credit.','Tomorrow\u2019s trail starts from solid ground.','Another flag planted at the finish.'];
const HALF_NOTES = ['Halfway to camp \u2014 keep pace.','Crested the ridge, downhill from here.','Halfway there. Steady on.','Base camp is closer than the start now.','The lake\u2019s behind you \u2014 press on.','Midpoint marked. Legs still good.','Halfway flag planted. Don\u2019t ease up.','The hard half is done.','Trail\u2019s turning toward the finish now.','Halfway rations, full resolve.','You\u2019ve earned the view from here.','Second half starts stronger.','The map says you\u2019re right on pace.','Halfway \u2014 and the weather\u2019s holding.','Momentum\u2019s with you past the midpoint.','Halfway home, boots still steady.','The hardest climb\u2019s behind you.','Route\u2019s half-drawn \u2014 keep the line true.','Halfway there, and worth the trip so far.','Past the ridge, finish flag in sight.'];
const STORAGE_KEY='op230:field-journal:v2';

function iso(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function weekdayIdx(dateKey){return (new Date(dateKey+'T12:00').getDay()+6)%7;}
function daysAgo(n){const d=new Date();d.setDate(d.getDate()-n);return iso(d);}
function isDateKey(k){return /^\d{4}-\d{2}-\d{2}$/.test(k);}
function todayKey(){return iso(new Date());}

function buildItems(i){
  const D=DAYS[i];
  const morning=[
    {id:'pill',p:15,anchor:true,title:'Levothyroxine + full glass of water'},
    {id:'coffee',p:5,title:'Coffee — after the 60-minute wait'},
    {id:'b',p:10,title:'Breakfast — '+MEALS[D.b].t}
  ];
  if(D.weigh)morning.push({id:'weigh',p:20,act:'weigh',title:'Weigh in — before food'});
  const daytime=[{id:'l',p:10,title:'Lunch — '+MEALS[D.l].t}];
  if(D.lift){const L=LIFTS[D.lift];daytime.push({id:'lift',p:25,anchor:true,title:(D.optional?'Optional — ':'')+L.tag+': '+L.name});}
  else if(D.cook){daytime.push({id:'walk',p:15,title:'Easy walk — light day'});}
  else{daytime.push({id:'walk',p:15,title:'Walk — no lifting today'});}
  daytime.push({id:'steps',p:15,isAuto:true,title:'8,000 steps'});
  if(D.cook)daytime.push({id:'batch',p:30,anchor:true,title:'Sunday batch cook — ~90 min'});
  const evening=[
    {id:'d',p:10,title:'Dinner — '+MEALS[D.d].t},
    {id:'snack',p:5,title:'Sweet — '+SNACKS[D.s].t},
    {id:'protein',p:15,isAuto:true,title:'Protein floor — 180g'},
    {id:'log',p:10,title:'Log everything you ate'},
    {id:'sleep',p:10,title:'7+ hours of sleep'}
  ];
  return morning.concat(daytime,evening);
}

/* ============ STATE ============ */
let S;
function freshState(){
  const tKey=todayKey();
  const prevKey=daysAgo(1);
  const prevChecks={};
  buildItems(weekdayIdx(prevKey)).forEach(x=>{prevChecks[x.id]=true;});
  return {
    checks:{[prevKey]:prevChecks,[tKey]:{pill:true,coffee:true}},
    food:{[tKey]:[{name:'Greek yogurt cup',cal:150,pro:17}]},
    water:{[tKey]:3},steps:{[tKey]:4200},
    weights:[{d:daysAgo(21),lb:268},{d:daysAgo(14),lb:264},{d:daysAgo(7),lb:261}],
    perfectDays:{[prevKey]:true},
    completeIdx:0,halfIdx:0
  };
}
function filterDateKeys(obj){
  if(!obj||typeof obj!=='object'||Array.isArray(obj))return {};
  const out={};Object.keys(obj).forEach(k=>{if(isDateKey(k))out[k]=obj[k];});
  return out;
}
function loadState(){
  const s=freshState();
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    if(raw){
      const saved=JSON.parse(raw);
      s.checks={...s.checks,...filterDateKeys(saved.checks)};
      s.food={...s.food,...filterDateKeys(saved.food)};
      s.water={...s.water,...filterDateKeys(saved.water)};
      s.steps={...s.steps,...filterDateKeys(saved.steps)};
      s.weights=Array.isArray(saved.weights)?saved.weights.filter(w=>w&&isDateKey(w.d)):s.weights;
      s.perfectDays={...s.perfectDays,...filterDateKeys(saved.perfectDays)};
      s.completeIdx=saved.completeIdx||0;
      s.halfIdx=saved.halfIdx||0;
    }
  }catch(e){}
  return s;
}
function persist(){
  try{
    localStorage.setItem(STORAGE_KEY,JSON.stringify({
      checks:S.checks,food:S.food,water:S.water,steps:S.steps,
      weights:S.weights,perfectDays:S.perfectDays,completeIdx:S.completeIdx,halfIdx:S.halfIdx
    }));
  }catch(e){}
}

/* ============ SCORING ============ */
function scoreFor(dateKey){
  const items=buildItems(weekdayIdx(dateKey));const c=S.checks[dateKey]||{};
  let got=0,max=0,done=0;items.forEach(x=>{max+=x.p;if(c[x.id]){got+=x.p;done++;}});
  return {got,max,done,total:items.length};
}
function totalPts(){
  let t=0;
  Object.keys(S.checks).filter(isDateKey).forEach(k=>{t+=scoreFor(k).got;});
  return t+Object.keys(S.perfectDays).filter(isDateKey).length*50;
}
function streakCount(){
  let n=0;const d=new Date();
  for(let i=0;i<400;i++){
    const key=iso(d);const{got,max}=scoreFor(key);
    if(got>=max*0.7)n++;else break;
    d.setDate(d.getDate()-1);
  }
  return n;
}
function rankOf(p){let r=RANKS[0][1];RANKS.forEach(([m,name])=>{if(p>=m)r=name;});return r;}

/* ============ DOM HELPERS ============ */
const $=id=>document.getElementById(id);
let toastTimer,stampTimer;
function showToast(msg){
  const t=$('toast');t.textContent=msg;t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),2400);
}

/* ============ RENDER: TODAY ============ */
function renderToday(){
  const tKey=todayKey();
  const D=DAYS[weekdayIdx(tKey)];
  const sc=scoreFor(tKey);
  const pct=sc.max?Math.round(sc.got/sc.max*100):0;
  const checks=S.checks[tKey]||{};

  $('dayName').innerHTML=D.name+' <small>TODAY</small>';
  $('dayTag').textContent=D.tag.toUpperCase();
  $('streakText').textContent=streakCount()+' day streak';
  $('dayBar').style.width=pct+'%';
  $('dayCount').textContent=sc.done+' of '+sc.total+' logged';
  $('dayPct').textContent=pct+'%';
  $('sealBadge').classList.toggle('hidden',!(sc.got>=sc.max));

  const items=buildItems(weekdayIdx(tKey));
  $('itemList').innerHTML=items.map(x=>{
    const isOn=!!checks[x.id];
    return `<div class="item ${x.anchor?'anchor':''} ${isOn?'on':''}" data-id="${x.id}" data-auto="${!!x.isAuto}" data-act="${x.act||''}">
      <div class="box" data-box="${x.id}"><svg viewBox="0 0 24 24" fill="none" stroke="#F4ECDD" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div>
      <h3>${x.title}</h3>
    </div>`;
  }).join('');

  $('itemList').querySelectorAll('.item').forEach(el=>{
    const id=el.dataset.id;
    const isAuto=el.dataset.auto==='true';
    const act=el.dataset.act;
    el.querySelector('[data-box]').onclick=(e)=>{e.stopPropagation();if(act==='weigh'){openWeighModal();return;}applyToggle(id,el.querySelector('.box svg'));};
    el.onclick=()=>{
      if(isAuto){setTab('log');return;}
      if(act==='weigh'){openWeighModal();return;}
      applyToggle(id,el.querySelector('.box svg'));
    };
  });
}
function applyToggle(id,svgEl){
  const key=todayKey();
  const before={...(S.checks[key]||{})};
  const dayChecks={...before};
  const wasOn=!!dayChecks[id];
  if(wasOn)delete dayChecks[id];else dayChecks[id]=true;
  const list=buildItems(weekdayIdx(key));
  let gotBefore=0,gotAfter=0,max=0;
  list.forEach(x=>{max+=x.p;if(before[x.id])gotBefore+=x.p;if(dayChecks[x.id])gotAfter+=x.p;});
  S.checks={...S.checks,[key]:dayChecks};
  if(gotAfter>=max)S.perfectDays={...S.perfectDays,[key]:true};else{const pd={...S.perfectDays};delete pd[key];S.perfectDays=pd;}
  persist();
  renderAll();
  if(!wasOn){
    const nowPerfect=gotAfter>=max;
    const wasHalfBefore=gotBefore>=max*0.5;
    const isHalfAfter=gotAfter>=max*0.5;
    if(nowPerfect){
      const note=FIELD_NOTES[S.completeIdx%FIELD_NOTES.length];
      S.completeIdx++;persist();
      openCelebModal('complete',note);
    }else if(isHalfAfter&&!wasHalfBefore){
      const note=HALF_NOTES[S.halfIdx%HALF_NOTES.length];
      S.halfIdx++;persist();
      openCelebModal('halfway',note);
    }
    if(svgEl){svgEl.classList.add('stamp');setTimeout(()=>svgEl.classList.remove('stamp'),650);}
  }
}
function setTab(tab){
  document.querySelectorAll('.tab-page').forEach(p=>p.classList.remove('on'));
  $('page-'+tab).classList.add('on');
  document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.tab===tab));
  if(tab==='log')renderLog();
  if(tab==='lifts')renderLifts();
  if(tab==='trends')renderTrends();
}
document.addEventListener('DOMContentLoaded',()=>{
  $('nav').querySelectorAll('button').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
  $('sealBadge').onclick=()=>openCelebModal('complete',S._lastNote||FIELD_NOTES[0]);
});

/* ============ RENDER: LOG ============ */
function renderLog(){
  const tKey=todayKey();
  const food=S.food[tKey]||[];
  const calNum=food.reduce((t,f)=>t+f.cal,0);
  const proNum=food.reduce((t,f)=>t+f.pro,0);
  $('calNum').innerHTML=calNum+'<small>/2100</small>';
  $('proNum').innerHTML=proNum+'<small>/195g</small>';
  $('calBar').style.width=Math.min(100,Math.round(calNum/2100*100))+'%';
  $('proBar').style.width=Math.min(100,Math.round(proNum/195*100))+'%';

  const D=DAYS[weekdayIdx(tKey)];
  const chips=[
    {label:'Breakfast: '+MEALS[D.b].t,cal:MEALS[D.b].cal,pro:MEALS[D.b].pro},
    {label:'Lunch: '+MEALS[D.l].t,cal:MEALS[D.l].cal,pro:MEALS[D.l].pro},
    {label:'Dinner: '+MEALS[D.d].t,cal:MEALS[D.d].cal,pro:MEALS[D.d].pro},
    {label:'Snack: '+SNACKS[D.s].t,cal:SNACKS[D.s].cal,pro:SNACKS[D.s].pro}
  ];
  $('chips').innerHTML=chips.map((c,i)=>`<div class="chip" data-i="${i}"><div class="cl"><b>${c.label}</b><i>${c.cal} cal · ${c.pro}g protein</i></div><div class="plus">+</div></div>`).join('');
  $('chips').querySelectorAll('.chip').forEach(el=>el.onclick=()=>{const c=chips[+el.dataset.i];addFood(c.label,c.cal,c.pro);});

  $('foodList').innerHTML=food.length?food.map((f,i)=>`<div class="logline"><div><b>${f.name}</b><i>${f.cal} cal · ${f.pro}g</i></div><button data-del="${i}">×</button></div>`).join(''):'<div class="empty">Nothing logged yet today</div>';
  $('foodList').querySelectorAll('button').forEach(b=>b.onclick=()=>deleteFood(+b.dataset.del));

  const water=S.water[tKey]||0;
  let gh='';for(let n=1;n<=8;n++)gh+=`<div class="glass ${n<=water?'full':''}" data-n="${n}"><i style="height:${n<=water?100:0}%"></i></div>`;
  $('glasses').innerHTML=gh;
  $('wctr').textContent=water+' of 8 glasses';
  $('glasses').querySelectorAll('.glass').forEach(el=>el.onclick=()=>setWater(+el.dataset.n));

  const steps=S.steps[tKey]||0;
  $('stepNow').textContent=steps.toLocaleString();
  $('stepBadge').innerHTML=steps>=8000?'<span style="color:#7A8F5E;font-family:\'IBM Plex Mono\',monospace;font-size:12px">✓ GOAL</span>':'';
}
function addFood(name,cal,pro){
  const key=todayKey();
  const list=S.food[key]||[];
  const beforePro=list.reduce((t,f)=>t+f.pro,0);
  S.food={...S.food,[key]:[...list,{name,cal:+cal||0,pro:+pro||0}]};
  const afterPro=beforePro+(+pro||0);
  const dayChecks={...(S.checks[key]||{})};
  if(afterPro>=180)dayChecks.protein=true;else delete dayChecks.protein;
  S.checks={...S.checks,[key]:dayChecks};
  persist();renderAll();
  if(afterPro>=180&&beforePro<180)showToast('Protein floor hit · +15');
}
function deleteFood(idx){
  const key=todayKey();
  const list=(S.food[key]||[]).filter((_,i)=>i!==idx);
  S.food={...S.food,[key]:list};
  const pro=list.reduce((t,f)=>t+f.pro,0);
  const dayChecks={...(S.checks[key]||{})};
  if(pro>=180)dayChecks.protein=true;else delete dayChecks.protein;
  S.checks={...S.checks,[key]:dayChecks};
  persist();renderAll();
}
function setWater(n){
  const key=todayKey();
  const cur=S.water[key]||0;
  S.water={...S.water,[key]:(cur===n)?n-1:n};
  persist();renderLog();
}
$('fAdd')?.addEventListener('click',()=>{});
document.addEventListener('DOMContentLoaded',()=>{
  $('fAdd').onclick=()=>{
    const cal=$('fCal').value,pro=$('fPro').value;
    if(!cal&&!pro){showToast('Enter calories or protein');return;}
    addFood($('fName').value.trim()||'Food',cal,pro);
    $('fName').value='';$('fCal').value='';$('fPro').value='';
  };
  $('stepSave').onclick=()=>{
    const v=parseInt($('stepIn').value,10);
    if(isNaN(v)||v<0){showToast('Enter a step count');return;}
    const key=todayKey();
    const wasGoal=(S.steps[key]||0)>=8000;
    S.steps={...S.steps,[key]:v};
    const dayChecks={...(S.checks[key]||{})};
    if(v>=8000)dayChecks.steps=true;else delete dayChecks.steps;
    S.checks={...S.checks,[key]:dayChecks};
    persist();renderAll();
    $('stepIn').value='';
    if(v>=8000&&!wasGoal)showToast('8,000 steps · +15');
  };
});

/* ============ RENDER: LIFTS ============ */
function renderLifts(){
  $('liftCards').innerHTML=Object.keys(LIFTS).map(k=>{
    const L=LIFTS[k];
    const days=DAYS.filter(d=>d.lift===k).map(d=>d.name.slice(0,3)+(d.optional?' (opt)':'')).join(' · ');
    return `<div class="lift-card">
      <div class="lh"><h2>${L.tag}</h2><span class="ldays">${days}</span></div>
      <div class="lname">${L.name}</div>
      ${L.ex.map(e=>`<div class="lex">${e}</div>`).join('')}
    </div>`;
  }).join('');
}

/* ============ RENDER: TRENDS ============ */
function renderTrends(){
  const tp=totalPts();
  $('tRank').textContent=rankOf(tp);
  $('tTotal').textContent=tp;
  $('tStreak').textContent=streakCount();
  $('tPerfect').textContent=Object.keys(S.perfectDays).filter(isDateKey).length;

  const W=S.weights;
  if(!W.length){$('chartStat').textContent='Log your weight to start the chart.';$('chart').innerHTML='';}
  else{
    $('chartStat').innerHTML='Now <b>'+W[W.length-1].lb+' lb</b>';
    $('chart').innerHTML=weightChart(W);
  }

  const dates=new Set([...Object.keys(S.checks),...Object.keys(S.food),...Object.keys(S.water),...Object.keys(S.steps)].filter(isDateKey));
  const sorted=[...dates].sort().reverse().slice(0,60);
  const rows=sorted.map(dateKey=>{
    const hsc=scoreFor(dateKey);
    const dd=new Date(dateKey+'T12:00');
    const code=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][(dd.getDay()+6)%7];
    const pct=hsc.max?Math.round(hsc.got/hsc.max*100):0;
    return {code,short:(dd.getMonth()+1)+'/'+dd.getDate(),pct,ptsText:hsc.got+'/'+hsc.max+' pts'+(hsc.got>=hsc.max?' · PERFECT':'')};
  }).filter(r=>r.pct>0);
  $('history').innerHTML=rows.length?rows.map(h=>`<div class="histrow"><div class="hd"><u>${h.code}</u><s>${h.short}</s></div><div class="hmid"><div class="hbar"><i style="width:${h.pct}%"></i></div><small>${h.ptsText}</small></div></div>`).join(''):'<div class="empty">Your logged days will show up here</div>';
}
function weightChart(W){
  const w=300,h=140,pad=24;
  const lbs=W.map(p=>p.lb);
  let yMin=Math.min(230,...lbs)-3,yMax=Math.max(270,...lbs)+3;
  const X=i=>W.length===1?w/2:pad+(w-2*pad)*i/(W.length-1);
  const Y=v=>h-pad-(h-2*pad)*(v-yMin)/(yMax-yMin);
  const pts=W.map((p,i)=>X(i)+','+Y(p.lb));
  const goalY=Y(230);
  const dots=W.map((p,i)=>`<circle cx="${X(i)}" cy="${Y(p.lb)}" r="4" fill="#8A5A2B"/>`).join('');
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto;display:block">
    <line x1="${pad}" y1="${goalY}" x2="${w-pad}" y2="${goalY}" stroke="#7A8F5E" stroke-width="1.5" stroke-dasharray="5 4"/>
    <text x="${w-pad}" y="${goalY-6}" fill="#7A8F5E" font-size="11" font-family="monospace" text-anchor="end">GOAL 230</text>
    ${W.length>1?`<polyline points="${pts.join(' ')}" fill="none" stroke="#8A5A2B" stroke-width="2.5" stroke-linejoin="round"/>`:''}
    ${dots}
    <text x="${pad}" y="16" fill="#7A6A4E" font-size="11" font-family="monospace">${Math.round(yMax)}</text>
    <text x="${pad}" y="${h-pad+16}" fill="#7A6A4E" font-size="11" font-family="monospace">${Math.round(yMin)}</text>
  </svg>`;
}
document.addEventListener('DOMContentLoaded',()=>{
  $('logw').onclick=()=>openWeighModal();
  $('reset').onclick=()=>{
    S={checks:{},food:{},water:{},steps:{},weights:[],perfectDays:{},completeIdx:S.completeIdx,halfIdx:S.halfIdx};
    persist();setTab('today');renderAll();
    closeWeighModal();closeCelebModal();
  };
});

/* ============ MODALS ============ */
function openWeighModal(){
  $('weighInput').value='';
  $('weighScrim').classList.add('show');
  $('weighModal').classList.add('show');
}
function closeWeighModal(){
  $('weighScrim').classList.remove('show');
  $('weighModal').classList.remove('show');
}
function submitWeighIn(){
  const lb=parseFloat($('weighInput').value);
  if(isNaN(lb)||lb<150||lb>500){showToast('Enter 150–500');return;}
  const key=todayKey();
  S.weights=S.weights.filter(w=>w.d!==key).concat([{d:key,lb}]).sort((a,b)=>a.d<b.d?-1:1);
  persist();
  closeWeighModal();
  applyToggle('weigh',null);
}
function openCelebModal(type,note){
  const tKey=todayKey();
  const D=DAYS[weekdayIdx(tKey)];
  $('celebHeading').textContent=type==='halfway'?'HALFWAY THERE':'JOURNEY COMPLETE';
  $('celebDay').textContent=D.name;
  $('celebMap').src=type==='halfway'?'assets/journey-map-halfway.png':'assets/journey-map-complete.png';
  $('celebSeal').style.display=type==='halfway'?'none':'block';
  $('celebNote').textContent=note;
  S._lastNote=note;
  $('celebStreak').textContent=streakCount()+' day streak';
  $('celebScrim').classList.add('show');
  $('celebModal').classList.add('show');
}
function closeCelebModal(){
  $('celebScrim').classList.remove('show');
  $('celebModal').classList.remove('show');
}
document.addEventListener('DOMContentLoaded',()=>{
  $('weighScrim').onclick=closeWeighModal;
  $('weighCancel').onclick=closeWeighModal;
  $('weighSave').onclick=submitWeighIn;
  $('celebScrim').onclick=closeCelebModal;
  $('celebContinue').onclick=closeCelebModal;
});

/* ============ INIT ============ */
function renderAll(){renderToday();const onLog=$('page-log').classList.contains('on');const onLifts=$('page-lifts').classList.contains('on');const onTrends=$('page-trends').classList.contains('on');if(onLog)renderLog();if(onLifts)renderLifts();if(onTrends)renderTrends();}
document.addEventListener('DOMContentLoaded',()=>{
  S=loadState();
  renderAll();
});
