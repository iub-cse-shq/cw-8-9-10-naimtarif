const path = require('path')
const {app, server, mongoose} = require('./../classwork/server')
const request = require('supertest')
app.set('views', path.join(process.cwd(), 'classwork/views'))
const Article = require('./../classwork/article.model')
let singleArticle = ''
describe("Testing server routes", ()=>{
    beforeAll(async () => {
        try{
            let article = new Article({title:"test", content:"test"})
            singleArticle = await article.save()
        }catch(e){
            console.log(e)
        }
    });
    it("GET home", async ()=>{
        const res = await request(app).get('/')
        expect(res.status).toBe(200)
        expect(res.headers['content-type'].indexOf('text/html') != -1).toBeTruthy()
    })
    it("GET second page", async ()=>{
        const res = await request(app).get('/second')
        expect(res.status).toBe(200)
        expect(res.headers['content-type'].indexOf('text/html') != -1).toBeTruthy()
    })
    it("GET new article form", async ()=>{
        const res = await request(app).get('/article/form')
        expect(res.status).toBe(200)
        expect(res.headers['content-type'].indexOf('text/html') != -1).toBeTruthy()
    })
    it("POST new article", async ()=>{
        const res = await request(app).post('/article/new').send({title: 'test', content: 'test'})
        expect(res.status).toBe(200)
        expect(typeof res.body).toEqual('object')
    })
    it("POST new article with missing title", async ()=>{
        const res = await request(app).post('/article/new').send({content: 'test'})
        expect(res.status).toBe(400)
        expect(typeof res.body).toEqual('object')
    })
    it("GET single article ejs", async ()=>{
        const res = await request(app).get('/article/'+singleArticle._id)
        expect(res.status).toBe(200)
        expect(res.text.indexOf(singleArticle.title) != -1).toBeTruthy()
        expect(res.text.indexOf(singleArticle.content) != -1).toBeTruthy()
    })
    it("GET all articles ejs", async ()=>{
        const res = await request(app).get('/articles/all')
        expect(res.status).toBe(200)
        expect(res.text.indexOf(singleArticle.title) != -1).toBeTruthy()
        expect(res.text.indexOf(singleArticle.content) != -1).toBeTruthy()
    })
})

afterAll(async () => {
    await server.close();
    await mongoose.connection.close()
});