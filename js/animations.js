// animations.js - 고급 애니메이션 및 효과를 관리하는 스크립트

document.addEventListener('DOMContentLoaded', function() {
    // 페이지가 완전히 로드된 후 실행
    window.addEventListener('load', function() {
      // GSAP 애니메이션 초기화
      initGSAPAnimations();
      
      // 파티클 효과 초기화 (있는 경우)
      initParticles();
      
      // 인터랙티브 요소 초기화
      initInteractiveElements();
    });
  });
  
  // GSAP 애니메이션 설정
  function initGSAPAnimations() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      // 네비게이션바 애니메이션
      gsap.from('.navbar-brand', { 
        duration: 1, 
        y: -50, 
        opacity: 0, 
        ease: 'power3.out',
        delay: 0.2
      });
      
      gsap.from('.nav-item', { 
        duration: 0.5, 
        y: -50, 
        opacity: 0, 
        stagger: 0.1, 
        ease: 'power3.out',
        delay: 0.4
      });
      
      // 히어로 섹션 텍스트 애니메이션
      const heroTimeline = gsap.timeline();
      
      heroTimeline.from('.hero h1', { 
        duration: 1, 
        y: 50, 
        opacity: 0, 
        ease: 'power3.out' 
      }).from('.hero p', { 
        duration: 0.8, 
        y: 30, 
        opacity: 0, 
        ease: 'power3.out' 
      }, '-=0.4').from('.hero .btn-custom', { 
        duration: 0.6, 
        y: 20, 
        opacity: 0, 
        stagger: 0.2, 
        ease: 'power3.out' 
      }, '-=0.4');
      
      // 스크롤 트리거 기반 애니메이션
      gsap.utils.toArray('.card-base').forEach(card => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none"
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
        });
      });
      
      // 배경 요소 패럴랙스 효과
      gsap.utils.toArray('.bg-element').forEach(element => {
        gsap.to(element, {
          scrollTrigger: {
            trigger: element.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          },
          y: Math.random() * 100 - 50,
          x: Math.random() * 100 - 50,
          ease: "none"
        });
      });
    }
  }
  
  // 파티클 효과 초기화
  function initParticles() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach(particle => {
      // 랜덤 움직임 애니메이션
      gsap.to(particle, {
        x: 'random(-20, 20)',
        y: 'random(-20, 20)',
        duration: 'random(2, 4)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
  }
  
  // 인터랙티브 요소 초기화
  function initInteractiveElements() {
    // 호버 효과가 있는 모든 카드
    const cards = document.querySelectorAll('.interactive-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        gsap.to(this.querySelector('.card-content'), {
          y: -10,
          duration: 0.3,
          ease: 'power2.out'
        });
        
        // 배경 그라데이언트 효과
        gsap.to(this, {
          background: 'linear-gradient(135deg, rgba(254, 44, 85, 0.05) 0%, rgba(37, 244, 238, 0.05) 100%)',
          duration: 0.5
        });
      });
      
      card.addEventListener('mouseleave', function() {
        gsap.to(this.querySelector('.card-content'), {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
        
        // 원래 배경으로 복귀
        gsap.to(this, {
          background: 'rgba(255, 255, 255, 0.03)',
          duration: 0.5
        });
      });
    });
    
    // 숫자 카운터 애니메이션
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      
      ScrollTrigger.create({
        trigger: counter,
        start: "top 80%",
        onEnter: () => {
          gsap.to(counter, {
            duration: 2,
            innerText: target,
            roundProps: "innerText",
            ease: "power2.out"
          });
        }
      });
    });
  }