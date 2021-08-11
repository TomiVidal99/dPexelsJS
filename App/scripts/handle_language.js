// this script contains all the functions that are related to the language side of the program

function helper_set_data(keyString, language) {
    for (const element of document.querySelectorAll(keyString)) {
        if (element.tagName == "INPUT") {
            element.placeholder = language.preload[element.tagName][element.getAttribute('id')]
        } else {
            element.innerText = language.preload[element.tagName][element.getAttribute('id')]
        }
    }
}

function helper_set_stored_data(keyString) {
    for (const element of document.querySelectorAll(keyString)) {
        if (element.tagName == "INPUT") {
            const value = localStorage.getItem(element.getAttribute('id'))
            if (value) element.value = value
        }
    }
}

function create_language() {
    //console.log('create language')
    const language = require('./../assets/en_US.json')
    helper_set_data('[preload-data]', language)
    helper_set_stored_data('[stored-data]')
}

module.exports = { create_language }
