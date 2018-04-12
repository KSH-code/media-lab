const request = require('request')
const crawling = require('../crawling')

module.exports = async (req, res) => {
    const { date } = req.query
    const keywordList = await crawling(new Date(date).toISOString().slice(0, 10))
    const newsList = []
    for (let i = 0; i < keywordList.length; i++) {
        newsList.push(await new Promise((resolve, reject) => {
            request.get('https://openapi.naver.com/v1/search/news.json?query=' + encodeURI(keywordList[i]), {
                headers: {
                    'X-Naver-Client-Id': 'AS6K1gzICkkLrkisD_4p',
                    'X-Naver-Client-Secret': '5MA7twyOkN',
                }
            }, (err, res, body) => {
                if (err) return reject(err)
                resolve(JSON.parse(res.body).items)
            })
        }))
        await new Promise(resolve => setTimeout(resolve, 100))
    }
    console.dir(newsList)
    res.json({ newsList })
}