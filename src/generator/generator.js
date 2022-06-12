import templates from './templates';

class FormGenerator {
    constructor(form, data) {
        try {
            this.validateParams(form, data);
            this.form = form;
            this.data = data;
            this.templates = templates;
            this.buildForm();
            return this;
        } catch (error) {
            return this.createError(error);
        }
    }

    static build(...args) {
        return new FormGenerator(...args);
    }

    createError(error) {
        this.error = true;
        console.error(error);
        return error;
    }

    validateParams(form, data) {
        if (!(form instanceof HTMLElement)) throw new Error('Przekazany element nie jest prawidłowym elementem html!');
        if (!Array.isArray(data)) throw new Error('Nie przekazano konfiguracji formularza!');
    }

    buildForm() {
        let html = '';
        this.data.forEach(item => {
            const compiledField = this.buildField(item);
            html += compiledField || '';
        });
        this.form.innerHTML = html;
    }

    buildField(data) {
        const template = this.getFieldTemplate(data.type);
        if (!template) {
            console.error(`Pole typu '${data.type}' nie jest obsługiwane!`);
            return null;
        }
        return template(data);
    }

    getFieldTemplate(type) {
        let fieldType = '';
        switch (type) {
            case 'button':
            case 'reset':
            case 'submit':
                fieldType = 'button';
                break;
            case 'checkbox':
                fieldType = 'checkbox';
                break;
            case 'radio':
                fieldType = 'radio';
                break;
            default:
                fieldType = 'input';
        }
        return this.templates[fieldType];
    }
}

export default FormGenerator;
