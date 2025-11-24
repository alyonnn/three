// --- Глобальные настройки ---
const START_DATE = new Date('2022-12-02T00:00:00'); 
let isTransitioning = false; 

// --- Глобальные переменные для модального окна ФОТО/ГРУППОВОГО ВИДЕО (photoModal) ---
const modal = document.getElementById("photoModal");
const modalImg = document.getElementById("modalImage");
const captionText = document.getElementById("caption");
const timelinePhotos = document.querySelectorAll('.timeline-clickable-photo');

const modalPrevBtn = document.getElementById('modalPrevBtn');
const modalNextBtn = document.getElementById('modalNextBtn');
const photoCounter = document.getElementById('photoCounter'); 

// --- НОВЫЕ ПЕРЕМЕННЫЕ ДЛЯ ГРУППОВОГО ВИДЕО ---
const groupVideoPlayer = document.getElementById("groupVideoPlayer");
let isVideoGroupView = false; // Флаг: если true, используем groupVideoPlayer

let activePhotoList = []; // Массив объектов {src, caption} для текущей группы
let currentPhotoIndex = 0; // Индекс текущего отображаемого фото
let isTimelineView = false; // ФЛАГ ДЛЯ ОТКЛЮЧЕНИЯ НАВИГАЦИИ В ХРОНИКЕ

// --- Глобальные переменные для модального окна ОДИНОЧНОГО ВИДЕО (videoModal) ---
const videoModal = document.getElementById("videoModal");
const videoPlayer = document.getElementById("videoPlayer");
const videoCaption = document.getElementById("videoCaption");

let currentVideo = null; // Для хранения ссылки на видео, которое нужно закрыть

// ----------------------------------------------------
// 1. ДАННЫЕ О ГАЛЕРЕЕ (СБОРКА ФОТО)
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
        { src: "photo/10photo_2025-11-24_13-50-40.jpg", caption: "нуб фотка 9" },
        { src: "photo/11photo_2025-11-24_13-51-24.jpg", caption: "вот это я офигела когда увидела что ты такое кидал мне" },
        { src: "photo/12photo_2025-11-24_13-51-33.jpg", caption: "вот что там было" },
        { src: "photo/11photo_2025-11-24_13-52-07.jpg", caption: "нуб фотка 12" },
        { src: "photo/9photo_2025-11-23_18-41-33.jpg", caption: "нуб фотка 13" }
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
        { src: "photo/d2photo_2025-11-23_18-43-20.jpg", caption: "поцык" },
           { src: "photo/мыphoto_2025-11-23_18-44-00.jpg", caption: "титаник"  },
          { src: "photo/ииphoto_2025-11-24_14-20-34.jpg", caption: "на море"  },
            { src: "photo/ии3photo_2025-11-24_14-21-05.jpg", caption: "ты"  },
         { src: "photo/ии2photo_2025-11-24_14-20-58.jpg", caption: "я"  }
                                

    ],
    favorites: [
        { src: "photo/автphoto_2025-11-23_18-43-38.jpg", caption: "случайная фотка нас, эстетика прям как я люблю" },
        { src: "photo/любphoto_2025-11-23_18-44-07.jpg", caption: "это было очень приятно😊" },
        { src: "photo/окноphoto_2025-11-23_18-44-14.jpg", caption: "я всегда, когда мы едем в автике" },
        { src: "photo/рисунокphoto_2025-11-23_18-43-52.jpg", caption: "нашла какой то рисунок нас, не помню откуда он" },
        { src: "photo/р1photo_2025-11-24_13-50-15.jpg", caption: "ты какой то несчастливый" },
       { src: "photo/р2photo_2025-11-24_13-50-56.jpg", caption: "это я как то создавала нас" },
        { src: "photo/р3photo_2025-11-24_13-51-04.jpg", caption: "это я раскрашивала по клеточкам" },
         { src: "photo/р4photo_2025-11-24_13-51-11.jpg", caption: "🦶" },
               { src: "photo/р6photo_2025-11-24_14-20-52.jpg", caption: "3 курс"  },
         { src: "photo/р5photo_2025-11-24_13-51-39.jpg", caption: "5 пара самая крутая" },
        { src: "photo/холодphoto_2025-11-23_18-44-21.jpg", caption: "наш холодильник, когда жили вместе" }
    ]
};

