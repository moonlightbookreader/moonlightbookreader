// ===== MOONLIGHT BOOK READER — SHARED JAVASCRIPT =====

// ===== DATA =====
let siteData = {};
let aboutData = {};
let books = [];
let journalEntries = [];

async function loadAllData() {
  try {
    const [siteRes, aboutRes, booksRes, journalRes] = await Promise.all([
      fetch('content/site.json').catch(() => ({ json: () => ({}) })),
      fetch('content/about.json').catch(() => ({ json: () => ({}) })),
      fetch('content/books.json').catch(() => ({ json: () => ({ entries: [] }) })),
      fetch('content/journal.json').catch(() => ({ json: () => ({ entries: [] }) }))
    ]);
    
    siteData = await siteRes.json();
    aboutData = await aboutRes.json();
    const booksData = await booksRes.json();
    const journalData = await journalRes.json();
    
    books = (booksData.entries || []).sort((a, b) => new Date(b.date) - new Date(a.date));
    journalEntries = (journalData.entries || []).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return true;
  } catch (err) {
    console.error('Data loading error:', err);
    return false;
  }
}

// ===== GENERATE STARRY BACKGROUND =====
function generateStars(count = 80) {
  const bg = document.createElement('div');
  bg.className = 'stars-bg';
  
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'twinkle';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    const size = 1 + Math.random() * 2.5;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.setProperty('--dur', (2 + Math.random() * 4) + 's');
    star.style.setProperty('--delay', Math.random() * 5 + 's');
    if (Math.random() < 0.15) {
      star.style.boxShadow = `0 0 ${size * 3}px rgba(255,248,220,.5)`;
    }
    bg.appendChild(star);
  }
  
  document.body.insertBefore(bg, document.body.firstChild);
}

// ===== MOON DECORATIONS =====
function addMoonDecorations() {
  // Top-right moon
  const moon1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  moon1.setAttribute('class', 'moon-deco moon-phase-anim');
  moon1.setAttribute('style', 'top:80px;right:3%;width:90px;height:90px;position:fixed;');
  moon1.setAttribute('viewBox', '0 0 100 100');
  moon1.innerHTML = `
    <defs><radialGradient id="mg1" cx="40%" cy="40%"><stop offset="0%" stop-color="#f5e6d3"/><stop offset="100%" stop-color="#d4a857"/></radialGradient></defs>
    <circle cx="50" cy="50" r="36" fill="url(#mg1)"/>
    <circle cx="64" cy="45" r="28" fill="#150c2b"/>
  `;
  document.body.appendChild(moon1);
  
  // Bottom-right slow-spin moon
  const moon2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  moon2.setAttribute('class', 'moon-deco slow-spin');
  moon2.setAttribute('style', 'bottom:15%;right:2%;width:60px;height:60px;position:fixed;');
  moon2.setAttribute('viewBox', '0 0 100 100');
  moon2.innerHTML = `
    <circle cx="50" cy="50" r="38" fill="#f5e6d3" opacity=".6"/>
    <circle cx="60" cy="48" r="32" fill="#150c2b"/>
  `;
  document.body.appendChild(moon2);
}

