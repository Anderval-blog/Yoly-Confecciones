// Variable global para rastrear el producto seleccionado
let currentProduct = "";

// Función mejorada para abrir el modal
function openModal(name, price) {
    console.log("Abriendo modal para:", name); // Para depuración
    currentProduct = name;
    
    const infoDiv = document.getElementById('modalProductInfo');
    if(infoDiv) {
        infoDiv.innerHTML = `
            <div style="text-align:center; margin-bottom:15px;">
                <h3 style="color:#333;">${name}</h3>
                <p style="color:#888;">Precio: ${price}</p>
                <hr style="border:0; border-top:1px solid #eee; margin:10px 0;">
            </div>
        `;
    }
    
    const modal = document.getElementById('productModal');
// Cambia esto dentro de la función openModal:
    if(modal) {
    modal.style.display = "flex"; // Antes decía "block"
}

}

// Función para cerrar el modal
function closeModal() {
    document.getElementById('productModal').style.display = "none";
}

// Lógica para las flechas del carrusel
function moveCarousel(direction) {
    const container = document.getElementById('bestSellersCarousel');
    const scrollAmount = 280; // Ancho del item + gap
    container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// Evento de envío del formulario
document.getElementById('whatsappForm').onsubmit = function(e) {
    e.preventDefault();
    
    const client = document.getElementById('clientName').value;
    const recipient = document.getElementById('recipientName').value;
    const address = document.getElementById('address').value;
    const date = document.getElementById('deliveryDate').value;
    const messageText = document.getElementById('dedication').value;

    const fullMessage = `*NUEVO PEDIDO - ROJAS FLORERÍA*\n\n` +
                        `*Producto:* ${currentProduct}\n` +
                        `*Cliente:* ${client}\n` +
                        `*Destinatario:* ${recipient}\n` +
                        `*Dirección:* ${address}\n` +
                        `*Fecha/Hora:* ${date}\n` +
                        `*Dedicatoria:* ${messageText}`;

    const whatsappUrl = `https://wa.me/51960712178?text=${encodeURIComponent(fullMessage)}`;
    window.open(whatsappUrl, '_blank');
};

// Cerrar modal si se hace clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target == modal) {
        closeModal();
    }
};


// Lógica para las flechas del carrusel de PRODUCTOS
function moveProductCarousel(direction) {
    const container = document.getElementById('productCarousel');
    // Obtenemos el ancho de una tarjeta de producto (incluyendo el gap)
    const cardWidth = container.querySelector('.product-card-item').offsetWidth + 20; 
    
    container.scrollBy({
        left: direction * cardWidth, // Se mueve exactamente una tarjeta a la vez
        behavior: 'smooth'
    });
}

// --- LÓGICA PARA EL SUBRAYADO ACTIVO EN LA NAVBAR ---

// Seleccionamos todos los enlaces de navegación
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', function() {
        // 1. Eliminamos la clase 'active' de cualquier otro enlace que la tenga
        navLinks.forEach(nav => nav.classList.remove('active'));
        
        // 2. Añadimos la clase 'active' al enlace que acabamos de presionar
        this.classList.add('active');
    });
});

// =========================================
// LÓGICA DEL CARRUSEL DE IMÁGENES (HERO)
// =========================================
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');

function changeSlide(direction) {
    if (slides.length === 0) return; // Evita errores si no hay diapositivas

    // Quitamos la clase 'active' de la imagen actual
    slides[currentSlideIndex].classList.remove('active');
    
    // Calculamos el índice de la siguiente imagen
    currentSlideIndex = currentSlideIndex + direction;
    
    // Lógica para dar la vuelta al carrusel
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    // Mostramos la nueva imagen
    slides[currentSlideIndex].classList.add('active');
}

// =======================================================
// LÓGICA DEL MENÚ RESPONSIVO Y SUBMENÚS EN MÓVIL
// =======================================================
const mobileMenuBtn = document.getElementById('mobile-menu');
const navLinksContainer = document.getElementById('nav-links'); // Vinculado al ID de tu contenedor principal
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
const backButtons = document.querySelectorAll('.back-btn');

// 1. Manejo de apertura y cierre del menú hamburguesa básico
if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener('click', function() {
        navLinksContainer.classList.toggle('active');
        
        // Si el usuario decide cerrar el menú completo, limpiamos cualquier submenú que haya quedado abierto
        if (!navLinksContainer.classList.contains('active')) {
            clearMobileSubmenus();
        }
    });
}

