const msg = require("../../utils/message")
const SystemConfig = require('../../config/config')
const DouglasPeucker = require('../../utils/DouglasPeucker')
const moment = require('moment')
const fs = require('fs')
const multiparty = require('multiparty')
const genedata = require('../../utils/genedata.js')
const mongoose = require("mongoose")
const Genome = mongoose.model('Genome')
const Track = mongoose.model('Track')
const GeneData = mongoose.model('GeneData')
const Species = mongoose.model('Species')
const Project = mongoose.model('Project')
const User = mongoose.model('User')
var _ = require('lodash')

const MongoClient = require("mongodb")


exports.GetMaxAndMinNumber = async (req, res) => {
    try {
        var max = await Genome.findOne().sort({ txEnd: -1 }).limit(1).exec()
        var min = await Genome.findOne().sort({ txStart: 1 }).limit(1).exec()
        res.send(msg.genSuccessMsg('获取成功', {
            max: max.txEnd, min: min.txStart,
            stepNum: (max.txEnd - min.txStart) / 1000
        }))

    } catch (error) {
        res.send(msg.genSuccessMsg('获取失败'))
    }
}

exports.InsertTrackData2MongoDB = async (req, res) => {
    let query = {
        start: req.body.start,
        end: req.body.end,
        Path: req.body.Path,
    }
    var path = `${__dirname}/../../static/${query.Path}`
    let result = await genedata.BedFile2Arr(path, query.start, query.end)
    //插入数据库
    var data = _.map(result, (i) => {
        return {
            TrackStart: i[0],
            TrackEnd: i[1],
            TrackHeight: i[2],
            ClassName: i[3],
            FileName: query.Path
        }
    })
    try {
        var isok = await Track.insertMany(data)
        let data2 = await Track.find({ FileName: query.Path }).limit(100)
        res.send(msg.genSuccessMsg('插入成功', data2))
    } catch (error) {
        return res.send(msg.genFailedMsg('插入失败:' + error))
    }
}

exports.InsertGeneData2MongoDB = async (req, res) => {
    try {
        let file = req.body.Path
        //var path = `${__dirname}/../../static/${file}`
        let result = await genedata.UcscFile2Arr(file)
        //插入数据库
        //console.log(file)
        var filename = file.substring(file.lastIndexOf('/') + 1)
        //var filepath = file.substring(0, file.lastIndexOf('/') + 1)
        var name = filename.substring(0, filename.indexOf('.'))

        var data = result.map(i => {
            return {
                txStart: i[0],
                txEnd: i[1],
                cdsStart: i[2],
                cdsEnd: i[3],
                strand: i[4],
                Name: i[8],
                exonStarts: i[5],
                exonEnds: i[6],
                ClassName: i[9],
                FileName: name
            }
        })
        var isok = await Genome.insertMany(data)
        var result2 = await Genome.find({ FileName: name }).limit(10)

        //var name = file.substring(0, file.indexOf('.'))
        console.log(name)
        await GeneData.updateOne({ FileName: name }, {
            Status: 1
        })

        // console.log(isok)
        res.send(msg.genSuccessMsg('插入成功', result2))
    } catch (error) {
        return res.send(msg.genFailedMsg('插入失败:' + error))
    }
}

exports.GetGeneDataClass = async (req, res) => {
    try {
        var query = {
            FileName: req.query.FileName
        }
        let result = await Genome.distinct('ClassName')
        res.send(msg.genSuccessMsg('获取成功', result))
    } catch (error) {
        res.send(msg.genFailedMsg('获取失败'))
    }
}

