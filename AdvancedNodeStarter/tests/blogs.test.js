require('./setup');
const CustomPage = require('./helpers/Page');


let proxyPage;
beforeEach(async () => {

    proxyPage = await CustomPage.buildPage();

    await proxyPage.goto('localhost:3000');
})

afterEach(async () => {
    await  proxyPage.close();
})


describe('when logged in', async () => {
    beforeEach(async () => {
        await proxyPage.login();
        await proxyPage.click('a.btn-floating');
    })
    test('can c create form', async () => {
        const text = await proxyPage.getContentsOf('form label');
        expect(text).toEqual('Blog Title')
    })
    describe('and using valid inputs', async () => {
        beforeEach(async () => {
            await proxyPage.type('.title input', 'my title')
            await proxyPage.type('.content input', 'my content')
            await  proxyPage.click('form button');


        })
        test('submit takes user to review screen', async () => {
            const confirm = await proxyPage.getContentsOf('form h5')
            expect(confirm).toEqual('Please confirm your entries')

        })
        test('submit then save adds blog then takes user to index page', async () => {
            await  proxyPage.click('button.green');
            await proxyPage.waitFor('.card')
            const title = await proxyPage.getContentsOf('.card-title');
            const text = await proxyPage.getContentsOf('.card-content p');
            expect(title).toEqual('my title')
            expect(text).toEqual('my content')
        })
    })
    describe('and using invalid inputs', () => {
        beforeEach(async () => {
            await  proxyPage.click('form button');
        })
        test('frm shows err msg', async () => {

            const titleErr = await proxyPage.getContentsOf('.title .red-text')
            const contentErr = await proxyPage.getContentsOf('.content .red-text')
            expect(titleErr).toEqual('You must provide a value')
            expect(contentErr).toEqual('You must provide a value')
        })
    })
})


describe('usr not logged in', () => {
    const actions = [
        {
            method: 'get',
            path: '/api/blogs'
        },
        {
            method: 'post',
            path: '/api/blogs',
            data: {
                title: 'T',
                content: 'C',
            }
        }]

    test('blog related actions r prohibited', async () => {
        const results = await proxyPage.execRequests(actions)
        for (let res of results) {
            expect(res).toEqual({error: 'You must log in!'})
        }
    })


    test.skip('usr cant create blog post', async () => {
        const res = await  proxyPage.post('/api/blogs', {title: 'my title', content: 'my content'});
        expect(res).toEqual({error: 'You must log in!'})
    })

    test.skip('usr cant get blogs ', async () => {

        const res = await proxyPage.get('/api/blogs')

        console.log('res', res)
        expect(res).toEqual({error: 'You must log in!'})

    })
})