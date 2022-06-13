class FormValidator {
    constructor(form) {
        try {
            this.validateParams(form);
            this.form = form;
            this.form.setAttribute('novalidate', true);
            this.form.addEventListener('submit', this.validate.bind(this));
            this.formFields = Array.prototype.filter.bind(this.form.elements)(this.filterFields.bind(this));
            this.formFields.forEach(field => {
                this.addDataUuid(field);
                field.addEventListener('input', () => this.validateField(field));
                field.addEventListener('change', () => this.validateField(field));
            });
            return this;
        } catch (error) {
            return this.createError(error);
        }
    }

    static init(...args) {
        return new FormValidator(...args);
    }

    get validators() {
        return {
            default: 'Pole ma niepoprawną wartość.',
            required: 'Pole jest wymagane.',
            email: 'Pole musi zawierać poprawny adres e-mail.',
            minLength: 'Długość pola musi wynosić co najmniej %s znaków.',
            maxLength: 'Długość pola nie może przekraczać %s znaków.',
            greaterThan: 'Pole musi zawierać liczbę większą niż %s.',
            lessThan: 'Pole musi zawierać liczbę mniejszą niż %s.',
            number: 'Pole musi zawierać tylko cyfry.',
            step: 'Zawartość pola musi być wielokrotnością liczby %s.',
        };
    }

    uuid() {
        const uuidPart = () => Math.random().toString(36).substring(7);
        return `_${uuidPart()}-${uuidPart()}-${uuidPart()}-${uuidPart()}`;
    }

    validateParams(form) {
        if (!(form instanceof HTMLElement)) throw new Error('Przekazany element nie jest prawidłowym elementem html!');
    }

    validate(event) {
        event.preventDefault();
        this.formFields.forEach(this.validateField.bind(this));
        if (this.form.checkValidity()) this.form.submit();
    }

    filterFields(field) {
        return (field.tagName === 'INPUT' && field.type !== 'button') || field.tagName === 'SELECT' || field.tagName === 'TEXTAREA';
    }

    getFieldUuid(field) {
        return field?.getAttribute('data-fv-uuid');
    }

    addDataUuid(field) {
        if (!this.getFieldUuid(field)) {
            const uuid = this.getFieldUuid(this.form.querySelector(`[name="${field.name}"]`)) || this.uuid(); // exception for radio
            field.setAttribute('data-fv-uuid', uuid);
        }
    }

    validateField(field) {
        const errors = this.getErrors(field);
        if (errors === null) {
            field.classList.remove('is-invalid');
            const fieldUuid = this.getFieldUuid(field);
            this.form.querySelector(`#${fieldUuid}`)?.remove();
        } else {
            if (field.type === 'radio' && field !== Array.from(this.form.querySelectorAll(`[name="${field.name}"]`)).slice(-1).pop()) return; // exception for radio
            field.classList.add('is-invalid');
            this.createFeedback(field, errors);
        }
    }

    getErrors(field) {
        if (field.validity.valid) return null;
        const errors = [];
        if (field.validity.valueMissing) errors.push(this.validators.required); // required
        if (field.validity.typeMismatch && field.type === 'email') errors.push(this.validators.email); // email
        if (field.validity.badInput && field.type === 'number') errors.push(this.validators.number); // number
        if (field.validity.rangeUnderflow) errors.push(this.validators.greaterThan.replace('%s', field.getAttribute('min'))); // greaterThan
        if (field.validity.rangeOverflow) errors.push(this.validators.lessThan.replace('%s', field.getAttribute('max'))); // lessThan
        if (field.validity.tooShort) errors.push(this.validators.minLength.replace('%s', field.getAttribute('minlength'))); // minLength
        if (field.validity.tooLong) errors.push(this.validators.maxLength.replace('%s', field.getAttribute('maxlength'))); // maxLength
        if (field.validity.stepMismatch) errors.push(this.validators.step.replace('%s', field.getAttribute('step') || 1)); // step
        if (!errors.length) errors.push(this.validators.default); // unknown error
        return errors;
    }

    createFeedback(field, errors) {
        const fieldUuid = this.getFieldUuid(field);
        const existingFeedback = this.form.querySelector(`#${fieldUuid}`);
        const feedback = existingFeedback || document.createElement('div');
        feedback.setAttribute('id', fieldUuid);
        feedback.classList.add('invalid-feedback');
        const feedbackErrors = errors.join('<br>');
        feedback.innerHTML = feedbackErrors;
        if (!existingFeedback) {
            if (field.nextElementSibling?.tagName === 'LABEL') {
                field.nextElementSibling.after(feedback);
            } else {
                field.after(feedback);
            }
        }
    }
}

export default FormValidator;
