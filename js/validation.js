const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIST_STATES = {
    loading: 'loading',
    empty: 'empty',
    error: 'error',
    ready: 'ready'
};

function makeError(field, message, source = 'client') {
    return { field, message, source };
}

function isBlank(value) {
    return String(value || '').trim() === '';
}

function readForm(form) {
    return Object.fromEntries(new FormData(form).entries());
}

function showErrors(form, errors = []) {
    clearErrors(form);

    errors.forEach(error => {
        const errorNode = form.querySelector(`[data-error-for="${error.field}"]`);
        const field = form.elements[error.field];

        if (errorNode) {
            const prefix = error.source === 'server' ? 'Сервер: ' : '';
            errorNode.textContent = `${prefix}${error.message}`;
            errorNode.hidden = false;
        }

        if (field) {
            field.classList.add('has-error');
            field.setAttribute('aria-invalid', 'true');
        }
    });
}

function clearErrors(form) {
    form.querySelectorAll('[data-error-for]').forEach(errorNode => {
        errorNode.textContent = '';
        errorNode.hidden = true;
    });

    [...form.elements].forEach(field => {
        field.classList?.remove('has-error');
        field.removeAttribute?.('aria-invalid');
    });
}

function setListState(container, state, message = '') {
    if (!container) return;

    container.dataset.state = state;

    if (state === LIST_STATES.ready) {
        return;
    }

    const labels = {
        [LIST_STATES.loading]: 'Завантаження...',
        [LIST_STATES.empty]: 'Даних поки що немає.',
        [LIST_STATES.error]: 'Не вдалося завантажити дані.'
    };

    container.innerHTML = `<div class="list-state list-state-${state}">${message || labels[state]}</div>`;
}

function validateSignup(data, users = []) {
    const errors = [];
    const username = data.username?.trim();
    const email = data.email?.trim();
    const password = data.password || '';

    if (isBlank(username)) errors.push(makeError('username', 'Вкажіть імʼя.'));
    if (isBlank(email)) {
        errors.push(makeError('email', 'Вкажіть email.'));
    } else if (!EMAIL_PATTERN.test(email)) {
        errors.push(makeError('email', 'Вкажіть коректний email.'));
    } else if (users.some(user => user.email?.toLowerCase() === email.toLowerCase())) {
        errors.push(makeError('email', 'Цей email вже зареєстрований.'));
    }
    if (password.length < 6) errors.push(makeError('password', 'Пароль має містити мінімум 6 символів.'));

    return { isValid: errors.length === 0, errors };
}

function validateSignin(data) {
    const errors = [];
    const email = data.email?.trim();

    if (isBlank(email)) {
        errors.push(makeError('email', 'Вкажіть email.'));
    } else if (!EMAIL_PATTERN.test(email)) {
        errors.push(makeError('email', 'Вкажіть коректний email.'));
    }
    if (isBlank(data.password)) errors.push(makeError('password', 'Вкажіть пароль.'));

    return { isValid: errors.length === 0, errors };
}

function validateContactRequest(data) {
    const errors = [];
    const email = data.email?.trim();

    if (isBlank(data.name)) errors.push(makeError('name', 'Вкажіть імʼя.'));
    if (isBlank(email)) {
        errors.push(makeError('email', 'Вкажіть email.'));
    } else if (!EMAIL_PATTERN.test(email)) {
        errors.push(makeError('email', 'Вкажіть коректний email.'));
    }
    if (isBlank(data.topic)) errors.push(makeError('topic', 'Оберіть тему.'));
    if (isBlank(data.message)) errors.push(makeError('message', 'Опишіть ваше питання.'));

    return { isValid: errors.length === 0, errors };
}

function validateHomeSearch(data) {
    const errors = [];

    if (isBlank(data.from)) errors.push(makeError('from', 'Вкажіть місто відправлення.'));
    if (isBlank(data.to)) errors.push(makeError('to', 'Вкажіть місто прибуття.'));

    return { isValid: errors.length === 0, errors };
}

function validateRoute(data) {
    const errors = [];
    const price = Number(data.price);

    if (isBlank(data.from)) errors.push(makeError('from', 'Вкажіть місто відправлення.'));
    if (isBlank(data.to)) errors.push(makeError('to', 'Вкажіть місто прибуття.'));
    if (isBlank(data.date)) errors.push(makeError('date', 'Оберіть дату.'));
    if (isBlank(data.time)) errors.push(makeError('time', 'Оберіть час.'));
    if (!price || price < 1) errors.push(makeError('price', 'Ціна має бути більше 0.'));
    if (isBlank(data.transport)) errors.push(makeError('transport', 'Оберіть транспорт.'));

    return { isValid: errors.length === 0, errors };
}

function validatePopularRoute(data) {
    const errors = [];
    const price = Number(data.price);

    if (isBlank(data.from)) errors.push(makeError('from', 'Вкажіть місто відправлення.'));
    if (isBlank(data.to)) errors.push(makeError('to', 'Вкажіть місто прибуття.'));
    if (!price || price < 1) errors.push(makeError('price', 'Ціна має бути більше 0.'));

    return { isValid: errors.length === 0, errors };
}
