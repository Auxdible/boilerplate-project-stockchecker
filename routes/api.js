'use strict';

const { fetchStock } = require('../util/fetchStock');
const { generateStockInfo } = require('../util/generateStockInfo');


module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
        const stock = req.query['stock'],
              like = req.query['like'];
        const ip = req.headers['x-forwarded-for'].toString().replace(/.\d+$/, '.0');
        let result = [];
        if (typeof stock != 'string') {
          for (let i of stock) {
            await fetchStock(i).then(
              async (stockRes) => {
    
                if (!stockRes.ok) return res.status(stockRes.status).send(await stockRes.text())
                
                const stockData = await stockRes.json();
    
                result.push(await generateStockInfo(stockData['symbol'], stockData['latestPrice'], like, ip));
            }).catch((x) => {
              console.log(x)
              return res.status(500).send("Error occurred")
            })
          }
          res.json({ stockData: result.map((i) => ({
            stock: i.stock,
            price: i.price,
            rel_likes: i.likes - result.filter((c) => c.stock != i.stock).reduce((acc, c) => acc+(c.likes || 0), 0)
          })) })
          return;
        }
        
        await fetchStock(stock).then(
          async (stockRes) => {

            if (!stockRes.ok) return res.status(stockRes.status).send(await stockRes.text())
            
            const stockData = await stockRes.json();

            return res.json({ stockData: await generateStockInfo(stockData['symbol'], stockData['latestPrice'], like, ip) });
        }).catch((x) => {
          console.log(x)
          return res.status(500).json({ 'error': "An error occurred" })
        })
    });
    
};
