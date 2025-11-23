// --- Глобальные настройки ---
const START_DATE = new Date('2022-12-02T00:00:00'); 
let isTransitioning = false; 

// --- Глобальные переменные для модального окна ---
const modal = document.getElementById("photoModal");
const modalImg = document.getElementById("modalImage");
const captionText = document.getElementById("caption");
const timelinePhotos = document.querySelectorAll('.timeline-clickable-photo');

const modalPrevBtn = document.getElementById('modalPrevBtn');
const modalNextBtn = document.getElementById('modalNextBtn');
const photoCounter = document.getElementById('photoCounter'); 

let activePhotoList = []; // Массив объектов {src, caption} для текущей группы
let currentPhotoIndex = 0; // Индекс текущего отображаемого фото
let isTimelineView = false; // <<< ФЛАГ ДЛЯ ОТКЛЮЧЕНИЯ НАВИГАЦИИ В ХРОНИКЕ

// ----------------------------------------------------
// ДАННЫЕ О ГАЛЕРЕЕ (СБОРКА ФОТО)
// ----------------------------------------------------
const GALLERY_DATA = {
    funny: [
        { src: "photo/1photo_2025-11-23_18-40-18.jpg", caption: "нуб фотка 1" },
        { src: "photo/2photo_2025-11-23_18-40-34.jpg", caption: "нуб фотка 2" },
        { src: "photo/3photo_2025-11-23_18-40-42.jpg", caption: "нуб фотка 3" },
        { src: "photo/4photo_2025-11-23_18-40-48.jpg", caption: "нуб фотка 4" },
        { src: "photo/5photo_2025-11-23_18-40-56.jpg", caption: "нуб фотка 5" },
        { src: "photo/6photo_2025-11-23_18-41-02.jpg", caption: "нуб фотка 6" },
        { src: "photo/7photo_2025-11-23_18-41-11.jpg", caption: "нуб фотка 7" },
        { src: "photo/8photo_2025-11-23_18-41-22.jpg", caption: "нуб фотка 8" },
        { src: "photo/9photo_2025-11-23_18-41-33.jpg", caption: "нуб фотка 9" }
    ],
    videocalls: [
        { src: "photo/v1photo_2025-11-23_18-41-56.jpg", caption: "милашечки" },
        { src: "photo/v2photo_2025-11-23_18-42-04.jpg", caption: "12 кубиков" },
        { src: "photo/v3photo_2025-11-23_18-42-11.jpg", caption: "я тут слишком крутая" },
        { src: "photo/v4photo_2025-11-23_18-42-18.jpg", caption: "лувики ❣" },
        { src: "photo/v5photo_2025-11-23_18-42-27.jpg", caption: "🧚‍♂️" },
        { src: "photo/v6photo_2025-11-23_18-42-35.jpg", caption: "лучший собеседник" },
        { src: "photo/v7photo_2025-11-23_18-42-43.jpg", caption: "принцесски" }
    ],
    ai_kids: [
        { src: "photo/d1photo_2025-11-23_18-43-09.jpg", caption: "красотка" },
        { src: "photo/мыphoto_2025-11-23_18-44-00.jpg", caption: "титаник"  },
        { src: "photo/d2photo_2025-11-23_18-43-20.jpg", caption: "поцык" }
    ],
    favorites: [
        { src: "photo/автphoto_2025-11-23_18-43-38.jpg", caption: "случайная фотка нас, эстетика прям как я люблю" },
        { src: "photo/любphoto_2025-11-23_18-44-07.jpg", caption: "это было очень приятно😊" },
        { src: "photo/окноphoto_2025-11-23_18-44-14.jpg", caption: "я всегда, когда мы едем в автике" },
        { src: "photo/рисунокphoto_2025-11-23_18-43-52.jpg", caption: "нашла какой то рисунок нас, не помню откуда он" },
        { src: "photo/холодphoto_2025-11-23_18-44-21.jpg", caption: "наш холодильник, когда жили вместе" }
    ]
};


// --- 2. Функция Счетчик Дней (БЕЗ ИЗМЕНЕНИЙ) ---
function updateCountdown() {
    const now = new Date();
    const diff = now - START_DATE;
    
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const totalMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById('days').textContent = totalDays.toLocaleString();
    document.getElementById('hours').textContent = totalHours.toLocaleString().padStart(2, '0');
    document.getElementById('minutes').textContent = totalMinutes.toLocaleString().padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000); 

// --- 3. Переключение Секций (БЕЗ ИЗМЕНЕНИЙ) ---
const navButtons = document.querySelectorAll('.nav-btn, .cta-button');

function showSection(sectionId) {
    if (isTransitioning) return;
    isTransitioning = true;

    const activeSection = document.querySelector('.page-section.active');
    if (activeSection) {
        activeSection.classList.remove('active');
        setTimeout(() => {
            activeSection.classList.add('hidden');
        }, 400); 
    }
    
    const newActiveSection = document.getElementById(sectionId);
    if (newActiveSection) {
        newActiveSection.classList.remove('hidden');
        setTimeout(() => {
            newActiveSection.classList.add('active');
            isTransitioning = false;
        }, 50); 
    }

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active-nav'));
    const targetNavBtn = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);
    if(targetNavBtn) {
        targetNavBtn.classList.add('active-nav');
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

navButtons.forEach(button => {
    button.addEventListener('click', function() {
        const sectionId = this.getAttribute('data-section');
        if (sectionId) {
            showSection(sectionId);
        }
    });
});


// --- 4. Интерактивные Flip Cards (БЕЗ ИЗМЕНЕНИЙ) ---
const flipCards = document.querySelectorAll('.flip-card');
flipCards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped'); 
    });
});

