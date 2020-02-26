const joi = require("@hapi/joi")

class Editor {
  /**
   *
   * @param {HTMLTextAreaElement} element - Text Area
   * @param {string} value - Default Value
   * @param {function} onChange - Function called whenever the text area is updated. Takes the updated text as the parameter.
   */
  constructor(element, value, onChange) {
    this.element = element;
    this.value = value;
    this.onChange = onChange;

    this.setup();
  }

  setup() {
    this.element.value = this.value;
    this.element.onkeyup = e => this.onChange(e.target.value);
  }
}

export default Editor;
