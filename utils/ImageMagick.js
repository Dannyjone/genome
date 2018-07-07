var gm = require('gm')
    , fs = require('fs')
    , imageMagick = gm.subClass({ imageMagick: true });

/**
 * 生成缩略图
 * mustbe install ImageMagick
 * @param 原图路径
 * @param 缩略图大小
 */
let resizeImg = function (path = '', resize = 150) {
    return new Promise((res, rej) => {
        try {
            let r_path = `${path.substr(0, path.lastIndexOf('.'))}_x${resize}${path.substr(path.lastIndexOf('.'))}`
            imageMagick(path)
                .resize(resize, resize, '!')
                .write(r_path, function (err) {
                    if (!err) res({ data: r_path })
                    else rej(err)
                });
        } catch (err) {
            rej(err)
        }
    })
}


/**
 * 生成缩略图
 * @param 原图路径
 * @param 缩略图大小
 */
exports.ResizeImg = resizeImg

//resizeImg()
//    .then(res => { console.log('转换成功') })
//    .catch(err => console.log('转换失败->' + err))