// ===== SOCIAL ICONS =====
const socialIcons = {
  goodreads: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 0C5.149 0 0 5.149 0 11.5S5.149 23 11.5 23 23 17.851 23 11.5 17.851 0 11.5 0zm4.607 17.528c-.365.166-.747.297-1.142.395v.183c0 .322.023.623.058.902h-7.31c.07-.503.14-1.006.14-1.517 0-.51-.07-1.013-.14-1.517h3.31c.14.47.21.97.21 1.484 0 .693-.14 1.34-.386 1.926h1.54c.105-.28.175-.595.175-.937v-2.37c0-.342-.07-.658-.175-.937h-1.54c.246.586.386 1.233.386 1.926 0 .514-.07 1.014-.21 1.484H7.83c.14-.47.21-.97.21-1.484 0-.514-.07-1.014-.21-1.484h3.31c-.14-.47-.21-.97-.21-1.484 0-.51.07-1.013.21-1.517H7.55c.14-.503.21-1.006.21-1.517 0-.51-.07-1.013-.21-1.517h7.31c-.035.28-.058.58-.058.902v.183c.395.098.777.229 1.142.395v-2.23h1.575v11.19h-1.575v-2.23z"/></svg>`,
  storygraph: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.5 4.5h3v15h-3v-15zm-4 3h3v12h-3v-12zm8 1.5h3v10.5h-3V9zm4 3h3v7.5h-3V12z"/></svg>`,
  instagram: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  twitter: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  threads: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 10.8c-1.149-2.128-4.043-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.562.139 1.902 0 3.08 0 4.3c0 .679.133 3.194.23 3.677.768 3.872 4.433 4.956 7.43 5.342-2.482.28-6.86.758-7.387 2.43-.408 1.28-.197 5.394 6.612 6.722 2.913.571 4.896.922 5.113 1.482.323.845-.21 2.107-3.482.977-2.027-.701-2.34-1.052-3.106-1.838l-.156-.154c-.86-.86-1.66-1.96-1.66-3.18 0-.42.34-.76.76-.76.27 0 .53.11.72.3l1.84 1.56c.65.55 1.5.86 2.4.86s1.75-.31 2.4-.86l1.84-1.56c.19-.19.45-.3.72-.3.42 0 .76.34.76.76 0 1.22-.8 2.32-1.66 3.18l-.156.154c-.766.786-1.079 1.137-3.106 1.838-3.272 1.13-3.805.132-3.482-.977.217-.56.8-1.09 2.2-1.38 4.203-.87 6.842-1.58 6.842-4.94 0-.39-.02-2.58-.23-3.677C23.867 3.194 24 4.979 24 4.3 24 3.08 23.861 1.902 23.098 1.562c-.659-.296-1.664-.618-4.3.043-2.755 1.942-5.649 5.867-6.798 7.995z"/></svg>`,
  tiktok: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v3.07c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.65-1.35 3.81-.97 1.51-2.37 2.53-4.18 2.91-1.53.33-3.06.26-4.58-.09-1.74-.41-3.34-1.34-4.57-2.82-.98-1.19-1.49-2.64-1.5-4.21-.01-1.54-.26-3.07-.9-4.37 1.48.35 3.02.53 4.6.52.02-1.48.01-2.97.01-4.46 1.06-.02 2.11-.19 3.14-.52.43-.14.83-.35 1.18-.62.58-.44 1.02-1.03 1.3-1.69.27-.66.38-1.38.32-2.09.01-.46.02-.91.01-1.37z"/></svg>`,
  youtube: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  pinterest: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.913 2.168-2.913 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.088.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>`,
  letterboxd: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M8.29 14.286a10.282 10.282 0 0 1-4.27 2.555V7.18a10.282 10.282 0 0 1 4.27 2.555v4.551zm11.918-6.18v8.027a10.282 10.282 0 0 1-4.27-2.556v-4.55a10.282 10.282 0 0 1 4.27-2.556zM12 18.51a9.98 9.98 0 0 0-4.27-.976v-4.551c1.355.336 2.78.514 4.27.514 1.49 0 2.915-.178 4.27-.514v4.55A9.98 9.98 0 0 0 12 18.51zm0-13.02c1.49 0 2.915.178 4.27.514v4.551a9.98 9.98 0 0 0-4.27-.977 9.98 9.98 0 0 0-4.27.977v-4.55A9.98 9.98 0 0 1 12 5.49z"/></svg>`,
  bloglovin: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 24c-3.313 0-6-2.687-6-6v-4.784c0-3.312 2.687-6 6-6s6 2.688 6 6V18c0 3.313-2.687 6-6 6zm0-14.47c-1.916 0-3.47 1.554-3.47 3.47V18c0 1.916 1.554 3.47 3.47 3.47s3.47-1.554 3.47-3.47v-4.784c0-1.916-1.554-3.47-3.47-3.47zM11.094 0l2.074 1.23-2.074 3.588L9.02 1.23 11.094 0z"/></svg>`,
  mastodon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M23.268 5.313c-.35-1.624-2.564-2.969-5.243-2.969-1.76 0-3.465.515-4.915 1.478C11.977 4.29 10.535 4.72 9 4.719c-2.758 0-5.09.97-6.618 2.748C.817 9.112 0 11.415 0 13.907c0 4.408 2.855 8.125 6.822 9.545.763.274 1.579.513 2.437.712 1.31.296 2.686.458 4.087.458.835 0 1.657-.048 2.46-.143a3.38 3.38 0 0 0 1.722-1.298c.064-.1.12-.203.17-.309.048-.103.09-.208.125-.314.082-.246.145-.504.188-.77.116-.73.174-1.476.174-2.227v-.793c0-1.553-.026-3.025-.067-4.418-.017-.588-.078-1.166-.183-1.732zm-4.057 5.447c-.096 1.253-.28 2.47-.547 3.647-.195.852-.424 1.66-.688 2.42-.192.55-.423 1.073-.69 1.567-.072.13-.148.257-.227.38-.066.102-.136.202-.21.3-.074.097-.152.19-.233.28-.088.096-.18.186-.275.272-.102.093-.208.18-.318.262-.114.085-.232.164-.354.238-.127.077-.259.148-.394.213-.14.068-.285.128-.433.182-.152.055-.309.1-.469.138-.164.04-.332.07-.503.09-.174.02-.351.03-.53.03-.187 0-.372-.01-.555-.03-.185-.02-.367-.05-.545-.09-.178-.04-.353-.09-.523-.148-.168-.058-.33-.127-.486-.206-.156-.078-.304-.167-.444-.265-.138-.097-.267-.205-.387-.322-.117-.114-.226-.238-.326-.37-.102-.134-.193-.277-.274-.428-.082-.15-.153-.31-.213-.476-.06-.166-.11-.34-.148-.52-.04-.18-.068-.366-.085-.557-.018-.19-.027-.385-.027-.583 0-.198.01-.393.027-.583.017-.19.046-.376.085-.557.038-.18.088-.354.148-.52.06-.166.13-.326.213-.476.08-.15.172-.293.274-.428.1-.132.209-.256.326-.37.12-.117.25-.225.387-.322.14-.098.288-.187.444-.265.156-.08.318-.148.486-.206.17-.06.345-.108.523-.148.178-.04.36-.07.545-.09.183-.02.368-.03.555-.03.179 0 .356.01.53.03.171.02.339.05.503.09.16.038.317.083.469.138.148.054.293.114.433.182.135.065.267.136.394.213.122.074.24.153.354.238.11.082.216.169.318.262.095.086.187.176.275.272.081.09.159.183.233.28.074.098.144.198.21.3.079.123.155.25.227.38.267.494.498 1.017.69 1.567.264.76.452 1.604.547 2.42.09.76.135 1.54.135 2.32 0 .78-.045 1.56-.135 2.32z"/></svg>`,
  redbubble: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm-.91 15.94c-.46.21-1.08.33-1.78.33-.71 0-1.33-.12-1.79-.33-.58-.26-.91-.6-.91-1.04 0-.34.22-.62.58-.79.25-.12.58-.22.96-.28l.48-.08c.54-.09 1.13-.16 1.75-.22v.79c-.39.04-.78.1-1.14.18-.33.07-.58.17-.73.28-.12.09-.18.2-.18.33 0 .14.08.25.24.34.23.12.57.18 1.02.18.46 0 .8-.06 1.03-.18.16-.09.24-.2.24-.34 0-.13-.06-.24-.18-.33-.15-.11-.4-.21-.73-.28-.36-.08-.75-.14-1.14-.18v-.79c.62-.06 1.21-.13 1.75-.22l.48-.08c.38-.06.71-.16.96-.28.36-.17.58-.45.58-.79 0-.44-.33-.78-.91-1.04-.46-.21-1.08-.33-1.79-.33-.7 0-1.32.12-1.78.33-.58.26-.91.6-.91 1.04 0 .33.22.61.57.79.25.12.58.22.97.28l.48.08c.54.09 1.13.16 1.75.22v-.79c-.39-.04-.78-.1-1.14-.18-.33-.07-.58-.17-.73-.28-.12-.09-.18-.2-.18-.33 0-.14.08-.25.24-.34.23-.12.57-.18 1.02-.18.46 0 .8.06 1.03.18.16.09.24.2.24.34 0 .13-.06.24-.18.33-.15.11-.4.21-.73.28-.36.08-.75.14-1.14.18v.79c.62.06 1.21.13 1.75.22l.48.08c.38.06.71.16.96.28.36.17.58.45.58.79 0 .44-.33.78-.91 1.04zm5.91-4.72c-.41 0-.74.11-1.01.33-.27.22-.4.51-.4.88 0 .37.13.66.4.88.27.22.6.33 1.01.33.4 0 .73-.11 1-.33.27-.22.4-.51.4-.88 0-.37-.13-.66-.4-.88-.27-.22-.6-.33-1-.33zm0 1.45c-.2 0-.36-.05-.49-.15-.13-.1-.19-.24-.19-.42s.06-.32.19-.42c.13-.1.29-.15.49-.15.19 0 .35.05.48.15.13.1.2.24.2.42s-.07.32-.2.42c-.13.1-.29.15-.48.15zm-2.56-1.45h.91v3.18h.91v-3.18h.91v-.73h-2.73v.73z"/></svg>`,
  amazon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M15.645 14.192c-2.054 1.503-5.045 2.28-7.628 2.28-3.615 0-6.86-1.334-9.312-3.556-.193-.174-.021-.423.214-.284 2.658 1.544 5.938 2.475 9.314 2.475 2.284 0 4.789-.483 7.098-1.474.347-.15.643.224.314.559zM16.97 12.303c-.267-.343-1.748-.163-2.413-.082-.208.026-.238-.156-.053-.286.127-.09 3.007-1.708 3.465-1.905.173-.068.34-.098.506-.098.446 0 .76.103.958.31.243.252.206.616.02 1.013-.173.37-.548 1.155-.79 1.538-.24.38-.47.618-.642.81-.17.19-.31.345-.31.572 0 .23.188.415.42.415.25 0 .41-.165.615-.36.205-.193.44-.44.735-.658.34-.25.765-.43 1.25-.43.395 0 .755.073 1.03.255.27.18.45.435.45.83 0 .37-.19.69-.45.95-.26.26-.62.47-1.03.62-.41.15-.86.23-1.31.23-.63 0-1.23-.1-1.76-.3-.52-.2-.96-.49-1.28-.86-.32-.37-.5-.82-.5-1.33 0-.54.21-1.03.55-1.42.34-.39.8-.7 1.34-.88.54-.18 1.13-.27 1.73-.27.44 0 .88.04 1.3.13.42.09.82.23 1.18.42.36.19.66.43.9.72.24.29.42.63.53 1.02.11.39.17.81.17 1.24 0 .7-.13 1.36-.38 1.96-.25.6-.61 1.13-1.06 1.57-.45.44-.98.79-1.57 1.04-.59.25-1.22.38-1.87.38-.79 0-1.54-.13-2.23-.38-.69-.25-1.29-.6-1.79-1.04-.5-.44-.88-.97-1.13-1.57-.25-.6-.38-1.26-.38-1.96 0-.58.09-1.14.27-1.66.18-.52.44-.99.77-1.39.33-.4.72-.73 1.16-.99.44-.26.92-.45 1.43-.57.51-.12 1.04-.18 1.58-.18.67 0 1.32.07 1.94.21.62.14 1.2.35 1.72.62.52.27.97.6 1.34.99.37.39.66.84.85 1.34.19.5.29 1.04.29 1.61 0 .6-.11 1.17-.32 1.7-.21.53-.51 1-.89 1.39-.38.39-.83.7-1.33.93-.5.23-1.04.35-1.6.35-.54 0-1.06.08-1.54.23-.48.15-.91.37-1.28.65-.37.28-.67.62-.89 1.01-.22.39-.33.83-.33 1.3 0 .47.12.9.33 1.29.21.39.52.73.89 1.01.37.28.8.5 1.28.65.48.15 1 .23 1.54.23.56 0 1.1.1 1.6.3.5.2.95.48 1.33.84.38.36.68.79.89 1.28.21.49.32 1.03.32 1.61 0 .58-.11 1.14-.32 1.67-.21.53-.51 1.01-.89 1.42-.38.41-.83.74-1.33.98-.5.24-1.04.36-1.6.36-.54 0-1.06.08-1.54.24-.48.16-.91.38-1.28.67-.37.29-.67.63-.89 1.02-.22.39-.33.82-.33 1.29 0 .47-.11.9-.33 1.29-.22.39-.52.73-.89 1.01-.37.28-.8.5-1.28.65-.48.15-1 .23-1.54.23-.56 0-1.1-.1-1.6-.3-.5-.2-.95-.48-1.33-.84-.38-.36-.68-.79-.89-1.28-.21-.49-.32-1.03-.32-1.61 0-.58.11-1.14.32-1.67.21-.53.51-1.01.89-1.42.38-.41.83-.74 1.33-.98.5-.24 1.04-.36 1.6-.36.54 0 1.06.08 1.54.24.48.16.91.38 1.28.67.37.29.67.63.89 1.02.22.39.33.82.33 1.29z"/></svg>`,
  amazonWishlist: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
  etsy: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M8.559 17.017c-.051.065-.102.118-.154.154-.051.04-.103.06-.154.06-.102 0-.256-.102-.461-.307-.205-.205-.41-.564-.614-1.077-.205-.513-.359-1.154-.462-1.923-.102-.769-.154-1.641-.154-2.616 0-.975.052-1.847.154-2.616.103-.769.257-1.41.462-1.923.204-.513.409-.872.614-1.077.205-.205.359-.307.461-.307.051 0 .103.02.154.06.052.036.103.089.154.154.138.17.24.472.24.872v5.564c0 .4-.102.702-.24.872zm3.168-4.41c0 .718-.016 1.384-.05 2.007-.034.623-.093 1.154-.176 1.589-.084.435-.193.77-.327 1.005-.134.235-.327.42-.577.555-.25.135-.56.203-.928.203-.369 0-.679-.068-.928-.203-.25-.135-.443-.32-.577-.555-.134-.235-.243-.57-.327-1.005-.083-.435-.142-.966-.176-1.589-.034-.623-.05-1.289-.05-2.007v-.41c0-.718.016-1.384.05-2.007.034-.623.093-1.154.176-1.589.084-.435.193-.77.327-1.005.134-.235.327-.42.577-.555.25-.135.56-.203.928-.203.369 0 .679.068.928.203.25.135.443.32.577.555.134.235.243.57.327 1.005.083.435.142.966.176 1.589.034.623.05 1.289.05 2.007v.41zm3.228 4.41c-.102 0-.205-.024-.307-.068-.102-.045-.187-.107-.256-.187-.068-.08-.116-.176-.143-.287-.027-.11-.04-.235-.04-.375V11.17c0-.564.078-1.037.235-1.418.156-.381.42-.64.786-.777.367-.137.824-.205 1.374-.205.205 0 .41.014.615.04.205.028.41.075.615.14.205.065.389.15.55.256.16.105.29.235.388.388.098.153.17.327.215.52.045.194.078.404.098.63.02.227.034.462.034.707v1.675c0 .692-.058 1.272-.176 1.738-.117.467-.327.824-.628 1.072-.302.248-.693.42-1.174.516-.48.096-1.016.144-1.607.144-.137 0-.274-.005-.41-.014zm1.538-1.804c.055-.164.096-.394.123-.688.027-.295.04-.642.04-1.042v-1.675c0-.232-.007-.447-.02-.643-.014-.196-.04-.368-.08-.517-.04-.15-.1-.27-.177-.36-.078-.09-.184-.16-.318-.215-.134-.054-.29-.096-.47-.123-.178-.027-.375-.04-.588-.04-.328 0-.608.04-.838.123-.23.082-.41.21-.54.388-.13.178-.218.41-.265.692-.047.282-.07.63-.07 1.045v1.675c0 .273.01.515.027.726.018.21.05.386.098.528.048.143.118.25.21.32.093.07.21.123.353.157.143.034.314.05.513.05.246 0 .48-.014.7-.04.22-.028.414-.075.584-.143zm3.296-5.79h-1.058v-.872h2.816v.872h-1.059v5.658h-.7v-5.658z"/></svg>`,
  kofi: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.053.295-.024.596c.386 5.684 3.769 8.384 8.485 8.384 4.52 0 8.281-3.656 8.427-8.474l.023.346s.093 1.141.678 1.554c.585.413 1.504.39 1.504.39l1.428-.066s1.128-.092 1.53-.8c.402-.708.271-1.92.271-1.92l-.023-.384.014-.052-.014-.188zm-13.763 4.415c-3.386 0-5.927-2.035-6.325-6.325l-.007-.066h12.699c-.344 3.854-2.94 6.391-6.367 6.391z"/></svg>`,
  email: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
};