// 2. Control del clic sobre categorías con submenú (dropdown)
dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        // Limitamos este comportamiento estrictamente a resoluciones móviles (<= 900px)
        if (window.innerWidth <= 900) {
            e.preventDefault(); // Detiene la acción por defecto del enlace
            
            const parentDropdown = this.closest('.dropdown');
            if (parentDropdown && navLinksContainer) {
                // Activamos los estados en los contenedores correspondientes
                navLinksContainer.classList.add('submenu-active');
                parentDropdown.classList.add('dropdown-open');
            }
        }
    });
});

// 3. Control de clic sobre los botones de "Volver al menú principal"
backButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation(); // Evita que el evento escale a elementos contenedores
        clearMobileSubmenus();
    });
});

// 4. Cerrar el menú al hacer clic fuera de él (en el 10% restante del dispositivo)
document.addEventListener('click', function(event) {
    // Verificamos si el menú móvil está abierto actualmente
    if (navLinksContainer && navLinksContainer.classList.contains('active')) {
        
        // Comprobamos si el clic ocurrió DENTRO del menú o DENTRO del botón hamburguesa
        const isClickInsideMenu = navLinksContainer.contains(event.target);
        const isClickOnButton = mobileMenuBtn.contains(event.target);

        // Si el clic NO fue en el menú, ni en el botón hamburguesa...
        if (!isClickInsideMenu && !isClickOnButton) {
            // Cerramos el menú
            navLinksContainer.classList.remove('active');
            
            // Y reseteamos los submenús para la próxima vez que se abra
            clearMobileSubmenus();
        }
    }
});

// Función de limpieza encargada de remover los estados de aislamiento
function clearMobileSubmenus() {
    if (navLinksContainer) {
        navLinksContainer.classList.remove('submenu-active');
    }
    document.querySelectorAll('.dropdown').forEach(item => {
        item.classList.remove('dropdown-open');
    });
}

// 3. Volver al menú principal desde un submenú
backButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const submenu = this.closest('.dropdown-menu'); // Busca el contenedor padre del submenú
        if (submenu) {
            submenu.classList.remove('active-submenu');
        }
    });
});


// =========================================
// [NUEVO] SOPORTE TÁCTIL PARA EL BANNER (SWIPE)
// =========================================
const heroCarousel = document.querySelector('.hero-carousel');
let touchStartX = 0;
let touchEndX = 0;

// Umbral mínimo para considerar que fue un deslizamiento (en píxeles)
const swipeThreshold = 50; 

if (heroCarousel) {
    // 1. Capturar dónde inicia el toque
    heroCarousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true }); // passive mejora el rendimiento del scroll

    // 2. Capturar dónde termina el toque y calcular la dirección
    heroCarousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;

    // Si el deslizamiento es mayor que el umbral
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Deslizamiento hacia la DERECHA -> Imagen ANTERIOR
            changeSlide(-1);
        } else {
            // Deslizamiento hacia la IZQUIERDA -> Imagen SIGUIENTE
            changeSlide(1);
        }
    }
}


// =========================================
// LÓGICA PARA LA SECCIÓN BUZOS DE COLEGIO
// =========================================

// 1. Mover el carrusel de rectángulos pequeños de 1 en 1 (CORREGIDO)
function moveSchoolCarousel(direction) {
    const carousel = document.getElementById('schoolCarousel');
    const firstBadge = carousel.querySelector('.school-badge');
    
    if (firstBadge) {
        // Obtenemos el ancho exacto y lo redondeamos para evitar fracciones de píxel
        const badgeWidth = Math.round(firstBadge.offsetWidth);
        const gap = 12; // el gap de tu CSS
        
        // El salto exacto
        const scrollAmount = badgeWidth + gap;
        
        carousel.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }
}

// 2. Filtrar las tarjetas de productos por colegio seleccionado (CORREGIDO)
function filterSchool(schoolTarget, elementSelected) {
    // A) Actualizar el rectángulo activo de color azul
    const badges = document.querySelectorAll('.school-badge');
    badges.forEach(badge => badge.classList.remove('active'));
    elementSelected.classList.add('active');

    // B) Mostrar u Ocultar las tarjetas de buzos
    const productCards = document.querySelectorAll('.school-card');
    
    productCards.forEach(card => {
        const cardSchool = card.getAttribute('data-school-group');
        
        if (schoolTarget === 'all' || cardSchool === schoolTarget) {
            card.style.display = 'flex'; // Muestra el producto (usa flex para mantener la estructura interna)
        } else {
            card.style.display = 'none'; // CORREGIDO: Se eliminó el '.style' duplicado
        }
    });
}