const request = require('request')
const crawling = require('../crawling')

module.exports = async (req, res) => {
    const { type, content } = req.body
    if (type !== 'text') {
        return res.json({ message: '파일이나 사진은 입력 현재 미지원입니다.' })
    }
    let message
    let keyboard = {
        keyboard: {
            type: 'buttons',
            buttons: [
                '트렌드',
                '취소'
            ]
        }
    }
    switch (content) {
        case '사용법':
        case 'help':
        case '?':
        case '도움말':
        case '취소':
            keyboard = {}
            message = {
                text: '문장 또는 단어로 기사를 랜덤으로 쉽게 검색할 수 있는 서비스입니다.\n최근 트렌드를 불러오셔서 간편하게 검색하고 싶으시다면, "트렌드"를 입력해주세요.'
            }
            break
        case '트렌드':
            const buttons = await crawling(new Date().toISOString().slice(0, 10))
            message = {
                text: '현재 날짜를 기준으로 불러온 트렌드 목록입니다.'
            }
            keyboard = {
                keyboard: {
                    type: 'buttons',
                    buttons
                }
            }
            break
        default:
            const sort = `sort=date`
            const newsData = await new Promise((resolve, reject) => {
                request.get(`https://openapi.naver.com/v1/search/news.json?${sort}&display=1&query=${encodeURI(content)}`, {
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
                request.get(`https://openapi.naver.com/v1/search/image?${sort}&filter=medium&display=1&query=${encodeURI(content)}`, {
                    headers: {
                        'X-Naver-Client-Id': 'AS6K1gzICkkLrkisD_4p',
                        'X-Naver-Client-Secret': '5MA7twyOkN',
                    }
                }, (err, res, body) => {
                    if (err) return reject(err)
                    resolve(JSON.parse(res.body).items[0])
                })
            })
            message = {
                text: newsData.title.replace(/<br>/gi, '').replace(/<\/br>/gi, '\n').replace(/&quot;/gi, '"').replace(/<\/\w>/gi, '').replace(/<\w>/gi, ''),
                photo: {
                    url: photo.link,
                    width: parseInt(photo.sizewidth),
                    height: parseInt(photo.sizeheight)
                },
                message_button: {
                    label: '확인해보기',
                    url: newsData.link
                }
            }
            break
    }
    res.json({ message, ...keyboard })
}