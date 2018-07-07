const mongoose = require('mongoose');
const User = mongoose.model('User');
const { wrap: async } = require('co');
const msg = require('../../utils/message')
const SystemConfig = require('../../config/config')
const Mock = require('mockjs')


//检查ID是否重复
exports.checkID = async (req, res) => {
    if (!req.query.UserID) {
        return res.send(msg.genFailedMsg('id不能为空'))
    }
    let query = {
        UserID: req.query.UserID
    }
    let result = await User.findOne(query)
    if (!result) {
        return res.send(msg.genSuccessMsg('允许创建'))
    }
    console.log(req.query)
    res.send(msg.genFailedMsg('UserID重复!'))
}

//2018-3-14 20:49 更新
/***************************************************************************** */

exports.load = async(function* (req, res, next, id) {
    if (!id) {
        return res.send(msg.genFailedMsg('id不能为空'))
    }
    try {
        req.user = yield User.load(id)
        if (!req.user) return next(new Error('Use not found'));
    } catch (error) {
        return next(error);
    }
    next()
})

exports.create = async(function* (req, res) {
    if (Object.keys(req.body).length === 0) {
        return res.send(msg.genFailedMsg('body不能为空'))
    }
    let user = new User(req.body);
    try {
        yield user.updateAndSave();
        res.send(msg.genSuccessMsg('保存成功'))
    } catch (error) {
        console.log(error);
        res.send(msg.genFailedMsg('保存失败'))
    }
})

exports.update = async(function* (req, res) {
    try {
        let user = req.user;
        user = Object.assign(user, req.body);
        yield user.updateAndSave();
        res.send(msg.genSuccessMsg('保存成功'))
    } catch (error) {
        res.send(msg.genFailedMsg('保存失败'))
    }
})

exports.delete = async(function* (req, res) {
    try {
        let user = req.user;
        yield user.remove()
        res.send(msg.genSuccessMsg('删除成功', user))
    } catch (error) {
        console.log(error);
        res.send(msg.genFailedMsg('删除失败'))
    }
})

//分页获取人员数据
exports.list = async(function* (req, res) {
    console.log('test')
    var query = {
        page: parseInt(req.query.page) - 1,
        limit: parseInt(req.query.limit)
    }
    var count = query.limit
    if (SystemConfig.MockData == 1) {
        var Random = Mock.Random
        var data = []
        while (count > 0) {
            var item = Mock.mock({
                'UserID|1-1000': 1,
                'UserHeadImg|1': ['http://img.beihai365.com/bbs/upload/middle/31/484831.jpg?949',
                    'http://cdn103.img.lizhi.fm/audio_cover/2016/06/24/29465676307388039_320x320.png',
                    'http://cdn.lizhi.fm/audio_cover/2014/07/28/13301491710824583.jpg'],
                'UserName': Random.cname(),
                'UserSex': Random.integer(0, 1),
                'UserBirth': Random.date('yyyy-MM-dd'),
                'UserAddr': Random.city(true),
                'UserPhoneNum|1': ['13531544954', '13632250649', '15820292420', '15999905612'],
                'UserAge': Random.integer(20, 40),
                'UserRoles|1-5': [{
                    'id': Random.integer(0, 10000),
                    'name|1': ['普通员工', '管理员', '总经理', '操作员'],
                    'type|1': ['success', 'info', 'warning', 'danger', '']
                }]
            })
            data.push(item)
            count--
        }
        res.send(msg.genSuccessMsg('读取用户列表成功', data, { count: 2000 }))
    }
    try {
        var list = yield User.list(query);
        count = yield User.count();
        res.send(msg.genSuccessMsg('读取用户列表成功', list, { count: count }))
    } catch (error) {
        res.send(msg.genFailedMsg('获取用户列表失败'))
    }
})


//检查登录
exports.checklogin = async(function* (req, res) {
    if (Object.keys(req.body).length === 0) {
        return res.send(msg.genFailedMsg('body不能为空'))
    }
    if ((req.body.account && req.body.account === SystemConfig.Admin_User) &&
        (req.body.checkPass && req.body.checkPass === SystemConfig.Admin_Pwd)) {
        return res.send(msg.genSuccessMsg('登录成功'))
    }
    return res.send(msg.genFailedMsg('登录失败'))
})