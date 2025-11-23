// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initGallery();
    initKakao();
    initNaverMap();
});

// 카카오 SDK 초기화
function initKakao() {
    if (typeof Kakao !== 'undefined' && !Kakao.isInitialized()) {
        Kakao.init('418c67ca88ec3650ffb478f54a30c3d6');
        console.log('Kakao SDK initialized');
    }
}

// 네이버 지도 초기화
function initNaverMap() {
    if (typeof naver === 'undefined' || typeof naver.maps === 'undefined') {
        console.log('Naver Maps API not loaded');
        return;
    }

    const mapDiv = document.getElementById('map');
    if (!mapDiv) {
        console.log('Map div not found');
        return;
    }

    // SW 컨벤션 센터 좌표
    const location = new naver.maps.LatLng(37.571728, 127.014986);

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
        title: 'SW 컨벤션 센터'
    });

    // 정보 창 생성
    const infoWindow = new naver.maps.InfoWindow({
        content: '<div style="padding:12px 15px;text-align:center;background:white;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);"><strong style="font-size:14px;color:#8b7355;">SW 컨벤션 센터 11F</strong><br><span style="font-size:12px;color:#666;">서울 종로구 지봉로 19</span></div>',
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

// 카카오톡 공유하기
function shareKakao() {
    if (typeof Kakao === 'undefined') {
        alert('카카오톡 공유 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
        return;
    }

    Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: '박한천 ♥ 정수진 결혼합니다',
            description: '일시: 2026.10.31 (토) 12:10 PM\n장소: SW 컨벤션 센터 11F',
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

// 문자(SMS) 공유하기
function shareSMS() {
    const message = `박한천 ♥ 정수진 결혼합니다

일시: 2026년 10월 31일 (토) 오후 12시 10분
장소: SW 컨벤션 센터 11F

모바일 청첩장: https://card-test.hcsj.store/`;

    const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
}

// 링크 복사하기
function copyLink() {
    const link = 'https://card-test.hcsj.store/';

    // Clipboard API 사용
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link).then(() => {
            alert('링크가 복사되었습니다!');
        }).catch(err => {
            // Clipboard API 실패시 fallback
            fallbackCopyLink(link);
        });
    } else {
        // Clipboard API 미지원시 fallback
        fallbackCopyLink(link);
    }
}

// 링크 복사 fallback 함수
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

// 갤러리 기능
function initGallery() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const slides = document.querySelectorAll('.slides img');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.querySelector('.modal-nav.prev');
    const nextBtn = document.querySelector('.modal-nav.next');

    let currentIndex = 0;

    // 이미지 클릭시 모달 열기
    slides.forEach((img, index) => {
        img.addEventListener('click', function() {
            currentIndex = index;
            openImageModal(this.src);
        });
    });

    // 모달 열기
    function openImageModal(src) {
        modal.classList.add('active');
        modalImage.src = src;
        document.body.style.overflow = 'hidden';
    }

    // 모달 닫기
    function closeImageModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // 닫기 버튼
    closeBtn.addEventListener('click', closeImageModal);

    // 배경 클릭시 닫기
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });

    // 이전 이미지
    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        modalImage.src = slides[currentIndex].src;
    });

    // 다음 이미지
    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % slides.length;
        modalImage.src = slides[currentIndex].src;
    });

    // 키보드 네비게이션
    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeImageModal();
        } else if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });
}

// 계좌 모달 열기
function openAccountModal() {
    const modal = document.getElementById('accountModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 계좌 모달 닫기
function closeAccountModal() {
    const modal = document.getElementById('accountModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// 탭 전환
function showTab(tabName) {
    // 모든 탭 컨텐츠 숨기기
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // 모든 탭 버튼 비활성화
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // 선택한 탭 활성화
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// 계좌번호 복사
function copyText(text) {
    // Clipboard API 사용
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            alert('계좌번호가 복사되었습니다.');
        }).catch(err => {
            // Clipboard API 실패시 fallback
            fallbackCopy(text);
        });
    } else {
        // Clipboard API 미지원시 fallback
        fallbackCopy(text);
    }
}

// 복사 fallback 함수
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        alert('계좌번호가 복사되었습니다.');
    } catch (err) {
        alert('복사에 실패했습니다. 수동으로 복사해주세요.');
    }

    document.body.removeChild(textarea);
}

// 계좌 모달 배경 클릭시 닫기
document.addEventListener('DOMContentLoaded', function() {
    const accountModal = document.getElementById('accountModal');
    if (accountModal) {
        accountModal.addEventListener('click', function(e) {
            if (e.target === accountModal) {
                closeAccountModal();
            }
        });
    }
});