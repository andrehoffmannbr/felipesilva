document.addEventListener('DOMContentLoaded', function() {
    // Menu móvel
    const menuToggle = document.getElementById('menuToggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Fechar menu ao clicar em link
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navList.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Header com fundo ao scrollar
    const header = document.querySelector('.header');
    
    function toggleHeaderBackground() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', toggleHeaderBackground);
    toggleHeaderBackground(); // Verificar posição inicial

    // Animação de entrada para elementos
    function animateOnScroll() {
        const elements = document.querySelectorAll('.property-card, .about-content, .contact-form, .contact-info, .registration-form, .section-title');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    }
    
    window.addEventListener('scroll', animateOnScroll);
    setTimeout(animateOnScroll, 300); // Animar elementos visíveis inicialmente

    // Smooth scroll para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Ajuste para o header fixo
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Validação básica de formulários
    const contactForm = document.getElementById('contactForm');
    const registrationForm = document.getElementById('registrationForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(contactForm)) {
                showFormSuccess(contactForm, 'Mensagem enviada com sucesso! Entraremos em contato em breve.');
            }
        });
    }
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(registrationForm)) {
                showFormSuccess(registrationForm, 'Cadastro realizado com sucesso! Você receberá nossas novidades por e-mail.');
            }
        });
    }
    
    function validateForm(form) {
        let valid = true;
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                valid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
            
            // Validar email
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    valid = false;
                    input.classList.add('error');
                }
            }
        });
        
        return valid;
    }
    
    function showFormSuccess(form, message) {
        // Limpar campos
        form.reset();
        
        // Mostrar mensagem de sucesso
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = message;
        
        // Remover mensagem anterior se existir
        const existingMessage = form.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        form.appendChild(successMessage);
        
        // Remover mensagem após 5 segundos
        setTimeout(() => {
            successMessage.classList.add('fade-out');
            setTimeout(() => {
                successMessage.remove();
            }, 500);
        }, 5000);
    }

    // Adicionar estilos CSS para mensagens de erro/sucesso e animações
    const style = document.createElement('style');
    style.textContent = `
        .error {
            border-color: #ff4747 !important;
            box-shadow: 0 0 0 2px rgba(255, 71, 71, 0.2) !important;
        }
        
        .success-message {
            margin-top: 1rem;
            padding: 1rem;
            background-color: rgba(46, 204, 113, 0.1);
            border: 1px solid rgba(46, 204, 113, 0.5);
            color: #2ecc71;
            border-radius: 4px;
            animation: fadeIn 0.5s ease-out;
        }
        
        .fade-out {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        .animated {
            animation: fadeInUp 0.8s ease-out forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .header.scrolled {
            background-color: rgba(0, 0, 0, 0.95);
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
        }
        
        .menu-open {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    // Adicionar efeito de carregamento gradual às estatísticas
    const stats = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        stats.forEach(stat => {
            const finalValue = stat.textContent;
            const valuePlus = finalValue.includes('+') ? '+' : '';
            const numericValue = parseInt(finalValue.replace(/\D/g, ''));
            
            let startValue = 0;
            const duration = 2000;
            const startTime = performance.now();
            
            function updateValue(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Usar uma função de easing para animação mais natural
                const easeOutQuad = progress * (2 - progress);
                
                const currentValue = Math.floor(easeOutQuad * numericValue);
                stat.textContent = currentValue + valuePlus;
                
                if (progress < 1) {
                    requestAnimationFrame(updateValue);
                } else {
                    stat.textContent = finalValue;
                }
            }
            
            stat.textContent = startValue + valuePlus;
            requestAnimationFrame(updateValue);
        });
    }
    
    // Observer para disparar animação das estatísticas quando visíveis
    if (stats.length > 0) {
        const statsSection = document.querySelector('.about-stats');
        
        if (statsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(animateStats, 300);
                        observer.disconnect(); // Executar apenas uma vez
                    }
                });
            }, {
                threshold: 0.5
            });
            
            observer.observe(statsSection);
        }
    }
}); 