// --- 1. Настройка Даты ---
const START_DATE = new Date('2022-12-02T00:00:00'); // **ВАША ДАТА НАЧАЛА ОТНОШЕНИЙ**

// --- 2. Функция Счетчик Дней (WOW-версия) ---
function updateCountdown() {
    const now = new Date();
    const diff = now - START_DATE;
    
    // Вычисления
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const totalMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    // Обновление DOM
    document.getElementById('days').textContent = totalDays.toLocaleString();
    document.getElementById('hours').textContent = totalHours.toLocaleString().padStart(2, '0');
    document.getElementById('minutes').textContent = totalMinutes.toLocaleString().padStart(2, '0');
}

updateCountdown();
// Обновляем каждую секунду для более живого эффекта
setInterval(updateCountdown, 1000); 

// --- 3. Переключение Секций с плавным переходом ---
const navButtons = document.querySelectorAll('.nav-btn, .cta-button');
const sections = document.querySelectorAll('.page-section');
let isTransitioning = false; // Флаг для предотвращения двойных кликов

function showSection(sectionId) {
    if (isTransitioning) return;
    isTransitioning = true;

    // 1. Деактивация старой секции
    const activeSection = document.querySelector('.page-section.active');
    if (activeSection) {
        activeSection.classList.remove('active');
        // Даем время на CSS-анимацию скрытия
        setTimeout(() => {
            activeSection.classList.add('hidden');
        }, 400); 
    }
    
    // 2. Активация новой секции
    const newActiveSection = document.getElementById(sectionId);
    if (newActiveSection) {
        newActiveSection.classList.remove('hidden');
        // Небольшая задержка перед активацией для плавности
        setTimeout(() => {
            newActiveSection.classList.add('active');
            isTransitioning = false;
        }, 50); 
    }

    // 3. Обновление активной кнопки
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active-nav'));
    const targetNavBtn = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);
    if(targetNavBtn) {
        targetNavBtn.classList.add('active-nav');
    }
    
    // Скролл к верху страницы
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Добавляем обработчики событий для кнопок
navButtons.forEach(button => {
    button.addEventListener('click', function() {
        const sectionId = this.getAttribute('data-section');
        if (sectionId) {
            showSection(sectionId);
        }
    });
});


// --- 4. Интерактивные Flip Cards ---
const flipCards = document.querySelectorAll('.flip-card');

flipCards.forEach(card => {
    card.addEventListener('click', () => {
        // Переключение класса 'flipped' при клике
        card.classList.toggle('flipped'); 
    });
});


// --- 5. Слайдер Галереи ---
let currentSlide = 0;
const slides = document.querySelectorAll('.slide-item');
const totalSlides = slides.length;
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

function showSlide(index) {
    // Убеждаемся, что индекс находится в пределах массива
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }

    // Убираем active-slide у всех
    slides.forEach(slide => slide.classList.remove('active-slide'));
    // Показываем нужный слайд
    slides[currentSlide].classList.add('active-slide');
}

function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide() { showSlide(currentSlide - 1); }

prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Инициализация слайдера
showSlide(currentSlide);

// --- 6. Эффект Параллакса (Секция HOME) ---
const parallaxBg = document.querySelector('.parallax-bg');

window.addEventListener('scroll', function() {
    // Проверяем, активна ли секция HOME
    if (document.getElementById('home').classList.contains('active')) {
        let scrollPosition = window.pageYOffset;
        // Двигаем фон на 50% от скорости скролла
        parallaxBg.style.transform = 'translateY(' + scrollPosition * 0.5 + 'px)';
    }
});
// --- 7. НОВОЕ: Открытие фото в полный размер (Модальное Окно) ---

const modal = document.getElementById("photoModal");
const modalImg = document.getElementById("modalImage");
const captionText = document.getElementById("caption");
const timelinePhotos = document.querySelectorAll('.timeline-clickable-photo');

// Функция открытия модального окна
timelinePhotos.forEach(photo => {
    photo.addEventListener('click', function() {
        modal.style.display = "block";
        modalImg.src = this.src;
        
        // Берем подпись из следующего элемента <p> в DOM
        let timelineItem = this.closest('.timeline-item');
        let textElement = timelineItem ? timelineItem.querySelector('p') : null;
        
        if (textElement) {
            // Устанавливаем текст и дату из хроники
            let dateElement = timelineItem.querySelector('h3');
            let dateText = dateElement ? dateElement.textContent : '';
            captionText.innerHTML = `<strong>${dateText}</strong><br>${textElement.textContent}`;
        } else {
            captionText.textContent = this.alt;
        }
    });
});

// Функция закрытия модального окна
function closeModal() {
    modal.style.display = "none";
}

// Закрытие при клике на крестик или на черную область
modal.addEventListener('click', function(e) {
    // Закрываем, только если клик был на самом модальном окне или на кнопке закрытия
    if (e.target.classList.contains('modal') || e.target.classList.contains('modal-content') || e.target.classList.contains('close-btn')) {
        closeModal();
    }
});