/* ----------------------------------------------------------
  script.js
  - Plug your cricket API key and endpoints below.
  - If no API is provided, the page will show mock data.
-----------------------------------------------------------*/

/* ========== CONFIG ========== */
/* Choose provider (for production use get API key and endpoint) */
/* Example: SportMonks: https://sportmonks.com/ (paid tiers) */
/* RapidAPI marketplace has free trial endpoints you can use for prototyping. */

const CONFIG = {
  // If you have a provider, set provider:'sportmonks' and fill apiKey.
  provider: '', // '' | 'sportmonks' | 'rapidapi'
  apiKey: '',   // YOUR API KEY HERE (do NOT commit to public repo)
  rapidapiHost: '', // for RapidAPI providers (if used)
  useMock: true // set false when you configure real API
};

/* ========== UTIL ========== */
const $ = id => document.getElementById(id);
const asHtml = html => {
  const d = document.createElement('div'); d.innerHTML = html; return d.firstChild;
};

document.getElementById('year').textContent = new Date().getFullYear();

/* ========== MOCK DATA (used if no API) ========== */
const mockLive = [
  { id:1, local:"India", visitor:"Australia", status:"LIVE - 3rd over", scores:"45/1 (3.4)"},
  { id:2, local:"England", visitor:"Pakistan", status:"LIVE - 12th over", scores:"86/3 (11.2)"}
];
const mockFixtures = [
  { id:11, local:"India", visitor:"New Zealand", date:"2025-09-01", time:"3:30 PM"},
  { id:12, local:"Sri Lanka", visitor:"Bangladesh", date:"2025-08-24", time:"9:30 AM"}
];
const mockNews = [
  { id:101, title:"India name 15-man squad for T20 series", excerpt:"Selectors named a 15-man squad with youngsters included.", url:"#"},
  { id:102, title:"Rohit hits another century in domestic final", excerpt:"A masterful 120* guided his side to victory.", url:"#"}
];

/* ========== UI RENDER ========== */
function renderLive(list){
  const container = $('liveList');
  container.innerHTML = '';
  if(!list || list.length===0){
    container.innerHTML = '<p>No live matches right now</p>'; return;
  }
  list.forEach(m=>{
    const node = document.createElement('div');
    node.className = 'match';
    node.innerHTML = `
      <div class="teams">
        <div class="team">
          <div class="name">${m.local}</div>
          <div class="score">${m.localScore || m.scores || ''}</div>
        </div>
        <div class="team">
          <div class="name">${m.visitor}</div>
          <div class="score">${m.visitorScore || ''}</div>
        </div>
      </div>
      <div class="meta">${m.status || ''}</div>
    `;
    container.appendChild(node);
  });
}
function renderFixtures(list){
  const container = $('fixturesList');
  container.innerHTML = '';
  list.forEach(f=>{
    const card = document.createElement('div'); card.className='match';
    card.innerHTML = `<strong>${f.local} vs ${f.visitor}</strong><div class="meta">${f.date} • ${f.time}</div>`;
    container.appendChild(card);
  });
}
function renderNews(list){
  const container = $('newsList');
  container.innerHTML = '';
  list.forEach(n=>{
    const c = document.createElement('article'); c.className='card';
    c.innerHTML = `<h4>${n.title}</h4><p>${n.excerpt}</p><p class="meta"><a href="${n.url}" target="_blank">Read more</a></p>`;
    container.appendChild(c);
  });
}

/* ========== API FETCHERS (example stubs) ========== */
async function fetchLiveFromAPI(){
  // TODO: implement provider logic
  // SportMonks example (replace with your api token):
  // const url = `https://cricket.sportmonks.com/api/v2.0/fixtures/now?api_token=${CONFIG.apiKey}&include=localteam,visitorteam`;
  // let res = await fetch(url); let json = await res.json(); return json.data
  return null;
}
async function fetchFixturesFromAPI(){
  return null;
}
async function fetchNewsFromAPI(){
  // Example: use NewsAPI or custom news source.
  return null;
}

/* ========== Bootstrapping ========== */
async function init(){
  // Live Scores
  if(CONFIG.useMock){
    renderLive(mockLive);
    $('featuredScore').innerHTML = `<div class="match"><div class="teams"><div class="team"><div class="name">${mockLive[0].local}</div><div class="score">${mockLive[0].scores}</div></div><div class="team"><div class="name">${mockLive[0].visitor}</div></div></div><div class="meta">${mockLive[0].status}</div></div>`;
    renderFixtures(mockFixtures);
    renderNews(mockNews);
  } else {
    try{
      const live = await fetchLiveFromAPI();
      if(live && live.length) {
        renderLive(live);
        $('featuredScore').innerHTML = ''; // render first match
      } else {
        renderLive([]);
        $('featuredScore').innerHTML = '<div class="loader">No live matches</div>';
      }
      const fixtures = await fetchFixturesFromAPI();
      renderFixtures(fixtures || []);
      const news = await fetchNewsFromAPI();
      renderNews(news || []);
    }catch(err){
      console.error(err);
      // fall back to mock
      renderLive(mockLive);
      renderFixtures(mockFixtures);
      renderNews(mockNews);
    }
  }
}
init();

/* ========== Interactions ========== */
document.getElementById('refreshNews').addEventListener('click', async ()=>{
  $('newsList').innerHTML = '<p class="loader">Refreshing...</p>';
  if(CONFIG.useMock){ renderNews(mockNews); return; }
  const n = await fetchNewsFromAPI(); renderNews(n || mockNews);
});
document.getElementById('themeBtn').addEventListener('click', ()=>{
  const root = document.documentElement;
  if(root.style.getPropertyValue('--bg') === '#0b0f0b'){
    // switch to light
    root.style.setProperty('--bg','#f7fdf7');
    root.style.setProperty('--card','#fff');
    root.style.setProperty('--text','#12211a');
    document.getElementById('themeBtn').textContent = 'Dark';
  } else {
    root.style.setProperty('--bg','#0b0f0b');
    root.style.setProperty('--card','#0f1b17');
    root.style.setProperty('--text','#cfe6d6');
    document.getElementById('themeBtn').textContent = 'Light';
  }
});
