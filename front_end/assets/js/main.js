// 页面加载后执行
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    setupNavigation();
    setupAnimations();
    showSection('home');
}

// 设置导航
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // 关闭移动端菜单
            navMenu.classList.remove('active');
        });
    });
    
    // 汉堡菜单
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

// 显示指定部分
function showSection(sectionId) {
    // 隐藏所有部分
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // 显示目标部分
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // 更新导航状态
        updateActiveNavLink(sectionId);
        
        // 滚动到顶部
        window.scrollTo(0, 0);
        
        // 特殊处理
        if (sectionId === 'home') {
            animateStats();
        }
    }
}

// 更新活跃导航链接
function updateActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('data-section') === sectionId) {
            link.style.color = '#ffd700';
        } else {
            link.style.color = 'white';
        }
    });
}

// 数字动画
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (target === 99.9) {
                stat.textContent = current.toFixed(1);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// 设置动画
function setupAnimations() {
    // 滚动动画观察器
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察卡片元素
    const cards = document.querySelectorAll('.service-card, .monitor-card, .report-item, .stat-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// 表单处理
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 简单的表单验证
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (name && email && message) {
                showMessage('\u6d88\u606f\u53d1\u9001\u6210\u529f\uff01\u6211\u4eec\u4f1a\u5c3d\u5feb\u4e0e\u60a8\u8054\u7cfb\u3002', 'success');
                form.reset();
            } else {
                showMessage('\u8bf7\u586b\u5199\u6240\u6709\u5fc5\u9700\u5b57\u6bb5\u3002', 'warning');
            }
        });
    }
}

// 显示消息
function showMessage(message, type = 'info') {
    // 移除现有消息
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 创建新消息
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        border-radius: 5px;
        color: white;
        z-index: 1000;
        background-color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196F3'};
    `;
    
    document.body.appendChild(messageEl);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 3000);
}

// 导出全局函数
window.showSection = showSection;

// 监听窗口大小变化
window.addEventListener('resize', function() {
    const navMenu = document.querySelector('.nav-menu');
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
    }
});

// 页面加载完成后设置联系表单
document.addEventListener('DOMContentLoaded', function() {
    setupContactForm();
});
