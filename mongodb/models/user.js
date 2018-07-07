const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//用户表
const userSchema = new Schema({
    UserID: String,
    UserPwd: { type: String, default: '123456' },
    UserName: String,
    UserSex: Number,
    UserAge: Number,
    UserPhoneNum: Number,
    UserEmail: String,
    UserCardID: String,
    UserHeadImage: String,
    UserCertificate: mongoose.Schema.Types.Mixed,
    UserCreatedAt: { type: Date, default: Date.now },
})

userSchema.pre('save', function (next) {
    next()
})
userSchema.methods = {
    updateAndSave: function () {
        return this.save();
    }
}
userSchema.statics = {
    fetch: function () { },
    findById: function () { },
    load: function (id) {
        return this.findOne({ _id: id }).exec();
    },
    list: function (options) {
        const criteria = options.criteria || {};
        const page = options.page || 0;
        const limit = options.limit || 30;
        return this.find({})
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(limit * page)
            .exec();
    }
}
mongoose.model('User', userSchema);
