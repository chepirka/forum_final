// Функция для загрузки данных из JSON
async function loadSchoolsData() {
    try {
        const response = await fetch('../js/university-data.json');
        if (!response.ok) {
            throw new Error('Не удалось загрузить данные');
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
}

// Функция для отображения карточек школ
async function renderSchools() {
    const schoolsGrid = document.getElementById('schoolsGrid');
    schoolsGrid.innerHTML = '<div class="loading">Загрузка данных...</div>';

    const schoolsData = await loadSchoolsData();

    // Фильтруем пустые школы (где нет имени)
    const validSchools = schoolsData.filter(school => school.name && school.name.trim() !== '');

    if (validSchools.length === 0) {
        schoolsGrid.innerHTML = '<div class="no-results">Школы не найдены</div>';
        return;
    }

    schoolsGrid.innerHTML = '';

    validSchools.forEach(school => {
        const card = document.createElement('div');
        card.className = 'school-card';

        // Формируем бейдж "Популярная" если нужно
        const badgeHTML = school.isPopular ?
            '<div class="school-badge"><i class="fas fa-fire"></i> Популярная</div>' : '';

        card.innerHTML = `
            <div class="school-image" style="background-image: url('${school.image || '../images/default-school.jpg'}')">
                ${badgeHTML}
            </div>
            <div class="school-content">
                <h3 class="school-name">${school.name}</h3>
                <div class="school-info">
                    <div class="school-location">
                        <i class="fas fa-map-marker-alt"></i> ${school.address || 'Адрес не указан'}
                    </div>
                </div>
                <div class="school-actions">
                    <a href="#" class="details-btn" data-id="${school.id}">Подробнее</a>
                </div>
            </div>
        `;

        schoolsGrid.appendChild(card);
    });

    // Добавляем обработчики для кнопок "Подробнее"
    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const schoolId = parseInt(this.getAttribute('data-id'));
            showSchoolDetails(schoolId);
        });
    });

    // Добавляем обработчики для кнопок "Избранное"
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const schoolId = parseInt(this.getAttribute('data-id'));
            const school = validSchools.find(s => s.id === schoolId);
            if (school) {
                school.isFavorite = !school.isFavorite;
                this.classList.toggle('active');
            }
        });
    });
}

