import {ROOMS,STATUSES,OCCASIONS,freshNotebook,validateNotebook,planTasks} from './model.mjs';

const $=id=>document.getElementById(id);
const STORAGE_KEY='figbridge-notebook-v1';
let notebook=freshNotebook();
let storageWarning='';
try{const saved=localStorage.getItem(STORAGE_KEY);if(saved)notebook=validateNotebook(JSON.parse(saved));}catch{storageWarning='Saved notes could not be loaded. Export anything you add before leaving this page.';}
let statusFilter='all',roomFilter='all',toastTimer,pendingImport=null;
const roomDialog=$('room-dialog'),projectDialog=$('project-dialog'),importDialog=$('import-dialog');

function notify(message,undo){
  clearTimeout(toastTimer);const toast=$('toast');toast.querySelector('span').textContent=message;
  const button=toast.querySelector('button');button.hidden=!undo;button.onclick=undo?()=>{undo();toast.hidden=true;}:null;
  toast.hidden=false;toastTimer=setTimeout(()=>{toast.hidden=true;},undo?12000:6500);
}
function save(){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(notebook));return true;}catch{notify('Your browser could not save these edits. Export your notebook to keep a copy.');return false;}
}
function el(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;}

function renderProjects(){
  const list=$('project-list');list.replaceChildren();
  const projects=notebook.projects.filter(p=>(statusFilter==='all'||p.status===statusFilter)&&(roomFilter==='all'||p.room===roomFilter));
  for(const project of projects){
    const row=el('div','project-row'+(project.status==='done'?' is-done':''));
    const check=el('button','complete-toggle','✓');check.type='button';check.setAttribute('aria-label',(project.status==='done'?'Mark incomplete: ':'Complete: ')+project.title);check.setAttribute('aria-pressed',String(project.status==='done'));
    check.onclick=()=>{const previous=project.status;project.status=project.status==='done'?'idea':'done';const persisted=save();renderProjects();if(persisted)notify(project.status==='done'?'A little thing, done.':'Moved back to ideas.',()=>{project.status=previous;save();renderProjects();});};
    const edit=el('button','project-edit');edit.type='button';edit.setAttribute('aria-label','Edit project: '+project.title);edit.setAttribute('aria-haspopup','dialog');edit.append(el('span','project-name',project.title),el('span','project-meta',ROOMS[project.room]+' · Edit notes ↗'));edit.onclick=()=>openProject(project.id);
    row.append(check,edit,el('span','status-chip '+project.status,STATUSES[project.status]));list.append(row);
  }
  $('empty-projects').hidden=projects.length>0;
  const total=notebook.projects.length,done=notebook.projects.filter(p=>p.status==='done').length;
  $('progress-label').textContent=`${done} of ${total} projects complete`;
  $('progress-fill').style.width=(total?done/total*100:0)+'%';
  const progress=document.querySelector('.progress-track');progress.setAttribute('aria-valuemax',String(Math.max(total,1)));progress.setAttribute('aria-valuenow',String(done));progress.setAttribute('aria-valuetext',`${done} of ${total} projects complete`);
  $('project-count').textContent=`${projects.length} ${projects.length===1?'little possibility':'little possibilities'}${statusFilter!=='all'||roomFilter!=='all'?' here':''}`;
}

