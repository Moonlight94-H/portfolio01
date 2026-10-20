const list=document.querySelector('#projectList');
const categoryFor=p=>p.name.includes('实验室')?'AI辅助设计':(p.tag.includes('舞台视觉')?'舞台视觉':(p.tag.includes('空间')?'空间设计':'品牌活动'));
projects.forEach((p,i)=>{
 const card=document.createElement('article');card.className='project-card reveal';card.tabIndex=0;card.dataset.category=categoryFor(p);
 card.innerHTML=`<a class="project-card-link" href="project.html?id=${i}" aria-label="查看${p.name}项目详情"><div class="project-image"><img src="${p.images[0]}" alt="${p.name}" loading="${i<2?'eager':'lazy'}"></div><div class="project-info"><div><h3>${p.name}</h3><div class="en">${p.en}</div></div><div class="project-meta">${String(i+1).padStart(2,'0')}<br>↗</div></div></a>`;
 list.appendChild(card);
});
const filterButtons=document.querySelectorAll('#projectFilter button');
filterButtons.forEach(btn=>btn.addEventListener('click',()=>{
 filterButtons.forEach(b=>b.classList.toggle('active',b===btn));const f=btn.dataset.filter;
 document.querySelectorAll('.project-card').forEach(card=>{card.hidden=!(f==='all'||card.dataset.category===f)});
}));
// Scroll reveal and reading progress.
const progress=document.createElement('div');progress.className='scroll-progress';document.body.appendChild(progress);
const revealTargets=document.querySelectorAll('.hero-kicker,.hero h1,.hero-bottom,.intro-line,.section-head,.project-card,.approach-card,.statement-band,.about-visual,.about-content,.contact-section h2,.email-link');
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -5% 0px'});revealTargets.forEach(el=>observer.observe(el))}else revealTargets.forEach(el=>el.classList.add('is-visible'));
function updateProgress(){const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(max>0?window.scrollY/max*100:0)+'%'}window.addEventListener('scroll',updateProgress,{passive:true});updateProgress();


// Real asset loading progress. When complete, reveal the homepage from its top cover.
(function initSiteLoader(){
 const loader=document.getElementById('siteLoader');
 if(!loader)return;
 document.body.classList.add('is-loading');
 const bar=document.getElementById('loaderBar');
 const percent=document.getElementById('loaderPercent');
 const sources=new Set();
 document.querySelectorAll('img[src]').forEach(img=>{if(img.getAttribute('src'))sources.add(img.src)});
 if(Array.isArray(window.projects)){window.projects.forEach(project=>(project.images||[]).forEach(src=>{try{sources.add(new URL(src,document.baseURI).href)}catch(e){}}))}
 const urls=[...sources];
 let done=0;let finished=false;
 const update=()=>{const value=urls.length?Math.min(100,Math.round(done/urls.length*100)):100;bar.style.width=value+'%';percent.textContent=value+'%'};
 const finish=()=>{if(finished)return;finished=true;bar.style.width='100%';percent.textContent='100%';window.scrollTo({top:0,left:0,behavior:'auto'});setTimeout(()=>{loader.classList.add('is-leaving');document.body.classList.remove('is-loading');window.scrollTo({top:0,left:0,behavior:'auto'});setTimeout(()=>loader.remove(),850)},320)};
 if(!urls.length){update();finish();return}
 urls.forEach(url=>{const image=new Image();let settledOnce=false;const settled=()=>{if(settledOnce)return;settledOnce=true;done++;update();if(done>=urls.length)finish()};image.onload=settled;image.onerror=settled;image.src=url;if(image.complete)settled()});
 // Avoid a permanently blocking screen if a browser never settles a remote image.
 setTimeout(()=>{if(!finished){done=urls.length;update();finish()}},12000);
})();
