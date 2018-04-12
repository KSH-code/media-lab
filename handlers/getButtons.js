const crawling = require('../crawling')

module.exports = async (req, res) => {
    const { date } = req.query
    const buttons = await crawling(new Date().toISOString().slice(0, 10))
    res.json({
        type: 'buttons',
        buttons
    })
}