//获取基因数据
exports.GetGeneData = async (req, res) => {
    let query = {
        filename: req.query.filename || '',
        classname: req.query.classname,
        start: req.query.start,
        end: req.query.end
    }
    //var suffix = query.filename.substring(query.filename.lastIndexOf('.'))
    if (req.query.geneclass) {
        try {
            var querytrack = {
                ClassName: query.classname,
                TrackStart: { $gte: parseInt(query.start) },
                TrackEnd: { $lte: parseInt(query.end) },
                // TrackHeight: { $gte: parseInt(query.height) }
            }

            MongoClient.connect('mongodb://localhost:27017/', function (err, db) {
                if (err) throw err;
                var dbo = db.db("admin");
                dbo.collection(query.filename).find(querytrack)
                    .toArray((err, result) => {
                        //抽稀
                        console.log('查询开始?' + result.length)


                        if (result.length > 700000) {
                            result = DouglasPeucker.GetProcessPoints(_.filter(result, (item) => {
                                return item.TrackEnd - item.TrackStart >= 15
                            }), 65)
                        }
                        else if (result.length > 500000 && result.length < 700000) {
                            result = DouglasPeucker.GetProcessPoints(_.filter(result, (item) => {
                                return item.TrackEnd - item.TrackStart >= 10
                            }), 55)
                        }
                        else if (result.length > 200000 && result.length < 500000) {
                            result = DouglasPeucker.GetProcessPoints(_.filter(result, (item) => {
                                return item.TrackEnd - item.TrackStart >= 5
                            }), 45)
                        } else if (result.length > 100000 && result.length < 200000) {
                            result = DouglasPeucker.GetProcessPoints(_.filter(result, (item) => {
                                return item.TrackEnd - item.TrackStart >= 5
                            }), 40)
                        } else if (result.length > 50000 && result.length < 100000) {
                            result = DouglasPeucker.GetProcessPoints(_.filter(result, (item) => {
                                return item.TrackEnd - item.TrackStart >= 3
                            }), 35)
                        }
                        else if (result.length > 30000 && result.length < 50000) {
                            result = DouglasPeucker.GetProcessPoints(_.filter(result, (item) => {
                                return item.TrackEnd - item.TrackStart >= 3
                            }), 25)
                        }
                        else if (result.length > 20000 && result.length < 30000) {
                            result = DouglasPeucker.GetProcessPoints(result, 15)
                        } else {
                            result = DouglasPeucker.GetProcessPoints(result, 10)
                        }

                        result = _.map(result, i => {
                            return [i.TrackStart, i.TrackEnd, i.TrackHeight]
                        })
                        console.log('查询完成?' + result.length)
                        let maxy = 0,
                            miny = 0,
                            interval = 0
                        if (result.length > 0) {
                            maxy = _.maxBy(result, (n) => n[2])[2] + 3;
                            miny = _.minBy(result, (n) => n[2])[2];
                            interval = Math.round((maxy - miny) * .5)
                        }
                        res.send(msg.genSuccessMsg('查询成功', {
                            data: result,
                            maxh: maxy,
                            minh: miny,
                            interval: interval,
                        }))
                    })
            });

        } catch (error) {
            return res.send(msg.genFailedMsg('查询失败:' + error))
        }
    } else {
        try {
            var result = await Genome.find({
                FileName: query.filename,
                ClassName: query.classname,
                txStart: { $gte: query.start },
                txEnd: { $lte: query.end }
            }).exec()
            var max = 0;
            var min = 0
            var xdata = []
            var groupdata = []
            if (result.length > 0) {
                max = _.maxBy(result, (item) => {
                    return item.txEnd
                })
                min = _.minBy(result, item => {
                    return item.txStart
                })
                var xdata = _.range(min.txStart, max.txEnd,
                    Math.round((max.txEnd - min.txStart) / 10))
            }
            result = await genedata.GroupArr(result)
            if (result.length > 0)
                groupdata = _.range(0, result.groupcount + 1)
            res.send(msg.genSuccessMsg('查询成功', result.data, {
                min: min.txStart, max: max.txEnd,
                groupdata: groupdata, xdata: xdata
            }))
        } catch (error) {
            return res.send(msg.genFailedMsg('查询失败:' + error))
        }
    }
}

exports.GetFileList = async (req, res) => {
    fs.readdir('./static', (err, files) => {
        if (err) return res.send(msg.genFailedMsg('获取失败!', err))
        let index = 0
        let result = files.map(i => {
            return {
                name: i,
                index: ++index + ''
            }
        })
        res.send(msg.genSuccessMsg('获取成功!', result))
    })
}

var process = require('child_process');
exports.GetFileLen = async (req, res) => {
    try {
        let file = req.query.Path
        var path = `${__dirname}/../../static/${file}`
        process.exec(`wc -l ${path}`, (error, stdout, stderr) => {
            if (error) res.send(msg.genFailedMsg('获取失败->' + error))
            res.send(msg.genSuccessMsg('获取成功', parseInt(stdout.split(' ')[0])))
        })
    } catch (error) {
        res.send(msg.genFailedMsg('获取失败->' + error))
    }

}

exports.CheckData = async (req, res) => {
    let Path = req.query.Path
    var suffix = Path.substring(Path.lastIndexOf('.'))
    if (suffix == '.bed') {
        let result = await Track.findOne({ FileName: Path })
        if (result) {
            return res.send(msg.genSuccessMsg('检测完毕', true))
        }
    }
    else {
        let result = await Genome.findOne({ FileName: Path })
        if (result) {
            return res.send(msg.genSuccessMsg('检测完毕', true))
        }
    }
    return res.send(msg.genSuccessMsg('检测完毕', false))
}

