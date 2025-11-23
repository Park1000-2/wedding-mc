// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initGallery();
    loadGuestbook();
    initKakao();
});

// 카카오 SDK 초기화
function initKakao() {
    if (typeof Kakao !== 'undefined' && !Kakao.isInitialized()) {
        Kakao.init('418c67ca88ec3650ffb478f54a30c3d6');
        console.log('Kakao SDK initialized');
    }
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
            description: '2026년 10월 31일 토요일 오후 12시 10분\nSW 컨벤션 센터',
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

// 방명록 작성
function addGuestbook() {
    const nameInput = document.getElementById('guestName');
    const messageInput = document.getElementById('guestMessage');

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name) {
        alert('이름을 입력해주세요.');
        return;
    }

    if (!message) {
        alert('메시지를 입력해주세요.');
        return;
    }

    // 방명록 객체 생성
    const guestbook = {
        name: name,
        message: message,
        date: new Date().toISOString()
    };

    // localStorage에서 기존 방명록 가져오기
    let guestbooks = JSON.parse(localStorage.getItem('guestbooks') || '[]');

    // 새 방명록 추가
    guestbooks.unshift(guestbook);

    // localStorage에 저장
    localStorage.setItem('guestbooks', JSON.stringify(guestbooks));

    // 입력 필드 초기화
    nameInput.value = '';
    messageInput.value = '';

    // 방명록 목록 다시 로드
    loadGuestbook();

    alert('방명록이 작성되었습니다!');
}

// 방명록 로드
function loadGuestbook() {
    const guestList = document.getElementById('guestList');
    const guestbooks = JSON.parse(localStorage.getItem('guestbooks') || '[]');

    if (guestbooks.length === 0) {
        guestList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">아직 작성된 방명록이 없습니다.</p>';
        return;
    }

    guestList.innerHTML = guestbooks.map(guest => {
        const date = new Date(guest.date);
        const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

        return `
            <div class="guestbook-item">
                <div class="guest-header">
                    <span class="guest-name">${escapeHtml(guest.name)}</span>
                    <span class="guest-date">${formattedDate}</span>
                </div>
                <div class="guest-message">${escapeHtml(guest.message).replace(/\n/g, '<br>')}</div>
            </div>
        `;
    }).join('');
}

// HTML 이스케이프 (XSS 방지)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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