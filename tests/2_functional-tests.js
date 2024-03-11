const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
const host = "https://3000-freecodecam-boilerplate-nyfzjfetwpo.ws-us108.gitpod.io";
suite('Functional Tests', function() {
    describe("Interacting with a singular stock: /api/stock-prices/", (suite) => {

        test("Viewing one stock: GET request to /api/stock-prices/", function (done) {
            chai
            .request(host)
            .get(`/api/stock-prices?stock=MSFT`)
            .send()
            .end(function (err, res) {
                const data = res.body;
                assert.notExists(err, "No error was produced")
                assert.exists(data['stockData'], "Stock data is attached to response")
                assert.hasAllKeys(data['stockData'], ["price", "stock", "likes"], "Stock data contains valid keys")

                done();
            })
        })
        let previousLikes = 0;
        test("Viewing and liking a stock: GET request to /api/stock-prices/", function (done) {
            chai
            .request(host)
            .get(`/api/stock-prices?stock=GOOG&like=true`)
            .send()
            .end(function (err, res) {
                const data = res.body;
                assert.notExists(err, "No error was produced")
                assert.exists(data['stockData'], "Stock data is attached to response")
                assert.hasAllKeys(data['stockData'], ["price", "stock", "likes"], "Stock data contains valid keys")
                assert.isAbove(data['stockData'].likes, 0, "Stock data atleast contains one like")
                previousLikes = data['stockData'].likes
                done();
            })
        })
        test("Viewing the same stock and liking it again: GET request to /api/stock-prices/", function (done) {
            chai
            .request(host)
            .get(`/api/stock-prices?stock=GOOG&like=true`)
            .send()
            .end(function (err, res) {
                const data = res.body;
                assert.notExists(err, "No error was produced")
                assert.exists(data['stockData'], "Stock data is attached to response")
                assert.hasAllKeys(data['stockData'], ["price", "stock", "likes"], "Stock data contains valid keys")
                assert.isAbove(data['stockData'].likes, 0, "Stock data atleast contains one like")
                assert.equal(data['stockData'].likes, previousLikes, "Stock data likes should not be modified")
                previousLikes = data['stockData'].likes
                done();
            })
        })
    })
    describe("Interacting with a multiple stocks: /api/stock-prices/", (suite) => {

        test("Viewing two stocks: GET request to /api/stock-prices/", function (done) {
            chai
            .request(host)
            .get(`/api/stock-prices?stock=MSFT&stock=AAPL`)
            .send()
            .end(function (err, res) {
                const data = res.body;
                assert.notExists(err, "No error was produced")
                assert.exists(data['stockData'], "Stock data is attached to response")
                assert.isArray(data['stockData'], "Stock data is an array")
                assert.equal(data['stockData'].length, 2, "Stock data length is accurate to items requested")
                assert.hasAllKeys(data['stockData'][0], ["price", "stock", "rel_likes"], "Stock data contains valid keys")
                assert.hasAllKeys(data['stockData'][1], ["price", "stock", "rel_likes"], "Additional stock data contains valid keys")
                done();
            })
        })

        test("Viewing two stocks and liking them: GET request to /api/stock-prices/", function (done) {
            chai
            .request(host)
            .get(`/api/stock-prices?stock=AAPL&stock=MSFT&like=true`)
            .send()
            .end(function (err, res) {
                const data = res.body;
                assert.notExists(err, "No error was produced")
                assert.exists(data['stockData'], "Stock data is attached to response")
                assert.isArray(data['stockData'], "Stock data is an array")
                assert.equal(data['stockData'].length, 2, "Stock data length is accurate to items requested")
                assert.hasAllKeys(data['stockData'][0], ["price", "stock", "rel_likes"], "Stock data contains valid keys")
                assert.hasAllKeys(data['stockData'][1], ["price", "stock", "rel_likes"], "Additional stock data contains valid keys")
                

                done();
            })
        })
        
    })
});