document.querySelectorAll('[data-status]').forEach(button=>button.addEventListener('click',()=>{statusFilter=button.dataset.status;document.querySelectorAll('[data-status]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderProjects();}));
$('room-filter').addEventListener('change',e=>{roomFilter=e.target.value;renderProjects();});

function openProject(id){
  if(!id&&notebook.projects.length>=500){notify('This notebook holds up to 500 projects. Export a copy before making more room.');return;}
  const p=notebook.projects.find(p=>p.id===id);
  $('project-dialog-title').replaceChildren(document.createTextNode(p?'Make it ':'A new '),el('em','',p?'yours.':'possibility.'));
  $('project-id').value=p?.id||'';$('project-title').value=p?.title||'';$('project-room').value=p?.room||(roomFilter!=='all'?roomFilter:'other');$('project-status').value=p?.status||'idea';$('project-note').value=p?.note||'';$('delete-project').hidden=!p;
  projectDialog.showModal();$('project-title').focus();
}
$('new-project').addEventListener('click',()=>openProject());
$('project-title').addEventListener('input',()=>{$('project-title').setCustomValidity('');});
$('project-form').addEventListener('submit',event=>{
  event.preventDefault();const title=$('project-title').value.trim();
  if(!title){$('project-title').setCustomValidity('Give this project a few words.');$('project-title').reportValidity();return;}
  const id=$('project-id').value;const existing=notebook.projects.find(p=>p.id===id);
  const project={id:id||crypto.randomUUID(),title,room:$('project-room').value,status:$('project-status').value,note:$('project-note').value.trim()};
  if(existing)Object.assign(existing,project);else notebook.projects.unshift(project);
  const persisted=save();projectDialog.close();
  // Keep a newly saved project visible even if the previous filters excluded it.
  statusFilter='all';roomFilter='all';$('room-filter').value='all';document.querySelectorAll('[data-status]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.status==='all')));
  renderProjects();if(persisted)notify(existing?'Project notes saved.':'A new possibility, saved.');
});
$('delete-project').addEventListener('click',()=>{
  const index=notebook.projects.findIndex(p=>p.id===$('project-id').value);if(index<0)return;
  const [removed]=notebook.projects.splice(index,1);const persisted=save();projectDialog.close();renderProjects();
  if(persisted)notify('Project removed.',()=>{notebook.projects.splice(index,0,removed);save();renderProjects();});
});

const roomBriefs={
  piano:{title:'The music room',tag:'MOODY & MAUVE',image:'piano.svg',intro:'An intimate music salon: a baby grand, books within reach, and somewhere comfortable to listen.',colors:['#765268','#b88e9c','#c99a45','#e4d9c6'],items:['A baby grand angled into the southwest corner.','Built-in bookshelves and a small bar along the west wall.','Two windows with soft curtains, two lounge chairs, and a small round table.','Mauve walls, warm wood floors, a cozy rug, and soft lighting.'],next:'Start with paint samples and measurements for the listening corner.'},
  living:{title:'The living room',tag:'COLOR & COMPANY',image:'living.svg',intro:'A colorful, comfortable room built around the pieces you already love, with plenty of space for game night.',colors:['#526047','#9e5d63','#c99a45','#a25e37'],items:['Keep the green sofas, with the skirts removed and short curved brown legs.','Keep the fireplace and warm, orangish hardwood floors.','Explore the TV on the left wall with comfortable sightlines.','Bring in muted jewel tones, playful patterns, and a rug that pulls them together.'],next:'Start by gathering a few rug and cushion combinations around the green sofas.'},
  kitchen:{title:'The kitchen',tag:'A FRESH PERSPECTIVE',image:'kitchen.svg',intro:'A fresh chapter through color, tile, and hardware, working with the big pieces already in place.',colors:['#667052','#ded1b8','#ba8e4d','#f4e9d6'],items:['Keep the existing appliances and countertops.','Explore cabinet colors alongside the existing counter material.','Use the backsplash as a chance to bring in character.','Finish with handles that connect the colors and materials.'],next:'Start with a small sample board: cabinet color, tile, grout, and a handle.'}
};
document.querySelectorAll('[data-room]').forEach(button=>button.addEventListener('click',()=>{
  const key=button.dataset.room,brief=roomBriefs[key],content=$('room-dialog-content');content.replaceChildren();
  const img=el('img','dialog-room-image');img.src='assets/'+brief.image;img.alt='Illustrated direction for '+brief.title.toLowerCase();
  const heading=el('h2','',brief.title);heading.id='room-dialog-title';
  content.append(img,el('p','eyebrow',brief.tag),heading,el('p','',brief.intro));
  const swatches=el('div','mini-palette');swatches.setAttribute('aria-hidden','true');brief.colors.forEach(color=>{const swatch=el('i');swatch.style.setProperty('--swatch',color);swatches.append(swatch);});content.append(swatches);
  content.append(el('h3','room-brief-title','The direction you’ve imagined'));const list=el('ul','brief-list');brief.items.forEach(item=>list.append(el('li','',item)));content.append(list,el('h3','room-brief-title','A small next step'),el('p','',brief.next));
  const action=el('div','room-dialog-link'),link=el('a','button plum','See this room’s projects ↗');link.href='#projects';link.onclick=()=>{roomFilter=key;statusFilter='all';$('room-filter').value=key;document.querySelectorAll('[data-status]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.status==='all')));renderProjects();roomDialog.close();};action.append(link);content.append(action);roomDialog.showModal();
}));

document.querySelectorAll('dialog').forEach(dialog=>{
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();});
});

function renderPlan(){
  const container=$('evening-plan'),evening=notebook.evening;container.replaceChildren();container.hidden=!evening.generated;if(!evening.generated)return;
  container.append(el('h3','',OCCASIONS[evening.occasion]),el('p','plan-subtitle',`${evening.guests} people · A little preparation, plenty of room to improvise`));
  const tasks=planTasks(evening.occasion,evening.guests);
  tasks.forEach((task,index)=>{
    const label=el('label','plan-task'),input=document.createElement('input');input.type='checkbox';input.checked=evening.checked.includes(index);
    input.addEventListener('change',()=>{evening.checked=input.checked?[...new Set([...evening.checked,index])]:evening.checked.filter(i=>i!==index);save();updatePlanProgress();});
    label.append(input,el('span','',task));container.append(label);
  });
  const progress=el('p','plan-progress');progress.id='plan-progress';container.append(progress);updatePlanProgress();
}
function updatePlanProgress(){if($('plan-progress'))$('plan-progress').textContent=`${notebook.evening.checked.length} of 5 little preparations done`;}
$('occasion').value=notebook.evening.occasion;$('guests').value=notebook.evening.guests;
$('evening-form').addEventListener('submit',event=>{
  event.preventDefault();const occasion=$('occasion').value,guests=Number($('guests').value);if(!Number.isInteger(guests)||guests<2||guests>12)return;
  const same=notebook.evening.occasion===occasion&&notebook.evening.guests===guests;
  notebook.evening={occasion,guests,checked:same?notebook.evening.checked:[],generated:true};save();renderPlan();
});

$('export').addEventListener('click',()=>{
  const blob=new Blob([JSON.stringify(notebook,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download='figbridge-notebook-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('Your notebook export is ready to download.');
});
$('import').addEventListener('click',()=>$('import-file').click());
$('import-file').addEventListener('change',async event=>{
  const file=event.target.files[0];event.target.value='';if(!file)return;
  if(file.size>2500000){notify('That file is too large. Choose a Figbridge JSON export under 2.5 MB.');return;}
  try{pendingImport=validateNotebook(JSON.parse(await file.text()));$('import-description').textContent=`This notebook contains ${pendingImport.projects.length} projects${pendingImport.evening.generated?' and an evening plan':''}.`;importDialog.showModal();}
  catch(error){pendingImport=null;notify(error instanceof SyntaxError?'This is not a readable JSON notebook. Your current notebook is unchanged.':error.message);}
});
$('cancel-import').addEventListener('click',()=>{pendingImport=null;importDialog.close();});
$('confirm-import').addEventListener('click',()=>{
  if(!pendingImport)return;const previous=notebook;notebook=pendingImport;pendingImport=null;const persisted=save();importDialog.close();$('occasion').value=notebook.evening.occasion;$('guests').value=notebook.evening.guests;renderProjects();renderPlan();
  if(persisted)notify('Notebook imported.',()=>{notebook=previous;save();$('occasion').value=notebook.evening.occasion;$('guests').value=notebook.evening.guests;renderProjects();renderPlan();});
});
renderProjects();renderPlan();if(storageWarning)notify(storageWarning);