// ----------------------------------------------------
// 2. ДАННЫЕ О ВИДЕО-ГРУППАХ
// ----------------------------------------------------
const VIDEO_GROUP_DATA = {
    funny_trio: [
        { src: "video/video_2025-11-23_21-23-44.mp4", caption: "красота раз" },
        { src: "video/video_2025-11-23_21-23-50.mp4", caption: "красотка два" },
        { src: "video/video_2025-11-23_21-23-55.mp4", caption: "красотка три" }
    ]
    // Добавьте сюда другие группы видео
};


// --- 3. Функция Счетчик Дней (БЕЗ ИЗМЕНЕНИЙ) ---
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

// --- 4. Переключение Секций (ОБНОВЛЕННЫЙ СБРОС СКРОЛЛА) ---
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
            
            // ГАРАНТИРОВАННЫЙ СБРОС СКРОЛЛА
            setTimeout(() => {
                document.documentElement.scrollTop = 0; 
                document.body.scrollTop = 0; 
            }, 10); 

        }, 50); 
    }

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active-nav'));
    const targetNavBtn = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);
    if(targetNavBtn) {
        targetNavBtn.classList.add('active-nav');
    }
}

navButtons.forEach(button => {
    button.addEventListener('click', function() {
        const sectionId = this.getAttribute('data-section');
        if (sectionId) {
            showSection(sectionId);
        }
    });
});


// --- 5. Интерактивные Flip Cards (БЕЗ ИЗМЕНЕНИЙ) ---
const flipCards = document.querySelectorAll('.flip-card');
flipCards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped'); 
    });
});

// --- 6. Эффект Параллакса (БЕЗ ИЗМЕНЕНИЙ) ---
const parallaxBg = document.querySelector('.parallax-bg');

window.addEventListener('scroll', function() {
    const homeSection = document.getElementById('home');
    if (homeSection && homeSection.classList.contains('active')) {
        let scrollPosition = window.pageYOffset;
        parallaxBg.style.transform = 'translateY(' + scrollPosition * 0.5 + 'px)';
    }
});

// ----------------------------------------------------
// 7. ЛОГИКА МОДАЛЬНОГО ОКНА ФОТО / ГРУППОВОЕ ВИДЕО
// ----------------------------------------------------

