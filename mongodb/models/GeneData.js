const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//会议表
const GeneDataSchema = new Schema({
    FileName: String,
    FilePath: String,
    ClassName: String,
    FileLen: Number,
    Status: Number,
})

GeneDataSchema.pre('save', function (next) {
    next()
})
GeneDataSchema.methods = {
    updateAndSave: function () {
        return this.save();
    }
}
GeneDataSchema.statics = {
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
mongoose.model('GeneData', GeneDataSchema);