// ===== RENDER HELPERS =====
function renderStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? '★' : '☆';
  }
  return stars;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });
}

function renderSocialLinks(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  
  for (const [platform, url] of Object.entries(siteData)) {
    if (url && socialIcons[platform]) {
      const link = document.createElement('a');
      link.href = platform === 'email' ? `mailto:${url}` : url;
      link.target = platform === 'email' ? '_self' : '_blank';
      link.rel = 'noopener';
      link.className = 'social-icon';
      link.innerHTML = socialIcons[platform];
      link.title = platform.charAt(0).toUpperCase() + platform.slice(1).replace(/([A-Z])/g, ' $1');
      container.appendChild(link);
    }
  }
}

function renderProfile() {
  if (siteData.name) {
    const nameEl = document.getElementById('profileName');
    const titleEl = document.getElementById('siteTitle');
    if (nameEl) nameEl.textContent = siteData.name;
    if (titleEl) titleEl.textContent = siteData.name;
  }
  if (siteData.tagline) {
    const tagEl = document.getElementById('profileTagline');
    const siteTagEl = document.getElementById('siteTagline');
    if (tagEl) tagEl.textContent = siteData.tagline;
    if (siteTagEl) siteTagEl.textContent = siteData.tagline;
  }
  if (siteData.profileImage) {
    const imgEl = document.getElementById('profileImg');
    if (imgEl) {
      imgEl.src = siteData.profileImage;
      imgEl.style.display = 'block';
    }
  }
}

