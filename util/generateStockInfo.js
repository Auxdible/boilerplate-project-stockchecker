const mongoClient = require('../util/mongoClient')

module.exports = {
    async generateStockInfo(symbol, latestPrice, like, ip) {
    if (!mongoClient) { return undefined; }
    let likes = 0;

    await mongoClient.db().collection('likes').findOneAndUpdate({
        symbol: symbol
    },
    {
        $setOnInsert: { symbol: symbol, likes: [] },
    },
    {
        upsert: true,
        includeResultMetadata: true
    }).then(async (data) => {

        if (like == 'true' && (!data.value?.likes || !data.value.likes.includes(ip))) {

            await mongoClient.db().collection('likes').findOneAndUpdate({
              symbol: symbol
            },
            {
              $push: { likes: ip }
            },
            {
                includeResultMetadata: true
            })
            .then((liked) => {
              likes = liked.value.likes.length || 0
            })
          } else likes = data.value?.likes?.length || 0;

        })
    .catch(() => {})

    return {
        stock: symbol,
        price: latestPrice,
        likes,
    }
}
}
    