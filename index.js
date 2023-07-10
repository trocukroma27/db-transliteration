const args = require('args-parser')(process.argv);
const toEnTranslit = require('./transliteration');

(async function index() {
    const { from, to, env = '.env.dev', uk } = args;
    if (!from || !to) {
        throw new Error('Вкажіть всі аргументи from та to')
    }
    await toEnTranslit(from, to, env, uk);
})();