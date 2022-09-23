/*******************************************************************************
 * Copyright 2022 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function() {


    "use strict";
    class CheckBoxGroup extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormCheckBoxGroup";
        static bemBlock = 'cmp-adaptiveform-checkboxgroup'
        static checkboxBemBlock = 'cmp-adaptiveform-checkbox'
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widgets: `.${CheckBoxGroup.bemBlock}__widgets`,
            widget: `.${CheckBoxGroup.checkboxBemBlock}__widget`,
            widgetLabel: `.${CheckBoxGroup.checkboxBemBlock}__label`,
            label: `.${CheckBoxGroup.bemBlock}__label`,
            description: `.${CheckBoxGroup.bemBlock}__longdescription`,
            qm: `.${CheckBoxGroup.bemBlock}__questionmark`,
            errorDiv: `.${CheckBoxGroup.bemBlock}__errormessage`
        };

        constructor(params) {
            super(params);
            this.qm = this.element.querySelector(CheckBoxGroup.selectors.qm)
            this.widgetLabel = this.element.querySelector(CheckBoxGroup.selectors.widgetLabel)
        }

        getWidget() {
            return this.element.querySelectorAll(CheckBoxGroup.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(CheckBoxGroup.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(CheckBoxGroup.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(CheckBoxGroup.selectors.errorDiv);
        }

        setModel(model) {
            super.setModel(model);
            let widgets = this.widget
            widgets.forEach(widget => {
                let self = widget
                widget.addEventListener('change', (e) => {
                    this._updateModelValue(self)
                })
            })
        }

        _updateModelValue(widget) {
            let value = []
            this.widget.forEach(widget => {
                if (widget.checked) {
                    value.push(widget.value)
                }
            }, this)
            this._model.value = value
        }

        _updateValue(modelValue) {
            modelValue = [].concat(modelValue);
            let selectedWidgetValues = modelValue.map(String);
            this.widget.forEach(widget => {
                if (selectedWidgetValues.includes((widget.value))) {
                    widget.checked = true
                    widget.setAttribute(FormView.Constants.HTML_ATTRS.CHECKED, FormView.Constants.CHECKED)
                    widget.setAttribute(FormView.Constants.ARIA_CHECKED, true)
                } else {
                    widget.checked = false
                    widget.removeAttribute(FormView.Constants.HTML_ATTRS.CHECKED);
                    widget.setAttribute(FormView.Constants.ARIA_CHECKED, false);
                }
            }, this)
        }

        _updateEnable(enable) {
            this.toggle(enable, FormView.Constants.ARIA_DISABLED, true);
            this.element.setAttribute(FormView.Constants.DATA_ATTRIBUTE_ENABLED, enable);
            let widgets = this.widget
            widgets.forEach(widget => {
                if (enable === false) {
                    widget.setAttribute(FormView.Constants.HTML_ATTRS.DISABLED, true);
                    widget.setAttribute(FormView.Constants.ARIA_DISABLED, true);
                } else {
                    widget.removeAttribute(FormView.Constants.HTML_ATTRS.DISABLED);
                    widget.removeAttribute(FormView.Constants.ARIA_DISABLED);
                }
            });
        }

    }


    FormView.Utils.setupField(({element, formContainer}) => {
        return new CheckBoxGroup({element})
    }, CheckBoxGroup.selectors.self);

})();