exports.RemoveData = async (req, res) => {
    try {
        let Path = req.body.Path
        var suffix = Path.substring(Path.lastIndexOf('.'))
        if (suffix == '.bed') {
            await Track.deleteMany({ FileName: Path })
            return res.send(msg.genSuccessMsg('删除完毕'))
        }
        else {
            await Genome.deleteMany({ FileName: Path })
            return res.send(msg.genSuccessMsg('删除完毕'))
        }
    } catch (error) {
        return res.send(msg.genSuccessMsg('删除失败->' + error))
    }
}

exports.GetUploadFileList = async (req, res) => {
    fs.readdir('./static', async (err, files) => {
        if (err) return res.send(msg.genFailedMsg('获取失败!', err))
        //files
        let tracks = await Track.distinct('FileName')
        let genes = await Genome.distinct('FileName')
        let lst = _.concat(tracks, genes)
        let allgenefile = _.filter(files, (i) =>
            i.indexOf('.ucsc') >= 0
            || i.indexOf('.bed') >= 0)

        //console.log(allgenefile)
        var result = _.map(
            //_.filter(files, (i) => i.indexOf('.ucsc') >= 0 || i.indexOf('.bed') >= 0)
            allgenefile
            , (item) => {
                var status = lst.indexOf(item) >= 0
                return {
                    name: item.substring(0, item.lastIndexOf(".")),
                    class: item.split(".").length > 2
                        ? item.substring(
                            item.indexOf("."),
                            item.lastIndexOf(".")
                        )
                        : item.substring(item.lastIndexOf(".")),
                    status: status,
                    plan: status ? 100 : 0
                }
            })

        //比对数据
        res.send(msg.genSuccessMsg('获取成功!', result))
    })
}
exports.CheckFile = async (req, res) => {
    var filename = req.query.FileName
    var data = await GeneData.findOne({ FileName: filename })
    res.send(msg.genSuccessMsg('查询成功', data == null))
}
/************************************************************************ */
exports.UploadFile = async (req, res) => {
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({ uploadDir: './static' });
    //上传完成后处理
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.send(msg.genFailedMsg('上传失败', err))
        }

        for (let i = 0; i < files.file.length; i++) {
            var inputFile = files.file[i];
            var uploadedPath = inputFile.path;
            var dstPath = './static/' + inputFile.originalFilename;
            fs.rename(uploadedPath, dstPath, async function (err) {
                if (err) {
                    return res.send(msg.genFailedMsg('更名失败', err))
                }
                else {
                    files.file.path = dstPath;
                    if (i == files.file.length - 1) {
                        process.exec(`wc -l ${dstPath}`, async (error, stdout, stderr) => {
                            if (error) res.send(msg.genFailedMsg('获取失败->' + error))
                            var flen = parseInt(stdout.split(' ')[0])
                            var tname = inputFile.originalFilename
                            var fname = tname.substring(0, tname.indexOf("."))
                            var fclass = tname.split(".").length > 2
                                ? tname.substring(
                                    tname.indexOf("."),
                                    tname.lastIndexOf(".")
                                )
                                : tname.substring(tname.lastIndexOf("."))

                            //console.log(tname)
                            var data = await GeneData.findOne({ FileName: fname })
                            if (data == null) {
                                let _GeneData = new GeneData({
                                    FileName: fname,
                                    FilePath: files.file.path,
                                    FileLen: flen,
                                    ClassName: fclass,
                                    Status: 0
                                })
                                await _GeneData.updateAndSave()
                                return res.send(msg.genSuccessMsg('上传成功', files.file.path))
                            } else {
                                return res.send(msg.genFailedMsg('上传失败,文件已存在!'))
                            }
                        })

                    }
                }
            });
        }
    });
}

exports.GetGeneDataList = async (req, res) => {
    var query = {}
    let result = await GeneData.find(query)
    result = result.map(item => {
        return {
            name: item.FileName,
            path: item.FilePath,
            class: item.ClassName,
            status: item.Status,
            len: item.FileLen,
            plan: 0
        }
    })
    res.send(msg.genSuccessMsg('查询成功', result))
}