function renderStats() {
  const booksEl = document.getElementById('statBooks');
  const genresEl = document.getElementById('statGenres');
  if (booksEl) booksEl.textContent = books.length;
  if (genresEl) {
    const uniqueCategories = [...new Set(books.map(b => b.category))];
    genresEl.textContent = uniqueCategories.length;
  }
}

function renderBookCard(book, showFull = false) {
  const cover = book.coverImage 
    ? `<img src="${book.coverImage}" alt="${book.title}" class="book-cover">`
    : `<div class="book-cover-placeholder">📖</div>`;
  
  const formatBadge = book.format 
    ? `<span class="book-format">${book.format}</span>` 
    : '';

  let content = `
    <div class="book-card">
      <div class="book-header">
        ${cover}
        <div class="book-meta">
          <a href="book.html?id=${book.id}" class="book-title">${book.title}</a>
          <p class="book-author">by ${book.author}</p>
          <div class="book-rating">${renderStars(book.rating || 0)}</div>
          <div class="book-tags">
            <span class="book-category">${book.category}</span>
            ${formatBadge}
          </div>
        </div>
      </div>
  `;

  if (showFull) {
    if (book.excerpt) content += `<p class="book-excerpt">"${book.excerpt}"</p>`;
    if (book.fullReview) content += `<div class="book-full-content">${book.fullReview}</div>`;
    if (book.highlights && book.highlights.length > 0) {
      content += `<ul class="book-highlights"><strong style="color:var(--accent);font-family:'Playfair Display',serif;font-style:italic;">Highlights</strong>`;
      book.highlights.forEach(h => { content += `<li>${h}</li>`; });
      content += `</ul>`;
    }
    if (book.verdict) content += `<p class="book-verdict"><strong style="color:var(--accent);">Verdict:</strong> ${book.verdict}</p>`;
  } else {
    if (book.excerpt) content += `<p class="book-excerpt">"${book.excerpt}"</p>`;
    content += `<a href="book.html?id=${book.id}" class="read-more">Read full review →</a>`;
  }

  content += `</div>`;
  return content;
}

