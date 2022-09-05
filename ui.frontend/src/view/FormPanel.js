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

import {Constants} from "../constants";
import FormField from "./FormField";

export default class FormPanel extends FormField {

    constructor(params) {
        super(params);
        if (this.element.id) {
            this.setId(this.element.id);
        }
        this.children = [];
        //todo repeat
        /*if (this._model.type == 'array') {
        }*/
    }

    addChild(childView) {
        //let childModel = childView.getModel();
        //let childModelId = childModel.getId();
        //push it as a map in case of array
        this.children.push(childView);
    }

    setModel(model) {
        super.setModel(model);
        const state = this._model.getState();
        this._applyState(state);
    }

    /**
     * applies full state of the field to the HTML. Generally done just after the model is bound to the field
     * @param state
     * @private
     */
    _applyState(state) {
        this._updateVisible(state.visible)
        this._updateEnable(state.visible)
    }

    dataAttribute(attr) {
        return `data-${this.constructor.bemBlock}-${attr}`
    }

    /**
     * updates html based on visible state
     * @param visible
     * @private
     */
    _updateVisible(visible) {
        this.toggle(visible, this.dataAttribute('hidden'), true);
        this.toggle(visible, Constants.ARIA_HIDDEN, true);
        this.toggle(visible, Constants.VISIBLE, false);
    }

    /**
     * udpates the html state based on enable state of the field
     * @param enable
     * @private
     */
    _updateEnable(enable) {
        this.toggle(enable, this.dataAttribute('disabled'), true);
        this.toggle(enable, Constants.ARIA_DISABLED, true);
        this.toggle(enable, Constants.ENABLED, false);
    }

    _updateValid(valid, state) {
        this.toggle(valid, this.dataAttribute('invalid'), !valid);
        this.toggle(valid, Constants.ARIA_INVALID, true);
        this.toggle(valid, Constants.VALID, false);
    }

    subscribe() {
        const changeHandlerName = (propName) => `_update${propName[0].toUpperCase() + propName.slice(1)}`
        this._model.subscribe((action) => {
            let state = action.target.getState();
            const changes = action.payload.changes;
            changes.forEach(change => {
                const fn = changeHandlerName(change.propertyName);
                if (typeof this[fn] === "function") {
                    this[fn](change.currentValue, state)
                } else {
                    console.error(`changes to ${change.propertyName} are not supported. Please raise an issue`)
                }
            })
        });
    }
}
