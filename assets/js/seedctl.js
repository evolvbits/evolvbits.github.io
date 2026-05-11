function initActiveSections(c){const e=[...document.querySelectorAll(c)];if(!e.length)return;const o=e.map(t=>({link:t,el:document.getElementById((t.getAttribute("href")||"").replace(/^#/,""))})).filter(t=>t.el);if(!o.length)return;const s=150;function i(){let t=null;for(const{link:a,el:l}of o)l.getBoundingClientRect().top<=s&&(t=a);o.forEach(({link:a})=>a.classList.remove("is-active")),t&&t.classList.add("is-active")}window.addEventListener("scroll",i,{passive:!0}),i()}initActiveSections(".topbar nav a"),initActiveSections(".sidebar a");class VideoPlayer extends HTMLElement{connectedCallback(){const e=this.dataset.video,o=this.dataset.thumb,s=this.dataset.label||"Play video",i=this.dataset.button||"Play";this.innerHTML=`
      <div class="video-wrapper">

        <div class="video-skeleton"></div>

        <img
          class="video-thumb"
          src="${o}"
          alt="${s}"
          loading="lazy"
          decoding="async"
        >

        <button class="video-play" aria-label="${s}">
          <div class="button-play-wrapper">
            <span class="video-play-icon"></span>
            <span class="video-play-text">${i}</span>
          </div>
        </button>

      </div>
    `;const t=this.querySelector(".video-wrapper"),a=this.querySelector(".video-play"),l=this.querySelector(".video-skeleton"),d=this.querySelector(".video-thumb"),r=()=>{l&&l.isConnected&&l.remove()};d&&(d.addEventListener("load",r,{once:!0}),d.addEventListener("error",r,{once:!0}),d.complete&&r());const v=()=>{if(t.classList.contains("playing"))return;t.classList.add("playing"),r();let n;if(e.includes("youtube")||e.includes("youtu.be")){const u=e.split("v=")[1]?.split("&")[0]||e.split("/").pop();n=document.createElement("iframe"),n.src=`https://www.youtube.com/embed/${u}?autoplay=1&rel=0`,n.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",n.allowFullscreen=!0,n.addEventListener("load",r,{once:!0})}else n=document.createElement("video"),n.src=e,n.controls=!0,n.autoplay=!0,n.playsInline=!0,n.preload="metadata",n.addEventListener("loadeddata",r,{once:!0});t.appendChild(n)};a.addEventListener("click",v),new IntersectionObserver(n=>{n.forEach(u=>{if(!u.isIntersecting){const p=t.querySelector("video");p&&p.pause()}})},{threshold:.1}).observe(t)}}customElements.define("video-player",VideoPlayer),document.addEventListener("click",function(c){const e=c.target.closest(".copy-btn");if(!e)return;const o=e.closest(".command-wrapper");if(!o)return;const s=o.querySelector(".command-block");if(!s)return;const i=s.textContent.replace(/\$/g,"").replace(/PS>/g,"").trim();navigator.clipboard.writeText(i).then(()=>{const t=e.innerHTML;e.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>',e.classList.add("copied"),setTimeout(()=>{e.innerHTML=t,e.classList.remove("copied")},2e3)})});