function renderJournalEntry(entry, showFull = false) {
  let content = `
    <div class="journal-entry">
      <span class="journal-type">${entry.type}</span>
      <a href="journal-entry.html?id=${entry.id}" class="journal-title">${entry.title}</a>
      <p class="journal-date">${formatDate(entry.date)}</p>
  `;

  if (showFull) {
    content += `<div class="journal-content">${entry.text}</div>`;
    if (entry.attribution) {
      content += `<p class="journal-attribution">— ${entry.attribution}</p>`;
    }
  } else {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = entry.text;
    const plainText = tempDiv.textContent || '';
    const preview = plainText.length > 220 ? plainText.substring(0, 220) + '...' : plainText;
    content += `<p style="color:var(--text-soft);margin-bottom:.5rem;">${preview}</p>`;
    content += `<a href="journal-entry.html?id=${entry.id}" class="read-more">Continue reading →</a>`;
  }

  content += `</div>`;
  return content;
}

function renderAbout() {
  if (aboutData.heading) {
    const h = document.getElementById('aboutHeading');
    if (h) h.textContent = aboutData.heading;
  }
  if (aboutData.introLine) {
    const el = document.getElementById('aboutIntro');
    if (el) el.textContent = aboutData.introLine;
  }
  if (aboutData.signoff) {
    const el = document.getElementById('aboutSignoff');
    if (el) el.textContent = aboutData.signoff;
  }
  
  const bioContainer = document.getElementById('aboutBio');
  if (bioContainer && aboutData.bioParagraphs && Array.isArray(aboutData.bioParagraphs)) {
    bioContainer.innerHTML = '';
    aboutData.bioParagraphs.forEach(para => {
      const p = document.createElement('p');
      p.textContent = para;
      bioContainer.appendChild(p);
    });
  }
}

// ===== URL HELPERS =====
function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
  generateStars(85);
  addMoonDecorations();
});
