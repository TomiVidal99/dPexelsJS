const { create_language } = require('./App/scripts/handle_language.js')

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    create_language()
})

