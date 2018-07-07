const config = require('../config/config')
const COS = require('cos-nodejs-sdk-v5');
const cos = new COS({
    SecretId: config.Qcos_SecretId,
    SecretKey: config.Qcos_SecretKey,
});
const moment = require('moment')
/******
 * 1. cos.getService 接口实现获取该用户下所有 Bucket 列表。
 * 该 API 接口需要使用 Authorization 签名认证，
 * 且只能获取签名中 AccessID 所属账户的 Bucket 列表。
 * 
 * region['ap-beijing-1','ap-beijing','ap-shanghai','ap-guangzhou','ap-chengdu']
 * 2. headBucket
 * 3. putBucket 创建Bucket params{bucket,region}
 * 4. deleteBucket 删除Bucket params{bucket,region}
 * 5. getObject 获取实体 params{bucket,region,key} 
 * 6. putObject 上传实体 params{bucket,region,key,body}
 * 7. sliceUploadFile 分片上传 params{bucket,region,key,filepath}
 * 8. deleteObject 删除实体 params{bucket,region,key} 
 */
exports.uploadSync = function (key, callback) {
    cos.sliceUploadFile({
        Bucket: config.Qcos_Bucket,
        Region: config.Qcos_Region,
        Key: key,
        FilePath: `./${key}`
    }, function (err, data) {
        if (err) {
            return callback(err, null)
        }
        callback(null, data.Location)
    });
}

/**
 * 上传图片
 * @param {*} key 图片名称
 * @param {*} dir 上传路径 默认static
 */
exports.uploadPromise = function (key, dir = "static") {
    return new Promise((res, rej) => {
        cos.sliceUploadFile({
            Bucket: config.Qcos_Bucket,
            Region: config.Qcos_Region,
            Key: key,
            FilePath: `./${key}`
        }, function (err, data) {
            if (err) {
                rej(err)
            }
            res({ Path: data.Location })
        });
    })
}




function getBucket() {
    cos.getBucket({
        Bucket: config.Qcos_Bucket,
        Region: config.Qcos_Region,
        Prefix: 'static/',
        Marker: 'static/',
        MaxKeys: 2
    }, function (err, data) {
        let result = data.Contents
        let selectKey = result.map(i => i.Key)
        selectKey.forEach(element => {
            getObjectUrl(element, data => {
                console.log(data)
            })
        });
    });
}

function getObjectUrl(key, callback) {
    var url = cos.getObjectUrl({
        Bucket: config.Qcos_Bucket,
        Region: config.Qcos_Region,
        Key: key,
        Expires: 60,
        Sign: true,
    }, function (err, data) {
    });
    callback(url)
}

/**
 * 获取所有的图片
 * @param 开始路径
 * @param 获取数量
 */
async function getBuketPromise(query = { startKey: 'static/', pageCount: 10 }) {
    return new Promise((resole, reject) => {
        cos.getBucket({
            Bucket: config.Qcos_Bucket,
            Region: config.Qcos_Region,
            Prefix: 'static/',
            Marker: query.startKey == undefined ? 'static/' : query.startKey,
            MaxKeys: query.pageCount == undefined ? 10 : query.pageCount
        }, function (err, data) {
            // console.log('**********************************')
            // console.log(query)
            let result = data.Contents
            let count = 0
            let resultData = []
            result.forEach(element => {
                try {
                    getObjectUrl(element.Key, data => {
                        resultData.push({ url: data, key: element.Key, ctime: moment(element.LastModified).format('YYYY-MM-DD hh:mm:ss'), size: element.Size })
                        count++
                        if (count == result.length) {
                            resole({ data: resultData })
                        }
                    })
                } catch (error) {
                    reject(error)
                }
            });
        });
    })
}

exports.GetBucketAsync = getBuketPromise

/**
 * 获取当前Buket的图片数量
 */
let getBuketCount = async () => {
    return new Promise((res, rej) => {
        cos.getBucket({
            Bucket: config.Qcos_Bucket,
            Region: config.Qcos_Region,
            Prefix: 'static/',
            Marker: 'static/',
            MaxKeys: 1000
        }, function (err, data) {
            console.log(data)
            if (err) {
                rej(err)
            } else {
                res(data.Contents.length)
            }
        });
    })
}

/**
 * 根据索引取得对象的key
 */
async function getObjectNameByIndex(query) {
    return new Promise((res, rej) => {
        cos.getBucket({
            Bucket: config.Qcos_Bucket,
            Region: config.Qcos_Region,
            Prefix: 'static/',
            Marker: 'static/',
            MaxKeys: 1000
        }, function (err, data) {
            if (err) {
                rej(err)
            } else {
                res(data.Contents[query.index])
                // console.log(query.index)
                // console.log(data.Contents[0])
            }
        });
    })
}

exports.GetObjectNameByIndex = getObjectNameByIndex
exports.GetBucketCount = getBuketCount

// getBuketPromise().then(res => {
//     console.log(res)
// }).catch(err => {
//     console.log(err)
// })

//testGetBuketCount()