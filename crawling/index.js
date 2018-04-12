const request = require('request')
const parse = require("xml-parser")
const { Data } = require("../models")

// const keywordRank = handler.dom[3].children[7].children[5].children[3].children[1].children[1].children[9].children[1].children[1].children[9].children[1]
// const rankList = keywordRank.children[3].children[1].children
// rankList.forEach(v => {
//     if (v.raw === 'li class="list"') {
//         v.children.forEach(v => {
//             if (v.name === 'a') {
//                 v.children.forEach(v => {
//                     if (v.name === 'span') {
//                         const keyword = v.children[0].raw
//                         console.log(keyword)
//                     }
//                 })
//             }
//         })
//     }
// })

async function getData(date) {
    const data = await Data.findOne({ date })
    const dataList = []
    if (!data) {
        await new Promise(resolve => {
            request.get('https://trends.google.com/trends/hottrends/atom/feed?pn=p23', {
                headers: {
                    'User-Agent': 'MEDIA-LAB'
                }
            }, (err, res, body) => {
                const xml = parse(body)
                const channel = xml.root.children
                channel.forEach(v => {
                    v.children.forEach(v => {
                        if (v.name === 'item') {
                            v.children.forEach(v => {
                                if (v.name === 'title') {
                                    dataList.push(v.content)
                                }
                            })
                        }
                    })
                })
                resolve()
            })
        })
        await new Data({ date, data: dataList, location: 'ko' }).save()
    } else {
        return data.data
    }
    return dataList
}
module.exports = getData