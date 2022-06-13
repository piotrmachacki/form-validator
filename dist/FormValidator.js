(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("FormValidator", [], factory);
	else if(typeof exports === 'object')
		exports["FormValidator"] = factory();
	else
		root["FormValidator"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 29);
/******/ })
/************************************************************************/
/******/ ({

/***/ 29:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
      step: 'Zawartość pola musi być wielokrotnością liczby %s.'
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
    return field.tagName === 'INPUT' && field.type !== 'button' || field.tagName === 'SELECT' || field.tagName === 'TEXTAREA';
  }

  getFieldUuid(field) {
    return field === null || field === void 0 ? void 0 : field.getAttribute('data-fv-uuid');
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
      var _this$form$querySelec;

      field.classList.remove('is-invalid');
      const fieldUuid = this.getFieldUuid(field);
      (_this$form$querySelec = this.form.querySelector(`#${fieldUuid}`)) === null || _this$form$querySelec === void 0 ? void 0 : _this$form$querySelec.remove();
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
      var _field$nextElementSib;

      if (((_field$nextElementSib = field.nextElementSibling) === null || _field$nextElementSib === void 0 ? void 0 : _field$nextElementSib.tagName) === 'LABEL') {
        field.nextElementSibling.after(feedback);
      } else {
        field.after(feedback);
      }
    }
  }

}

/* harmony default export */ __webpack_exports__["default"] = (FormValidator);

/***/ })

/******/ })["default"];
});