document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const responseContainer = document.getElementById('formResponse');
    
    // REEMPLAZA ESTA URL por la de tu Google Apps Script actualizada
    const URL_GOOGLE_SCRIPT = 'https://script.google.com/macros/s/AKfycbw2euHMRp7o3aiRXF5TgIMlntPzh0FFE5rFAgrOrtFeaFAJZgLXMDoRxoqeCDZtrTD6/exec';

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const telefonoInput = document.getElementById('telefono').value.trim();
            
            // Validación extra en JS por seguridad: Si hay algo escrito, debe tener 9 dígitos
            if (telefonoInput.length > 0 && telefonoInput.length !== 9) {
                showResponse('El teléfono debe tener exactamente 9 dígitos.', 'error');
                return;
            }
            
            const submitBtn = contactForm.querySelector('.btn-submit-contact');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            // Ocultar mensajes previos
            responseContainer.style.display = 'none';

            // Estructuramos los datos como parámetros de formulario tradicionales (Ultra rápido)
            const formData = new URLSearchParams();
            formData.append('nombre', document.getElementById('nombre').value);
            formData.append('apellidos', document.getElementById('apellidos').value);
            formData.append('correo', document.getElementById('correo').value);
            formData.append('telefono', telefonoInput);
            formData.append('mensaje', document.getElementById('mensaje').value);

            try {
                // Petición optimizada
                await fetch(URL_GOOGLE_SCRIPT, {
                    method: 'POST',
                    mode: 'no-cors', 
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData.toString()
                });

                // Renderizar mensaje de éxito responsivo en la página
                showResponse('¡Mensaje enviado con éxito! Nos comunicaremos contigo pronto.', 'success');
                contactForm.reset(); 

            } catch (error) {
                console.error('Error:', error);
                showResponse('Hubo un inconveniente al enviar tu mensaje. Por favor, inténtalo de nuevo.', 'error');
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Función auxiliar para mostrar las respuestas estéticas en la página
    function showResponse(message, type) {
        if (!responseContainer) return;
        responseContainer.textContent = message;
        responseContainer.className = `form-response-message ${type}`;
        responseContainer.style.display = 'block';
    }
});