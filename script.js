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

// 결혼식 날짜 (KST 기준)
const weddingDate = new Date("2026-10-31T12:10:00+09:00");

function updateDplus() {
  const now = new Date();
  const dayDiff = Math.floor((now.getTime() - weddingDate.getTime()) / (1000 * 60 * 60 * 24));
  const label = dayDiff < 0 ? `D - ${Math.abs(dayDiff)}` : `D + ${dayDiff}`;
  document.getElementById('dplus-label').textContent = label;
}

updateDplus();
setInterval(updateDplus, 1000 * 60 * 60); // Update every hour

// Initialize Naver Map
window.addEventListener('load', function() {
  if (typeof naver !== 'undefined' && naver.maps) {
    var mapOptions = {
      center: new naver.maps.LatLng(37.571728, 127.014986), // SW 컨벤션 센터 좌표
      zoom: 17,
      mapTypeControl: false
    };
    var map = new naver.maps.Map('map', mapOptions);

    // 마커 추가
    var marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(37.571728, 127.014986),
      map: map,
      title: 'SW 컨벤션 센터'
    });
  }
});

// Share functions
function shareKakao() {
  alert('카카오톡 공유 기능 (Kakao SDK 연동 필요)');
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href);
  alert('청첩장 주소가 복사되었습니다.');
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

// Gallery load more
let galleryExpanded = false;
function loadMoreImages() {
  if (!galleryExpanded) {
    alert('더 많은 이미지를 로드하는 기능입니다.');
    galleryExpanded = true;
    document.getElementById('load-more-btn').style.display = 'none';
  }
}

// Close modal on outside click
document.getElementById('contact-modal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeContactModal();
  }
});
