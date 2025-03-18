// main.js - ANOV 웹사이트 모듈 로딩 및 초기화

// HTML 모듈 로드 함수
async function loadHTML(selector, url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load ' + url);
      const content = await response.text();
      document.querySelector(selector).innerHTML = content;
      
      // 콘텐츠 로드 후 AOS 리프레시
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
      
      // 모듈 로드 상태 업데이트
      updateLoadStatus();
      
      return true;
    } catch (error) {
      console.error(`Error loading ${url}:`, error);
      document.querySelector(selector).innerHTML = `
        <div class="container">
          <div class="alert alert-danger">
            Error loading ${url}. Please try refreshing the page.
          </div>
        </div>
      `;
      
      // 에러가 발생해도 로드 상태는 업데이트
      updateLoadStatus();
      return false;
    }
  }
  
  // 모든 모듈 목록
  const modules = [
    { selector: '#nav-placeholder', url: 'modules/nav.html' },
    { selector: '#hero-placeholder', url: 'modules/hero1.html' },
    { selector: '#mp4-placeholder', url: 'modules/mp4.html' },
    { selector: '#about-placeholder', url: 'modules/about.html' },
    { selector: '#core-values-placeholder', url: 'modules/core-values.html' },
    { selector: '#creators-services-placeholder', url: 'modules/creators-services.html' },
    { selector: '#case-studies-placeholder', url: 'modules/case-studies.html' },
    { selector: '#process-placeholder', url: 'modules/process.html' },
    { selector: '#pricing-placeholder', url: 'modules/pricing.html' },
    { selector: '#business-services-placeholder', url: 'modules/business-services.html' },
    { selector: '#faq-placeholder', url: 'modules/faq.html' },
    { selector: '#footer-placeholder', url: 'modules/footer.html' }
  ];
  
  // 로드된 모듈 카운트
  let loadedModules = 0;
  
  // 모듈 로드 상태 업데이트 및 완료 확인
  function updateLoadStatus() {
    loadedModules++;
    
    // 모든 모듈이 로드되었는지 확인
    if (loadedModules >= modules.length) {
      console.log('All modules loaded successfully');
      initializeAfterLoad();
    }
  }
  
  // 모든 모듈이 로드된 후 초기화할 기능
  function initializeAfterLoad() {
    // AOS 애니메이션 초기화
    AOS.init({
      duration: 800,
      once: false,
      offset: 50,
      delay: 100,
      disable: window.innerWidth < 768 ? true : false
    });
    
    // 히어로 슬라이더 초기화
    initHeroSlider();
    
    // 현재 URL에 해시가 있는 경우 해당 섹션으로 스크롤
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      scrollToSection(targetId);
    }
    
    // 스크롤 이벤트 발생시켜 현재 위치에 맞는 네비게이션 항목 활성화
    window.dispatchEvent(new Event('scroll'));
  }
  
  // 히어로 슬라이더 초기화
  function initHeroSlider() {
    const carousel = document.getElementById('heroCarousel');
    if (!carousel) return;
    
    // 10초마다 슬라이드 변경
    const heroCarousel = new bootstrap.Carousel(carousel, {
      interval: 10000
    });
    
    // 프로그레스바 업데이트
    const progressBar = document.querySelector('.hero-progress-bar');
    if (progressBar) {
      updateProgressBar(progressBar, 0);
      
      carousel.addEventListener('slide.bs.carousel', (e) => {
        updateProgressBar(progressBar, e.to);
      });
    }
  }
  
  // 슬라이더 프로그레스바 업데이트
  function updateProgressBar(progressBar, slideIndex) {
    const slideCount = document.querySelectorAll('.carousel-item').length;
    const progressWidth = ((slideIndex + 1) / slideCount) * 100;
    progressBar.style.width = `${progressWidth}%`;
  }
  
  // 특정 섹션으로 스크롤 함수
  function scrollToSection(id) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - navbarHeight - 20;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
  
  // 페이지 로드 시 실행
  document.addEventListener('DOMContentLoaded', function() {
    try {
      // 모듈 폴더가 있는지 확인하고 없으면 생성
      const checkAndCreateModuleFolder = async () => {
        try {
          const response = await fetch('modules/');
          if (!response.ok) {
            console.error('Modules folder not found. Creating folder structure may require server permission.');
          }
        } catch (error) {
          console.warn('Modules folder might not exist, but we will attempt to load files anyway:', error);
        }
      };
      
      checkAndCreateModuleFolder().then(() => {
        // 모든 모듈 병렬 로드
        Promise.all(modules.map(module => loadHTML(module.selector, module.url)))
          .then(results => {
            console.log(`Loaded ${results.filter(Boolean).length}/${modules.length} modules`);
          })
          .catch(error => {
            console.error('Error loading modules:', error);
          });
      });
      
      // 스크롤 이벤트 감지
      window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // 고정 네비게이션바 효과
        const navbar = document.querySelector('.navbar');
        if (navbar) {
          if (scrollPosition > 50) {
            navbar.classList.add('navbar-scrolled');
          } else {
            navbar.classList.remove('navbar-scrolled');
          }
        }
      });
      
    } catch (error) {
      console.error('초기화 오류:', error);
    }
  });