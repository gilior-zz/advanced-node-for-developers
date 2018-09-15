require('./setup');
const CustomPage = require('./helpers/Page');


let browser, proxyPage;
beforeEach(async () => {

    proxyPage = await CustomPage.buildPage();

    await proxyPage.goto('localhost:3000');
})

afterEach(async () => {
    await  proxyPage.close();
})
test('new browser', async () => {
    const text = await proxyPage.$eval('a.brand-logo', (el) => el.innerHTML)
    expect(text).toEqual('Blogster')
})

test('ouath flow', async () => {
    await proxyPage.click('.right a');
    const url = await proxyPage.url();
    expect(url).toMatch(/accounts\.google.com/);
})
test('when signed in, shows logout button', async () => {
    // const id = '5b892e3a60215f02542d9e82';
    await proxyPage.login();

    // console.log(sessionStr, sig)

    // const text = await proxyPage.$eval('a[href="/auth/logout"]', el => el.innerHTML)
    const text = await proxyPage.getContentsOf('a[href="/auth/logout"]');
    expect(text).toEqual('Logout')
})