// --- 5. Эффект Параллакса (БЕЗ ИЗМЕНЕНИЙ) ---
const parallaxBg = document.querySelector('.parallax-bg');

window.addEventListener('scroll', function() {
    const homeSection = document.getElementById('home');
    if (homeSection && homeSection.classList.contains('active')) {
        let scrollPosition = window.pageYOffset;
        parallaxBg.style.transform = 'translateY(' + scrollPosition * 0.5 + 'px)';
    }
});

// ----------------------------------------------------
// 6. ЛОГИКА МОДАЛЬНОГО ОКНА С НАВИГАЦИЕЙ И СЧЕТЧИКОМ
// ----------------------------------------------------

// Функция для обновления контента модального окна (ВКЛЮЧАЯ СЧЕТЧИК)
function updateModalContent() {
    if (activePhotoList.length === 0) return;
    
    const photo = activePhotoList[currentPhotoIndex];
    modalImg.src = photo.src;
    captionText.innerHTML = photo.caption;
    
    // Главная логика: показываем навигацию ТОЛЬКО если это НЕ ХРОНИКА (isTimelineView = false)
    if (activePhotoList.length > 1 && !isTimelineView) {
         modalPrevBtn.style.display = 'block';
         modalNextBtn.style.display = 'block';
         photoCounter.style.display = 'block';
         photoCounter.textContent = `${currentPhotoIndex + 1}/${activePhotoList.length}`;
    } else {
         modalPrevBtn.style.display = 'none';
         modalNextBtn.style.display = 'none';
         photoCounter.style.display = 'none';
    }
}

// Переключение на следующее фото (циклически)
function nextPhoto() {
    if (isTimelineView) return; // Защита: не листаем, если это Хроника
    currentPhotoIndex = (currentPhotoIndex + 1) % activePhotoList.length;
    updateModalContent();
}

// Переключение на предыдущее фото (циклически)
function prevPhoto() {
    if (isTimelineView) return; // Защита: не листаем, если это Хроника
    currentPhotoIndex = (currentPhotoIndex - 1 + activePhotoList.length) % activePhotoList.length;
    updateModalContent();
}

// Закрытие модального окна
function closeModal() {
    modal.style.display = "none";
    activePhotoList = [];
    currentPhotoIndex = 0;
    isTimelineView = false; // <<< СБРАСЫВАЕМ ФЛАГ
}

// Обработчики кликов по кнопкам навигации
modalPrevBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    prevPhoto();
});

modalNextBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    nextPhoto();
});


// 6.1. ОБРАБОТЧИК ДЛЯ ГАЛЕРЕИ (Карточки) - Включает навигацию
const galleryCards = document.querySelectorAll('.gallery-card');

galleryCards.forEach(card => {
    card.addEventListener('click', function() {
        
        const categoryKey = this.getAttribute('data-category');
        
        if (GALLERY_DATA[categoryKey]) {
            activePhotoList = GALLERY_DATA[categoryKey];
            currentPhotoIndex = 0; 
            isTimelineView = false; // <<< ГОВОРИМ КОДУ: ЭТО ГАЛЕРЕЯ (НУЖНА НАВИГАЦИЯ)
        
            modal.style.display = "block";
            updateModalContent();
        }
    });
});

// 6.2. ОБРАБОТЧИКИ ДЛЯ ХРОНИКИ (TIMELINE) - Отключает навигацию
timelinePhotos.forEach((photo) => {
    photo.addEventListener('click', function() {
        
        const timelineContainer = this.closest('.page-section'); 
        const timelineItems = timelineContainer.querySelectorAll('.timeline-clickable-photo');
        
        activePhotoList = Array.from(timelineItems).map((el, i) => {
            if (el === this) {
                currentPhotoIndex = i; 
            }
            
            // Собираем подпись (дата + текст)
            let timelineItem = el.closest('.timeline-item');
            let textElement = timelineItem ? timelineItem.querySelector('p') : null;
            let dateElement = timelineItem ? timelineItem.querySelector('h3') : null;
            let dateText = dateElement ? dateElement.textContent : '';
            let caption = textElement ? `<strong>${dateText}</strong><br>${textElement.textContent}` : el.alt;
            
            return {
                src: el.src,
                caption: caption
            };
        });
        
        isTimelineView = true; // <<< ГОВОРИМ КОДУ: ЭТО ХРОНИКА (НАВИГАЦИЯ НЕ НУЖНА)
        
        modal.style.display = "block";
        updateModalContent();
    });
});


// 6.3. ОБЩЕЕ ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА (БЕЗ ИЗМЕНЕНИЙ)
document.querySelector('.close-btn').onclick = closeModal;

modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});