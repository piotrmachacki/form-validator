import templates from './templates';

class FormGenerator {
    constructor(form, data) {
        this.form = form;
        this.data = data;
        this.templates = templates;
    }

    build() {
        this.buildForm();
    }

    buildForm() {
        let html = '';
        this.data.forEach(item => {
            const compiledField = this.buildField(item);
            html += compiledField;
        });
        this.form.innerHTML = html;
    }

    buildField(data) {
        const template = this.getFieldTemplate(data.fieldType);
        return template ? template(data) : '';
    }

    getFieldTemplate(type) {
        return this.templates[type];
    }
}

export default FormGenerator;
