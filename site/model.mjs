export const ROOMS = {piano:'Music room',living:'Living room',kitchen:'Kitchen',other:'Elsewhere'};
export const STATUSES = {idea:'An idea',planned:'Up next',done:'Done'};
export const OCCASIONS = {games:'Game night',music:'An evening of music',quiet:'Books & a quiet catch-up'};
export const STARTER_PROJECTS = [
  {id:'mauve-swatches',title:'Compare mauve paint swatches',room:'piano',status:'idea',note:'Starter idea: try a few samples in the room and look at them in both daylight and lamplight. The direction is moody mauve, with warm wood and soft lighting.'},
  {id:'listening-corner',title:'Plan the listening corner',room:'piano',status:'idea',note:'Starter idea: measure for two lounge chairs and a small round table. Keep a clear route between the foyer and kitchen.'},
  {id:'living-rug',title:'Try a rug with the green sofas',room:'living',status:'idea',note:'Starter idea: collect rug options with muted jewel tones that work with the green sofas and orangish hardwood floors.'},
  {id:'tv-wall',title:'Map the TV wall',room:'living',status:'idea',note:'Starter idea: sketch the TV on the left wall while keeping the fireplace as part of the room. Check sightlines from the sofas.'},
  {id:'backsplash',title:'Make a backsplash shortlist',room:'kitchen',status:'idea',note:'Starter idea: compare tile shapes, colors, and grout with the existing countertops. Keep the appliances and counters in the plan.'},
  {id:'cabinet-color',title:'Compare cabinet colors',room:'kitchen',status:'idea',note:'Starter idea: try cabinet-color samples alongside the backsplash shortlist, then choose handles that tie the palette together.'}
];
export function freshNotebook(){return {version:1,projects:STARTER_PROJECTS.map(p=>({...p})),evening:{occasion:'games',guests:4,checked:[],generated:false}};}
export function validateNotebook(value){
  if(!value||value.version!==1||!Array.isArray(value.projects)||value.projects.length>500)throw new Error('Choose a Figbridge notebook export with up to 500 projects.');
  const ids=new Set();
  const projects=value.projects.map(p=>{
    if(!p||typeof p.id!=='string'||!p.id||p.id.length>150||ids.has(p.id)||typeof p.title!=='string'||!p.title.trim()||p.title.length>120||!Object.hasOwn(ROOMS,p.room)||!Object.hasOwn(STATUSES,p.status)||typeof p.note!=='string'||p.note.length>2000)throw new Error('This file contains a project Figbridge cannot read. Your current notebook is unchanged.');
    ids.add(p.id);return {id:p.id,title:p.title.trim(),room:p.room,status:p.status,note:p.note};
  });
  const e=value.evening;
  if(!e||!Object.hasOwn(OCCASIONS,e.occasion)||!Number.isInteger(e.guests)||e.guests<2||e.guests>12||!Array.isArray(e.checked)||e.checked.length>10||!e.checked.every(x=>Number.isInteger(x)&&x>=0&&x<5)||typeof e.generated!=='boolean')throw new Error('This file contains an evening plan Figbridge cannot read. Your current notebook is unchanged.');
  return {version:1,projects,evening:{occasion:e.occasion,guests:e.guests,checked:[...new Set(e.checked)],generated:e.generated}};
}
export function planTasks(occasion,guests){
  if(occasion==='music')return [`Arrange ${guests} comfortable seats with a clear path around the piano.`,`Choose a few pieces or a short playlist to start the evening.`,`Set drinks and a simple snack on side tables away from the piano.`,`Turn on the lamps and leave room for conversation between songs.`,`Give Berry and Daisy a quiet place to retreat.`];
  if(occasion==='quiet')return [`Make a comfortable spot for ${guests}, with a lamp close by.`,`Choose a book to swap or a crochet project to bring along.`,`Set out mugs, something to drink, and an easy snack.`,`Leave the schedule open: reading, making, or just catching up.`,`Leave a quiet corner for Berry and Daisy.`];
  return [`Clear a playing surface and pull up ${guests} seats.`,`Pick one quick opening game and one longer option.`,`Set out a shareable snack and drinks for ${guests}.`,`Leave room in the plan for a break and another round.`,`Give Berry and Daisy a quiet place away from the game table.`];
}
