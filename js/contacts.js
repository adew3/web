function applyContactFormPrefill() {
    const session = TicketGo.getSession();
    if (!session) return;

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');

    if (nameInput && !nameInput.value) {
        nameInput.value = session.username || '';
    }

    if (emailInput && !emailInput.value) {
        emailInput.value = session.email || '';
    }
}

function getContactRequestEndpoint() {
    return window.CONTACT_REQUEST_ENDPOINT || '';
}

async function sendContactRequestToServer(payload) {
    const endpoint = getContactRequestEndpoint();
    if (!endpoint) return { ok: true, skipped: true };

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        return {
            ok: false,
            errors: [{ field: 'message', message: 'Сервер тимчасово не прийняв запит.', source: 'server' }]
        };
    }

    return { ok: true };
}

function handleContactSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const payload = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        topic: formData.get('topic'),
        message: formData.get('message').trim()
    };

    const validation = validateContactRequest(payload);
    if (!validation.isValid) {
        showErrors(form, validation.errors);
        document.getElementById('contact-success')?.classList.add('is-hidden');
        return;
    }

    sendContactRequestToServer(payload)
        .then(result => {
            if (!result.ok) {
                showErrors(form, result.errors);
                return;
            }

            TicketGo.saveContactRequest(payload);

            form.reset();
            applyContactFormPrefill();
            clearErrors(form);

            const successMessage = document.getElementById('contact-success');
            successMessage?.classList.remove('is-hidden');
        })
        .catch(() => {
            showErrors(form, [
                { field: 'message', message: 'Не вдалося відправити запит на сервер. Запит не збережено.', source: 'server' }
            ]);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    applyContactFormPrefill();
    document.getElementById('contact-form')?.addEventListener('submit', handleContactSubmit);
});