// Функция для показа деталей школы
function showSchoolDetails(schoolId) {
    loadSchoolsData().then(schoolsData => {
        const school = schoolsData.find(item => item.id === schoolId);
        if (!school) return;

        sessionStorage.setItem('currentSchool', JSON.stringify(school));

        // Проверяем доступность страницы перед переходом
        fetch('school-details.html')
            .then(response => {
                if (response.ok) {
                    window.location.href = 'school-details.html';
                } else {
                    // Если файл не найден, показываем модальное окно
                    showSchoolModal(school);
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                showSchoolModal(school);
            });
    });
}

// Функция для показа модального окна с информацией
function showSchoolModal(school) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close-btn">&times;</button>
            <h2>${school.name}</h2>
            <div class="modal-school-info">
                <p><strong>Адрес:</strong> ${school.address || 'Не указан'}</p>
                ${school.profile && school.profile.length > 0 ?
            `<p><strong>Профили:</strong> ${school.profile.join(", ")}</p>` : ''}
                ${school.contacts ? `
                    <p><strong>Телефон:</strong> ${school.contacts.phone || 'Не указан'}</p>
                    <p><strong>Email:</strong> ${school.contacts.email || 'Не указан'}</p>
                    ${school.contacts.website ? `<p><strong>Сайт:</strong> <a href="${school.contacts.website}" target="_blank">${school.contacts.website}</a></p>` : ''}
                ` : ''}
            </div>
            <div class="modal-school-description">
                <h3>Описание:</h3>
                <p>${school.fullDescription || 'Описание школы отсутствует.'}</p>
            </div>
        </div>
    `;

    modal.querySelector('.modal-close-btn').addEventListener('click', () => {
        modal.remove();
    });

    document.body.appendChild(modal);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    renderSchools();
});

// Основная функция для отображения школ с учетом фильтров и поиска
async function renderFilteredSchools() {
    const searchInput = document.querySelector('.search-input').value.toLowerCase();
    const districtFilter = document.getElementById('districtFilter').value;
    const profileFilter = document.getElementById('profileFilter').value;

    const schoolsData = await loadSchoolsData();

    // Фильтрация данных
    const filteredSchools = schoolsData.filter(school => {
        // Проверка поискового запроса
        const matchesSearch = searchInput === '' ||
            school.name.toLowerCase().includes(searchInput) ||
            (school.address && school.address.toLowerCase().includes(searchInput));

        // Проверка фильтра по району
        const matchesDistrict = districtFilter === '' ||
            (school.district && school.district === districtFilter);

        // Проверка фильтра по школьному профилю (если есть)
        const matchesProfile = profileFilter === '' ||
            (school.profile && school.profile.some(p => p.includes(profileFilter)));

        return matchesSearch && matchesDistrict && matchesProfile;
    });

    // Отображаем отфильтрованные школы
    displaySchools(filteredSchools);
}

// Функция для отображения списка школ
function displaySchools(schools) {
    const schoolsGrid = document.getElementById('schoolsGrid');
    schoolsGrid.innerHTML = '';

    const validSchools = schools.filter(school => school.name && school.name.trim() !== '');

    if (validSchools.length === 0) {
        schoolsGrid.innerHTML = '<div class="no-results">Школы не найдены</div>';
        return;
    }

    validSchools.forEach(school => {
        const card = document.createElement('div');
        card.className = 'school-card';

        const badgeHTML = school.isPopular ?
            '<div class="school-badge"><i class="fas fa-fire"></i> Популярная</div>' : '';

        card.innerHTML = `
            <div class="school-image" style="background-image: url('${school.image || '../images/default-school.jpg'}')">
                ${badgeHTML}
            </div>
            <div class="school-content">
                <h3 class="school-name">${school.name}</h3>
                <div class="school-info">
                    <div class="school-location">
                        <i class="fas fa-map-marker-alt"></i> ${school.address || 'Адрес не указан'}
                    </div>
                    ${school.district ? `<div class="school-district">Район: ${school.district}</div>` : ''}
                </div>
                <div class="school-actions">
                    <a href="#" class="details-btn" data-id="${school.id}">Подробнее</a>
                </div>
            </div>
        `;

        schoolsGrid.appendChild(card);
    });

    // Назначаем обработчики событий
    setupEventHandlers(validSchools);
}

// Функция для настройки обработчиков событий
function setupEventHandlers(schools) {
    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const schoolId = parseInt(this.getAttribute('data-id'));
            showSchoolDetails(schoolId);
        });
    });

    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const schoolId = parseInt(this.getAttribute('data-id'));
            const school = schools.find(s => s.id === schoolId);
            if (school) {
                school.isFavorite = !school.isFavorite;
                this.classList.toggle('active');
            }
        });
    });
}

// Функция для показа деталей школы
function showSchoolDetails(schoolId) {
    loadSchoolsData().then(schoolsData => {
        const school = schoolsData.find(item => item.id === schoolId);
        if (!school) return;

        sessionStorage.setItem('currentSchool', JSON.stringify(school));
        window.location.href = 'school-details.html';
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Первоначальная загрузка
    renderFilteredSchools();

    // Обработчики для поиска и фильтров (добавляем новый фильтр)
    document.querySelector('.search-input').addEventListener('input', renderFilteredSchools);
    document.getElementById('districtFilter').addEventListener('change', renderFilteredSchools);
    document.getElementById('profileFilter').addEventListener('change', renderFilteredSchools);
    document.querySelector('.search-button').addEventListener('click', renderFilteredSchools);

    // Обработчик для сброса фильтров (добавляем сброс нового фильтра)
    document.querySelector('.reset-filters').addEventListener('click', () => {
        document.querySelector('.search-input').value = '';
        document.getElementById('districtFilter').value = '';
        document.getElementById('profileFilter').value = '';
        renderFilteredSchools();
    });
});