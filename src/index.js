import Editor from "./Editor";
import joi from "@hapi/joi";

// Set a global reference to JOI so that eval can find it
window.joi = joi;

/**
 * @type {HTMLTextAreaElement}
 */
const resultArea = document.querySelector("[readonly]");

let schema = joi.string().regex(/jon(o|athan)/i);

new Editor(
  document.querySelector("[editor=build]"),
  `joi.string().regex(/jon(o|athan)/i)`,
  function(text) {
    let result;
    try {
      result = Function("return " + text);
      this.element.classList.remove("invalid");
    } catch (error) {
      console.error(error);
      this.element.classList.add("invalid");
    }

    schema = result();
  }
);

new Editor(document.querySelector("[editor=test]"), `"Jonathan"`, function(
  text
) {
  // Pull data
  let dataFunc;
  try {
    dataFunc = new Function("return " + text);
  } catch (error) {
    console.log(error);
    this.element.classList.add("invalid");
    return;
  }

  let data = dataFunc();

  // Validate
  const { value, error, errors } = schema.validate(data);

  console.log(value, error, errors);

  resultArea.value = error || errors || value;

  if (error || errors) {
    resultArea.classList.add("invalid");
  } else {
    resultArea.classList.remove("invalid");
  }
});
