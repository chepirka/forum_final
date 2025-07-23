document.addEventListener('DOMContentLoaded', function () {
    // Получаем данные школы из sessionStorage
    const schoolData = JSON.parse(sessionStorage.getItem('currentSchool'));

    if (schoolData) {
        // Заполняем заголовок
        document.getElementById('schoolName').textContent = schoolData.name;

        // Заполняем рейтинг
        // let stars = '';
        // for (let i = 0; i < 5; i++) {
        //     stars += i < Math.floor(schoolData.rating) ? '★' : '☆';
        // }
        // document.getElementById('schoolRating').innerHTML = `
        //     ${stars} <span style="margin-left: 0.5rem;">${schoolData.rating}</span>
        // `;

        // Заполняем галерею с кнопкой "Показать все"
        if (schoolData.photos && schoolData.photos.length > 0) {
            const mainPhoto = document.getElementById('mainPhoto');
            const thumbnailsContainer = document.getElementById('thumbnails');

            // Устанавливаем первое фото как основное
            mainPhoto.style.backgroundImage = `url('${schoolData.photos[0]}')`;

            // Показываем только первые 14 фото + кнопку "Показать все" на 14 месте
            const maxVisibleThumbs = 14;
            const totalPhotos = schoolData.photos.length;
            const showAllNeeded = totalPhotos > maxVisibleThumbs + 1;

            // Добавляем миниатюры
            const thumbsToShow = showAllNeeded ?
                schoolData.photos.slice(0, maxVisibleThumbs) :
                schoolData.photos;

            thumbsToShow.forEach((photo, index) => {
                const thumb = document.createElement('div');
                thumb.className = 'thumbnail';
                thumb.style.backgroundImage = `url('${photo}')`;
                thumb.addEventListener('click', () => {
                    mainPhoto.style.backgroundImage = `url('${photo}')`;
                });
                thumbnailsContainer.appendChild(thumb);
            });

            // Добавляем кнопку "Показать все" на 14 месте, если фото больше 14
            if (showAllNeeded) {
                const showAllBtn = document.createElement('div');
                showAllBtn.className = 'show-all-btn';
                showAllBtn.innerHTML = `<i class="fas fa-images"></i> Показать все (${totalPhotos})`;

                showAllBtn.addEventListener('click', function () {
                    openGalleryModal(schoolData.photos);
                });

                thumbnailsContainer.appendChild(showAllBtn);
            }

            // Клик по основной фото тоже открывает модальное окно
            mainPhoto.addEventListener('click', function () {
                openGalleryModal(schoolData.photos, schoolData.photos.indexOf(mainPhoto.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, "$1")));
            });
        }

        // Остальной код заполнения данных остается без изменений
        document.getElementById('schoolDescription').textContent = schoolData.fullDescription;

        const profileContainer = document.getElementById('profileContainer');
        schoolData.profile.forEach(prof => {
            const profEl = document.createElement('div');
            profEl.textContent = `✓ ${prof}`;
            profileContainer.appendChild(profEl);
        });

        document.getElementById('schoolAddress').textContent = schoolData.address;
        document.getElementById('schoolPhone').textContent = schoolData.contacts.phone;
        document.getElementById('schoolEmail').textContent = schoolData.contacts.email;
        document.getElementById('schoolWebsite').textContent = schoolData.contacts.website;
        document.getElementById('schoolWebsite').href = schoolData.contacts.website;

        if (schoolData.reviews && schoolData.reviews.length > 0) {
            const reviewsContainer = document.getElementById('schoolReviews');
            schoolData.reviews.forEach(review => {
                const reviewEl = document.createElement('div');
                reviewEl.innerHTML = `
                            <div style="margin-bottom: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                                <strong>${review.author}</strong>
                                <div>${'★'.repeat(review.rating)}</div>
                                <p>${review.text}</p>
                            </div>
                        `;
                reviewsContainer.appendChild(reviewEl);
            });
        }
    } else {
        // Если данные не загружены, перенаправляем обратно
        window.location.href = 'schools.html';
    }

    // Обработчики для модального окна
    document.querySelector('.modal-close').addEventListener('click', closeGalleryModal);
    document.getElementById('galleryModal').addEventListener('click', function (e) {
        if (e.target === this) closeGalleryModal();
    });
});

// Функция открытия модального окна с галереей
function openGalleryModal(photos, initialIndex = 0) {
    const modal = document.getElementById('galleryModal');
    const mainPhoto = document.getElementById('modalMainPhoto');
    const thumbnailsContainer = document.getElementById('modalThumbnails');

    // Очищаем предыдущие миниатюры
    thumbnailsContainer.innerHTML = '';

    // Устанавливаем начальное изображение
    if (initialIndex >= 0 && initialIndex < photos.length) {
        mainPhoto.style.backgroundImage = `url('${photos[initialIndex]}')`;
    } else {
        mainPhoto.style.backgroundImage = `url('${photos[0]}')`;
    }

    // Добавляем миниатюры
    photos.forEach((photo, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'modal-thumb';
        if (index === (initialIndex >= 0 ? initialIndex : 0)) {
            thumb.classList.add('active');
        }
        thumb.style.backgroundImage = `url('${photo}')`;
        thumb.addEventListener('click', function () {
            mainPhoto.style.backgroundImage = `url('${photo}')`;
            document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
        thumbnailsContainer.appendChild(thumb);
    });

    // Показываем модальное окно
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Функция закрытия модального окна
function closeGalleryModal() {
    document.getElementById('galleryModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}