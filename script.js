// Kakao SDK 초기화
if (typeof Kakao !== 'undefined' && !Kakao.isInitialized()) {
  Kakao.init('418c67ca88ec3650ffb478f54a30c3d6');
}

// Theme Switcher
function switchTheme(theme) {
  if (theme === 'teal') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
  localStorage.setItem('wedding-theme', theme);
}

// Load saved theme on page load
window.addEventListener('DOMContentLoaded', function() {
  const savedTheme = localStorage.getItem('wedding-theme');
  if (savedTheme && savedTheme !== 'teal') {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
});

// Initialize Naver Map
window.addEventListener('load', function() {
  if (typeof naver !== 'undefined' && naver.maps) {
    const mapDiv = document.getElementById('map');
    if (!mapDiv) return;

    // SW컨벤션센터 좌표
    const location = new naver.maps.LatLng(37.571711, 127.015185);

    // 지도 생성
    const map = new naver.maps.Map(mapDiv, {
      center: location,
      zoom: 17,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT
      }
    });

    // 마커 생성
    const marker = new naver.maps.Marker({
      position: location,
      map: map,
      title: 'SW컨벤션센터'
    });

    // 정보 창 생성
    const infoWindow = new naver.maps.InfoWindow({
      content: '<div style="padding:12px 15px;text-align:center;background:white;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);"><strong style="font-size:14px;color:#8b7355;">SW컨벤션센터 11층</strong><br><span style="font-size:12px;color:#666;">서울 종로구 지봉로 19</span></div>',
      borderWidth: 0,
      backgroundColor: 'transparent',
      anchorSize: new naver.maps.Size(10, 10),
      pixelOffset: new naver.maps.Point(0, -10)
    });

    // 지도 로드시 정보 창 자동으로 열기
    infoWindow.open(map, marker);

    // 마커 클릭시 정보 창 토글
    naver.maps.Event.addListener(marker, 'click', function() {
      if (infoWindow.getMap()) {
        infoWindow.close();
      } else {
        infoWindow.open(map, marker);
      }
    });
  }
});

// Share functions
function shareKakao() {
  if (typeof Kakao === 'undefined') {
    alert('카카오톡 공유 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
    return;
  }

  Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: '박한천 ♥ 정수진 결혼합니다',
      description: '일시: 2026.10.31 (토) 12:10 PM\n장소: SW 컨벤션센터 11층',
      imageUrl: 'https://mcard.hcsj.store/assets/images/kakao-link.png',
      link: {
        mobileWebUrl: window.location.href,
        webUrl: window.location.href
      }
    },
    buttons: [
      {
        title: '청첩장 보기',
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href
        }
      }
    ]
  });
}

function shareSMS() {
  const message = `박한천 ♥ 정수진 결혼합니다

일시: 2026년 10월 31일 (토) 오후 12시 10분
장소: SW컨벤션센터 11층

모바일 청첩장: ${window.location.href}`;

  const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
  window.location.href = smsUrl;
}

function copyLink() {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('링크가 복사되었습니다!');
    }).catch(err => {
      fallbackCopyLink(window.location.href);
    });
  } else {
    fallbackCopyLink(window.location.href);
  }
}

function fallbackCopyLink(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand('copy');
    alert('링크가 복사되었습니다!');
  } catch (err) {
    alert('복사에 실패했습니다. 수동으로 복사해주세요.');
  }

  document.body.removeChild(textarea);
}

function copyAddress() {
  navigator.clipboard.writeText('서울 종로구 지봉로 19');
  alert('주소가 복사되었습니다.');
}

// Map functions
function openNaverMap() {
  window.open('https://naver.me/GzE9CXtD');
}

function openKakaoMap() {
  window.open('https://place.map.kakao.com/7918739');
}

function openTMap() {
  window.open('https://tmap.life/729a166e');
}

// Contact modal
function openContactModal() {
  document.getElementById('contact-modal').classList.add('active');
}

