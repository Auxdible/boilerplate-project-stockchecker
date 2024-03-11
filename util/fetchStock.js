module.exports = { 
    fetchStock(stock) {
    return fetch(`${process.env.STOCK_API_URL}${stock}/quote`)
    }
}