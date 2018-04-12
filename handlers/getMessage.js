const request = require('request')
const crawling = require('../crawling')

module.exports = async (req, res) => {
    const { type, content } = req.body
    if (type !== 'text') {
        const buttons = await crawling(new Date().toISOString().slice(0, 10))
        return res.json({ message: '파일이나 사진은 입력 현재 미지원입니다.' })
    }

    const newsData = await new Promise((resolve, reject) => {
        request.get('https://openapi.naver.com/v1/search/news.json?display=1&query=' + encodeURI(content), {
            headers: {
                'X-Naver-Client-Id': 'AS6K1gzICkkLrkisD_4p',
                'X-Naver-Client-Secret': '5MA7twyOkN',
            }
        }, (err, res, body) => {
            if (err) return reject(err)
            resolve(JSON.parse(res.body).items[0])
        })
    })
    const photo = await new Promise((resolve, reject) => {
        request.get('https://openapi.naver.com/v1/search/image?filter=medium&display=1&query=' + encodeURI(content), {
            headers: {
                'X-Naver-Client-Id': 'AS6K1gzICkkLrkisD_4p',
                'X-Naver-Client-Secret': '5MA7twyOkN',
            }
        }, (err, res, body) => {
            if (err) return reject(err)
            resolve(JSON.parse(res.body).items[0])
        })
    })
    const message = {
        text: newsData.title.replace(/<br>/gi, '').replace(/<\/br>/gi, '\n').replace(/&quot;/gi, '"').replace(/<\/\w>/gi, '').replace(/<\w>/gi, ''),
        message_button: {
            label: '확인해보기',
            url: newsData.link
        },
        photo: {
            url: photo.link,
            width: parseInt(photo.sizewidth),
            height: parseInt(photo.sizeheight)
        },
        keyboard: {
            type: 'buttons',
            buttons: [
                '사용법',
                '트렌드',
                '취소'
            ]
        }
    }
    res.json({ message })
}