// Функция для обновления контента модального окна (ВКЛЮЧАЯ СЧЕТЧИК)
function updateModalContent() {
    if (activePhotoList.length === 0) return;
    
    const item = activePhotoList[currentPhotoIndex];
    captionText.innerHTML = item.caption;
    
    // --- НОВАЯ ЛОГИКА ФОТО/ВИДЕО ---
    if (isVideoGroupView) {
        // Режим ГРУППОВОГО ВИДЕО
        modalImg.style.display = 'none';
        groupVideoPlayer.style.display = 'block';
        
        // Обязательно сбрасываем, чтобы загрузить новый файл
        groupVideoPlayer.src = item.src;
        groupVideoPlayer.load();
        groupVideoPlayer.play();
        
    } else {
        // Режим ФОТО (Галерея или Хроника)
        groupVideoPlayer.pause(); // Останавливаем плеер на всякий случай
        groupVideoPlayer.style.display = 'none';
        modalImg.style.display = 'block';
        
        modalImg.src = item.src;
    }
    
    // Главная логика: показываем навигацию ТОЛЬКО если это НЕ ХРОНИКА
    const showNavigation = activePhotoList.length > 1 && !isTimelineView;

    if (showNavigation) {
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

// Переключение на следующее фото/видео (циклически)
function nextPhoto() {
    if (isTimelineView) return; 
    if (isVideoGroupView) groupVideoPlayer.pause(); // Пауза перед переключением видео

    currentPhotoIndex = (currentPhotoIndex + 1) % activePhotoList.length;
    updateModalContent();
}

// Переключение на предыдущее фото/видео (циклически)
function prevPhoto() {
    if (isTimelineView) return; 
    if (isVideoGroupView) groupVideoPlayer.pause(); // Пауза перед переключением видео

    currentPhotoIndex = (currentPhotoIndex - 1 + activePhotoList.length) % activePhotoList.length;
    updateModalContent();
}

// Закрытие модального окна ФОТО/ГРУППОВОГО ВИДЕО
function closeModal() {
    modal.style.display = "none";
    
    // ОСТАНАВЛИВАЕМ видео, если оно играло
    if (isVideoGroupView) {
        groupVideoPlayer.pause();
        groupVideoPlayer.currentTime = 0;
    }
    
    activePhotoList = [];
    currentPhotoIndex = 0;
    isTimelineView = false; 
    isVideoGroupView = false; // СБРАСЫВАЕМ ФЛАГ ВИДЕО-ГРУППЫ
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


// 7.1. ОБРАБОТЧИК ДЛЯ ГАЛЕРЕИ (Карточки) - ФОТО
const galleryCards = document.querySelectorAll('.gallery-card');

galleryCards.forEach(card => {
    card.addEventListener('click', function() {
        const categoryKey = this.getAttribute('data-category');
        
        if (GALLERY_DATA[categoryKey]) {
            activePhotoList = GALLERY_DATA[categoryKey];
            currentPhotoIndex = 0; 
            isTimelineView = false;
            isVideoGroupView = false; // Убеждаемся, что это не видео-группа
        
            modal.style.display = "block";
            updateModalContent();
        }
    });
});

// 7.2. ОБРАБОТЧИКИ ДЛЯ ХРОНИКИ (TIMELINE) - ФОТО
timelinePhotos.forEach((photo) => {
    photo.addEventListener('click', function() {
        
        const timelineContainer = this.closest('.page-section'); 
        const timelineItems = timelineContainer.querySelectorAll('.timeline-clickable-photo');
        
        activePhotoList = Array.from(timelineItems).map((el, i) => {
            if (el === this) {
                currentPhotoIndex = i; 
            }
            // ... (логика сбора подписи без изменений) ...
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
        
        isTimelineView = true;
        isVideoGroupView = false; // Убеждаемся, что это не видео-группа
        
        modal.style.display = "block";
        updateModalContent();
    });
});

// 7.3. НОВЫЙ ОБРАБОТЧИК ДЛЯ ВИДЕО-ГРУПП (Включает навигацию)
const groupVideoCards = document.querySelectorAll('.video-item[data-group]');

groupVideoCards.forEach(card => {
    card.addEventListener('click', function() {
        const groupKey = this.getAttribute('data-group');
        
        if (VIDEO_GROUP_DATA[groupKey]) {
            activePhotoList = VIDEO_GROUP_DATA[groupKey];
            currentPhotoIndex = 0; 
            
            // Устанавливаем флаги для группового видео
            isTimelineView = false; 
            isVideoGroupView = true; 
            
            // Используем ту же модалку, что и для фото
            modal.style.display = "block";
            updateModalContent();
        }
    });
});


// 7.4. ОБЩЕЕ ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА ФОТО/ГРУППОВОГО ВИДЕО
document.querySelector('.close-btn').onclick = closeModal;

modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});


// ----------------------------------------------------
// 8. ЛОГИКА ОДИНОЧНОГО ВИДЕО-МОДАЛЬНОГО ОКНА
// ----------------------------------------------------

function openVideoModal(src, caption) {
    videoPlayer.src = src;
    videoCaption.textContent = caption;
    videoModal.style.display = "block";
    
    // Включаем воспроизведение, как только модалка открыта
    videoPlayer.load();
    videoPlayer.play();
    
    // Сохраняем ссылку для закрытия
    currentVideo = videoPlayer; 
}

function closeVideoModal() {
    videoModal.style.display = "none";
    
    // Обязательно останавливаем воспроизведение
    if (currentVideo) {
        currentVideo.pause();
        currentVideo.currentTime = 0; // Сбрасываем на начало
    }
}