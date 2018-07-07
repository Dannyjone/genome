
const axios = require('axios')
const qs = require('qs')
const config = require('../config/config')


//获取萤石的token
exports.getaccessToken = async () => {
    var accessToken = ''
    let result = await axios.post('https://open.ys7.com/api/lapp/token/get', qs.stringify({
        appKey: config.Ys_AppID,
        appSecret: config.Ys_AppSecret
    }))
    return result
}

//获取相机列表 
exports.getCameraList = async (req) => {
    let query = {
        accessToken: req.token,
        pageStart: 0,
        pageSize: 50
    }
    let result = await axios.post('https://open.ys7.com/api/lapp/device/list', qs.stringify(query))
    return result
}

// const getCameras = function () {
//     console.log('.................')
//     axios.post('https://open.ys7.com/api/lapp/device/list', qs.stringify({
//         accessToken: 'at.6r8wpspz9p6k5omn0d20oq7j5l139vwq-6ihmyg8top-1kdce8f-81yi0iht8',
//         pageStart: 0,
//         pageSize: 50
//     }))
//         .then(req => {
//             console.log('.................')
//             console.log(req.data)
//         })
//         .catch(err => { console.log(err) })
// }

// getCameras()