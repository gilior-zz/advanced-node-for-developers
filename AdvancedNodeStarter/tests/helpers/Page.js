const userFunc = require('../factories/user.factory');
const sessionFunc = require('../factories/session.factory');
const ptr = require('puppeteer')

class Page {


    constructor(page, browser) {
        this.page = page;
        this.browser = browser;
    }

    static async buildPage() {
        const browser = await ptr.launch({
            headless: false
        })
        const page = await browser.newPage();
        const customPage = new Page(page, browser);
        const proxyPage = new Proxy(customPage, {
            get: function (target, property) {
                return target[property]
                    || page[property]
                    || browser[property]
            }
        })
        return proxyPage
    }

    async login() {
        const user = await userFunc();
        const {session, sig} = sessionFunc(user);
        await this.setCookie({name: 'session', value: session});
        await this.setCookie({name: 'session.sig', value: sig});
        await this.goto('localhost:3000/blogs')
        await this.waitFor('a[href="/auth/logout"]')

    }

    close() {
        this.browser.close();
    }

    async getContentsOf(selector) {
        const text = this.page.$eval(selector, el => el.innerHTML)
        return text;
    }

    get(path) {
        return this.page.evaluate(
            (_path) => {
                return fetch(_path, {
                    method: 'GET',
                    credentials: 'same-origin',
                    headers: {'Content-Type': 'application/json'},
                }).then(res => res.json());
            }, path)
    }

    post(path, body) {
        return this.page.evaluate(
            (_path, _body) => {
                return fetch(_path, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(_body)
                }).then(res => res.json());
            }, path, body)
    }

    execRequests(actions) {
      return  Promise.all(
            actions.map(async ({method, path, data}) =>
                this[method](path, data)
            ));
    }
}

module.exports = Page;