function toggleBurger() {
    document.documentElement.classList.toggle('burger-active');
    if (document.documentElement.classList.contains('burger-active')) {
        document.documentElement.style.overflow = 'hidden';
        document.documentElement.style.position = 'fixed';
        document.documentElement.style.width = '100%';
    } else {
        document.documentElement.style.overflow = '';
        document.documentElement.style.position = '';
        document.documentElement.style.width = '';
    }
}
window.addEventListener('resize', function () {
    if (window.innerWidth > 992 && document.documentElement.classList.contains('burger-active')) {
        toggleBurger();
    }
});