function closeContactModal() {
  document.getElementById('contact-modal').classList.remove('active');
}

function switchTab(tab) {
  const groomTab = document.getElementById('tab-groom');
  const brideTab = document.getElementById('tab-bride');
  const groomContacts = document.getElementById('groom-contacts');
  const brideContacts = document.getElementById('bride-contacts');

  if (tab === 'groom') {
    groomTab.classList.add('active');
    groomTab.classList.remove('text-gray-400');
    brideTab.classList.remove('active');
    brideTab.classList.add('text-gray-400');
    groomContacts.style.display = 'block';
    brideContacts.style.display = 'none';
  } else {
    brideTab.classList.add('active');
    brideTab.classList.remove('text-gray-400');
    groomTab.classList.remove('active');
    groomTab.classList.add('text-gray-400');
    brideContacts.style.display = 'block';
    groomContacts.style.display = 'none';
  }
}

function sendSMS(phone) {
  window.location.href = `sms:${phone}`;
}

function makeCall(phone) {
  window.location.href = `tel:${phone}`;
}

// Gallery lightbox with prev/next navigation
(function () {
  let images = [];
  let currentIndex = 0;
  let modalImg = null;
  let modalEl = null;
  let touchStartX = 0;

  function getImages() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return [];
    return Array.from(grid.querySelectorAll('img'));
  }

  function show(index) {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    currentIndex = index;
    modalImg.src = images[currentIndex].src;
    modalImg.alt = images[currentIndex].alt || '';
  }

  function open(index) {
    images = getImages();
    if (!images.length) return;

    modalEl = document.createElement('div');
    modalEl.className = 'fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 select-none';
    modalEl.innerHTML = `
      <button data-role="close" class="absolute top-4 right-4 text-white text-4xl leading-none z-10 w-10 h-10 flex items-center justify-center" aria-label="닫기">&times;</button>
      <button data-role="prev" class="absolute left-2 top-1/2 -translate-y-1/2 text-white text-4xl w-12 h-12 flex items-center justify-center z-10" aria-label="이전">&#8249;</button>
      <button data-role="next" class="absolute right-2 top-1/2 -translate-y-1/2 text-white text-4xl w-12 h-12 flex items-center justify-center z-10" aria-label="다음">&#8250;</button>
      <img data-role="img" class="max-w-full max-h-full object-contain px-4" />
      <div data-role="counter" class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm"></div>
    `;

    modalImg = modalEl.querySelector('[data-role="img"]');
    const counter = modalEl.querySelector('[data-role="counter"]');

    const update = (i) => {
      show(i);
      counter.textContent = `${currentIndex + 1} / ${images.length}`;
    };

    modalEl.addEventListener('click', (e) => {
      const role = e.target.dataset && e.target.dataset.role;
      if (role === 'close' || e.target === modalEl) {
        close();
      } else if (role === 'prev') {
        update(currentIndex - 1);
      } else if (role === 'next') {
        update(currentIndex + 1);
      }
    });

    modalEl.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    modalEl.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) < 40) return;
      update(dx < 0 ? currentIndex + 1 : currentIndex - 1);
    });

    document.body.appendChild(modalEl);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    update(index);
  }

  function close() {
    if (!modalEl) return;
    modalEl.remove();
    modalEl = null;
    modalImg = null;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(currentIndex - 1);
    else if (e.key === 'ArrowRight') show(currentIndex + 1);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    grid.addEventListener('click', (e) => {
      const img = e.target.closest('img');
      if (!img || !grid.contains(img)) return;
      const list = getImages();
      const idx = list.indexOf(img);
      if (idx >= 0) open(idx);
    });
    grid.querySelectorAll('img').forEach((img) => {
      img.classList.add('cursor-pointer');
    });
  });
})();

// Close modal on outside click
document.getElementById('contact-modal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeContactModal();
  }
});
