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
    //         { title: '<b>채진</b>, 사생활 영상 유출에 자필사과 &quot;심려끼쳐 죄송..경솔했다&quot;(전문)',
    //           originallink: 'http://enews24.tving.com/news/article.asp?nsID=1283796',
    //           link: 'http://news.naver.com/main/read.nhn?mode=LSD&mid=sec&sid1=106&oid=404&aid=0000208632',
    //           description: '이에 대해 <b>채진</b>과 <b>조현아</b> 소속사는 &quot;술자리 게임 중 찍힌 영상일 뿐, 교제하는 사이는 아니다&quot;라고 해명했다. -다음은 <b>채진</b>의 자필 사과문 전문. 안녕하세요. <b>채진</b>석입니다. 먼저 이번 일로 인해 응원해주시고... ',
    //           pubDate: 'Wed, 11 Apr 2018 12:03:00 +0900' }
    const message = {
        text: newsData.description,
        message_button: {
            label: newsData.title,
            url: newsData.link
        }
    }
    res.json(message)
}