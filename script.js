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
      description: '일시: 2026.10.31 (토) 12:10 PM\n장소: SW컨벤션센터 11층',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
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

// Image modal functionality
function openImageModal(src) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
  modal.innerHTML = `
    <button onclick="this.parentElement.remove()" class="absolute top-4 right-4 text-white text-4xl z-10">&times;</button>
    <img src="${src}" class="max-w-full max-h-full object-contain px-4" />
  `;
  modal.onclick = function(e) {
    if (e.target === modal || e.target.tagName === 'BUTTON') {
      modal.remove();
    }
  };
  document.body.appendChild(modal);
}

// Close modal on outside click
document.getElementById('contact-modal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeContactModal();
  }
});
