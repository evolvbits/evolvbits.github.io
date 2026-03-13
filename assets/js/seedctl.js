function initActiveSections(a){const t=[...document.querySelectorAll(a)];if(!t.length)return;const o=t.map(s=>({link:s,el:document.getElementById((s.getAttribute("href")||"").replace(/^#/,""))})).filter(s=>s.el);if(!o.length)return;const n=150;function c(){let s=null;for(const{link:i,el:l}of o)l.getBoundingClientRect().top<=n&&(s=i);o.forEach(({link:i})=>i.classList.remove("is-active")),s&&s.classList.add("is-active")}window.addEventListener("scroll",c,{passive:!0}),c()}initActiveSections(".topbar nav a"),initActiveSections(".sidebar a");const revealEls=document.querySelectorAll(".reveal"),parallaxEls=document.querySelectorAll("[data-parallax]"),observer=new IntersectionObserver(a=>{a.forEach(t=>{t.isIntersecting&&t.target.classList.add("is-visible")})},{threshold:.14});revealEls.forEach(a=>observer.observe(a));let ticking=!1;const prefersReduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches,isMobile=window.matchMedia("(max-width: 991.98px)").matches,disableParallax=prefersReduced||isMobile;function onScroll(){disableParallax||ticking||(window.requestAnimationFrame(()=>{const a=window.scrollY;parallaxEls.forEach(t=>{const o=Number(t.dataset.parallax||.16),n=a*o;t.style.transform=`translate3d(0, ${n}px, 0)`}),ticking=!1}),ticking=!0)}disableParallax?parallaxEls.forEach(a=>{a.style.transform="translate3d(0, 0, 0)"}):(window.addEventListener("scroll",onScroll,{passive:!0}),onScroll());class VideoPlayer extends HTMLElement{connectedCallback(){const t=this.dataset.video,o=this.dataset.thumb,n=this.dataset.label||"Play video",c=this.dataset.button||"Play";this.innerHTML=`
      <div class="video-wrapper">

        <div class="video-skeleton"></div>

        <img
          class="video-thumb"
          src="${o}"
          alt="${n}"
          loading="lazy"
          decoding="async"
        >

        <button class="video-play" aria-label="${n}">
          <div class="button-play-wrapper">
            <span class="video-play-icon"></span>
            <span class="video-play-text">${c}</span>
          </div>
        </button>

      </div>
    `;const s=this.querySelector(".video-wrapper"),i=this.querySelector(".video-play"),l=this.querySelector(".video-skeleton"),d=this.querySelector(".video-thumb"),r=()=>{l&&l.isConnected&&l.remove()};d&&(d.addEventListener("load",r,{once:!0}),d.addEventListener("error",r,{once:!0}),d.complete&&r());const v=()=>{if(s.classList.contains("playing"))return;s.classList.add("playing"),r();let e;if(t.includes("youtube")||t.includes("youtu.be")){const u=t.split("v=")[1]?.split("&")[0]||t.split("/").pop();e=document.createElement("iframe"),e.src=`https://www.youtube.com/embed/${u}?autoplay=1&rel=0`,e.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",e.allowFullscreen=!0,e.addEventListener("load",r,{once:!0})}else e=document.createElement("video"),e.src=t,e.controls=!0,e.autoplay=!0,e.playsInline=!0,e.preload="metadata",e.addEventListener("loadeddata",r,{once:!0});s.appendChild(e)};i.addEventListener("click",v),new IntersectionObserver(e=>{e.forEach(u=>{if(!u.isIntersecting){const p=s.querySelector("video");p&&p.pause()}})},{threshold:.1}).observe(s)}}customElements.define("video-player",VideoPlayer);