exports.Upload2mongo = async (req, res) => {
    var query = {
        start: req.body.start,
        end: req.body.end,
        index: req.body.index,
        path: req.body.path
    }
    var filename = query.path.substring(query.path.lastIndexOf('/') + 1)
    var filepath = query.path.substring(0, query.path.lastIndexOf('/') + 1)
    var name = filename.substring(0, filename.indexOf('.'))
    //console.log(`${query.start} ${query.end}`)
    var alltxt = ''
    await genedata.BedFileReader(query.path, query.start, query.end, (l) => {
        if (l == 'over') {
            //写入文件filepath + name + '.txt'
            var tmppath = `${filepath}${name}${query.index}.txt`
            fs.writeFile(tmppath, alltxt, (err) => {
                if (err) res.send(msg.genFailedMsg('上传失败'))
                else {
                    //调用接口上传到mongo文档
                    process.exec(`mongoimport --db admin --collection ${name} --file ${tmppath}`,
                        async (error, stdout, stderr) => {
                            if (error) return res.send(msg.genFailedMsg('上传失败'))
                            fs.unlinkSync(tmppath);
                            await GeneData.updateOne({ FileName: name }, {
                                Status: 1
                            })
                            res.send(msg.genSuccessMsg('上传成功'))
                        })
                }
            })
        } else {
            alltxt += JSON.stringify(
                {
                    FileName: name,
                    ClassName: 'chr' + l[0],
                    TrackStart: parseInt(l[1]),
                    TrackEnd: parseInt(l[2]),
                    TrackHeight: parseInt(l[3])
                }
            ) + '\n'
        }
    })
}


exports.CreateSpecies = async (req, res) => {
    var query = {
        name: req.body.name
    }
    var _Species = new Species(query)
    await _Species.updateAndSave()
    res.send(msg.genSuccessMsg('插入成功', _Species))
}

exports.ListSpecies = async (req, res) => {
    var list = await Species.find()
    res.send(msg.genSuccessMsg('获取成功', list))
}

exports.DelSpecies = async (req, res) => {
    var list = await Species.deleteOne({ name: req.query.name })
    res.send(msg.genSuccessMsg('获取成功', list))
}
/***************************************************************** */

exports.CreateProject = async (req, res) => {
    var query = {
        name: req.body.name,
        _sid: req.body._sid,
        users: req.body.users
    }
    console.log(query)
    var _Project = new Project(query)
    await _Project.updateAndSave()
    res.send(msg.genSuccessMsg('插入成功', _Project))
}

exports.ListProject = async (req, res) => {
    var list = await Project.find({
        _sid: req.query._sid
    })
    res.send(msg.genSuccessMsg('获取成功', list))
}

exports.DelProject = async (req, res) => {
    var list = await Project.deleteOne({ name: req.query.name })
    res.send(msg.genSuccessMsg('获取成功', list))
}

exports.GetUsersByProj = async (req, res) => {
    let proj = await Project.findOne({ _id: req.query._id })
    var projusers = proj.users.map(i => i._id)
    var inlist = await User.find({ _id: { $in: projusers } })
    inlist = inlist.map(i => {
        return {
            _id: i._id,
            name: i.UserName,
        }
    })
    var list = await User.find({})
    list = list.map(i => {
        return {
            _id: i._id,
            name: i.UserName,
        }
    })

    for (let index = 0; index < list.length; index++) {
        const element = list[index];
        element.edit = inlist.filter(i => i._id.toString() == element._id).length > 0
    }

    res.send(msg.genSuccessMsg('获取成功', list))
}


exports.UpdateProjUser = async (req, res) => {
    var query = {
        _id: req.body.projid,
        userid: req.body.userid,
        edit: req.body.edit
    }
    try {
        let proj = await Project.findOne({ _id: query._id })
        let user = proj.users.filter(i => i._id == query.userid)
        if (user.length > 0 && user[0].ismanager) {
            if (query.edit) {
                return res.send(msg.genFailedMsg('该用户已经存在'))
            }
            else {
                return res.send(msg.genFailedMsg('该用户为项目创建者不允许取消'))
            }
        } else {
            //console.log('非管理')
            if (user.length > 0) {
                if (query.edit) {
                    return res.send(msg.genFailedMsg('该用户已经存在'))
                }
                else {
                    //删除用户
                    _.remove(proj.users, (item) => {
                        return item._id == user[0]._id
                    })
                }
            } else {
                if (query.edit) {
                    proj.users.push({ _id: query.userid })
                } else {
                    return res.send(msg.genFailedMsg('找不到该用户'))
                }
            }
            await Project.updateOne({ _id: query._id }, proj)
            res.send(msg.genSuccessMsg('更新成功'))
        }
    } catch (error) {
        res.send(msg.genFailedMsg('更新失败->' + error))
    }

}

