import Editor from "./Editor";
import joi from "@hapi/joi";
import "./tabs";

// Set a global reference to JOI so eval can find it
window.joi = joi;

/**
 * Area used to build schema
 * @type {HTMLTextAreaElement}
 */
const taBuild = document.querySelector("[editor=build]");
/**
 * Area used to set test data
 * @type {HTMLTextAreaElement}
 */
const taTest = document.querySelector("[editor=test]");

/**
 * Area used to display validation results
 * @type {HTMLTextAreaElement}
 */
const taResult = document.querySelector("[readonly]");

let schema = joi.object({
  id: joi.string().default("newID"),
  name: joi.object({
    first: joi.string().max(15),
    last: joi.string().max(30),
    nick: joi.string().max(50),
  }),
});

let data = {
  name: {
    first: "Jonathan",
    last: "Augustine",
    nick: "Jono",
  },
};

/**
 * Sets the current schema
 */
const setSchema = (text = taBuild.value) => {
  let result;
  try {
    result = Function("return " + text);
    taBuild.classList.remove("invalid");
  } catch (error) {
    console.error(error);
    taBuild.classList.add("invalid");
    return;
  }

  schema = result();
};

/**
 * @returns {string} The validation result
 */
const testData = () => {
  // Pull data
  let text = taTest.value;
  let dataFunc;
  try {
    dataFunc = new Function("return " + text);
    taTest.classList.remove("invalid");
  } catch (error) {
    console.log(error);
    taTest.classList.add("invalid");
    return;
  }

  data = dataFunc();

  // Validate
  const { value, error, errors } = schema.validate(data);

  taResult.value = JSON.stringify(error || errors || value, null, 2);

  if (error || errors) {
    taResult.classList.add("invalid");
    return;
  } else {
    taResult.classList.remove("invalid");
  }
};

document.getElementById("run_test").onclick = testData;

new Editor(
  taBuild,
  `joi.object({
 id: joi.string().default("newID"),
 name: joi.object({
   first: joi.string().max(15),
   last: joi.string().max(30),
   nick: joi.string().max(50)
 })
})`,
  setSchema
);

new Editor(taTest, JSON.stringify(data, null, 2), testData);

testData();
