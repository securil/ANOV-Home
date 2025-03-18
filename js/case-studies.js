// case-studies.js - 성공 사례 섹션의 "더 많은 사례 보기" 기능을 관리

// 페이지가 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 페이지 로드를 기다린 후에도 다시 시도하기 위한 함수
    function initCaseStudies() {
        console.log("Initializing case studies functionality");
        
        // 버튼과 숨겨진 사례 컨테이너 찾기
        const loadMoreBtn = document.getElementById('loadMoreCases');
        const hiddenCases = document.querySelector('.hidden-cases');
        
        // 요소들이 존재하는지 확인 (아직 DOM에 로드되지 않았을 수 있음)
        if (loadMoreBtn && hiddenCases) {
            console.log("Case studies elements found, setting up click handler");
            
            // 클릭 이벤트 리스너 추가
            loadMoreBtn.addEventListener('click', function() {
                console.log("Load more button clicked");
                
                // 숨겨진 사례들 표시 (display 속성을 flex로 변경)
                hiddenCases.style.display = 'flex';
                
                // 버튼 숨기기
                loadMoreBtn.style.display = 'none';
                
                // AOS 애니메이션 새로고침 (새로 나타난 요소에 애니메이션 적용)
                if (typeof AOS !== 'undefined') {
                    setTimeout(function() {
                        AOS.refresh();
                    }, 100);
                }
                
                // 부드러운 스크롤 (새로 나타난 콘텐츠로 스크롤)
                setTimeout(function() {
                    const firstHiddenCase = hiddenCases.querySelector('.col-lg-4');
                    if (firstHiddenCase) {
                        // 스크롤 위치 조정 (네비게이션 바 높이 고려)
                        const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                        const elementPosition = firstHiddenCase.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = elementPosition - navHeight - 20;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 200);
            });
            
            // 초기화 성공 메시지
            console.log("Case studies functionality initialized successfully");
        } else {
            // 요소를 찾지 못한 경우, 모듈이 아직 로드되지 않았을 수 있음
            console.log("Case studies elements not found yet, will try again");
            
            // 모듈이 로드될 때까지 기다린 후 다시 시도
            setTimeout(initCaseStudies, 500);
        }
    }
    
    // 초기화 함수 호출
    initCaseStudies();
});

// 추가 안전 장치: 윈도우 로드 완료 후에도 다시 한번 초기화 시도
window.addEventListener('load', function() {
    // DOM이 완전히 로드된 후 모듈 관련 이벤트 처리
    const loadMoreBtn = document.getElementById('loadMoreCases');
    if (loadMoreBtn) {
        console.log("Found button in window load event");
    } else {
        console.log("Button not found in window load, checking for modules");
        
        // 모듈이 로드되어 있는지 확인하고 처리
        const caseStudiesElement = document.getElementById('case-studies');
        if (!caseStudiesElement) {
            console.log("Module might not be loaded yet, setting up observer");
            
            // DOM 변경 감시하여 모듈이 로드되면 처리
            const observer = new MutationObserver(function(mutations) {
                const button = document.getElementById('loadMoreCases');
                if (button) {
                    console.log("Button found after DOM change");
                    observer.disconnect(); // 감시 중단
                    
                    // 버튼 클릭 이벤트 강제 재설정
                    button.onclick = function() {
                        const hiddenCases = document.querySelector('.hidden-cases');
                        if (hiddenCases) {
                            hiddenCases.style.display = 'flex';
                            button.style.display = 'none';
                            
                            if (typeof AOS !== 'undefined') {
                                AOS.refresh();
                            }
                        }
                        return false;
                    };
                }
            });
            
            // 문서 전체 변화 감시 설정
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }
});