exports.GetGeneByProj = async (req, res) => {
    let proj = await Project.findOne({ _id: req.query._id })
    let genedata = await GeneData.find({ ClassName: '.ucsc', Status: 1 })

    genedata = genedata.map(i => {
        return {
            _id: i._id,
            name: i.FileName,
            edit: (i._id == proj.gene) && proj != null
        }
    })

    res.send(msg.genSuccessMsg('获取成功', genedata))
}


exports.UpdateProjGene = async (req, res) => {
    var query = {
        _id: req.body.projid,
        geneid: req.body.geneid,
    }
    try {
        await Project.updateOne({ _id: query._id }, { gene: query.geneid })
        res.send(msg.genSuccessMsg('更新成功'))
    } catch (error) {
        res.send(msg.genFailedMsg('更新失败'))
    }
}


exports.GetTrackByProj = async (req, res) => {
    try {
        let proj = await Project.findOne({ _id: req.query._id })
        if (proj.tracks) {
            var tracks = proj.tracks.map(i => i._id)
            console.log(tracks)
            var inlist = await GeneData.find({ _id: { $in: tracks } })
            console.log(inlist)
            inlist = inlist.map(i => {
                return {
                    _id: i._id,
                    name: i.FileName,
                    class: i.ClassName
                }
            })
        }

        let list = await GeneData.find({ ClassName: { $in: ['.peak', '.loop'] }, Status: 1 })
        list = list.map(i => {
            return {
                _id: i._id,
                name: i.FileName,
                edit: false,
                class: i.ClassName
            }
        })
        if (proj.tracks) {
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                element.edit = inlist.filter(i => i._id.toString() == element._id).length > 0
            }
        }

        res.send(msg.genSuccessMsg('获取成功', list))
    } catch (error) {
        res.send(msg.genFailedMsg('获取失败'))
    }

}

exports.UpdateProjTrack = async (req, res) => {
    var query = {
        _id: req.body.projid,
        trackid: req.body.trackid,
        edit: req.body.edit
    }
    let proj = await Project.findOne({ _id: query._id })
    if (!proj.tracks) {
        proj.tracks = []
    }
    let track = proj.tracks.filter(i => i._id == query.trackid)

    if (track.length > 0) {
        if (query.edit) {
            return res.send(msg.genFailedMsg('该数据已经存在'))
        } else {
            _.remove(proj.tracks, (item) => {
                return item._id == track[0]._id
            })
        }
    } else {
        if (query.edit) {
            proj.tracks.push({ _id: query.trackid })
        } else {
            return res.send(msg.genFailedMsg('找不到该数据'))
        }
    }
    await Project.updateOne({ _id: query._id }, proj)
    res.send(msg.genSuccessMsg('更新成功'))
}


exports.GetProjbyUserandSp = async (req, res) => {

    try {

        let proj = await Project.find({
            _sid: req.query._sid,
            'users._id': req.query.userid
        })

        res.send(msg.genSuccessMsg('查询成功', proj))
    } catch (error) {
        res.send(msg.genFailedMsg('查询失败->' + error))
    }

}

exports.GetCurrentGene = async (req, res) => {
    try {

        let cgene = await GeneData.findOne({ _id: req.query.gene })
        let result = await Genome.distinct('ClassName', { FileName: cgene.FileName })
        res.send(msg.genSuccessMsg('查询成功', result, cgene))
    } catch (error) {

        res.send(msg.genFailedMsg('查询失败->' + error))
    }
}

exports.GetTrackdataByProj = async (req, res) => {
    try {

        let proj = await Project.findOne({ _id: req.query.projid })
        let ids = proj.tracks.map(i => i._id)
        let tracks = await GeneData.find({ _id: { $in: ids } })
        res.send(msg.genSuccessMsg(tracks))
    } catch (error) {
        res.send(msg.genFailedMsg('查询失败->' + error))

    }
}


exports.mongodbtest = async (req, res) => {

    MongoClient.connect('mongodb://localhost:27017/', function (err, db) {
        if (err) throw err;
        var dbo = db.db("admin");
        dbo.collection("peaktest").find({
            ClassName: 'chr1',
            TrackStart: { '$gte': 0 },
            TrackEnd: { '$lte': 2742 }
        }).toArray((err, result) => {
            console.log(result)
            res.send(msg.genSuccessMsg('测试', result))
        })
    });
}