const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//物种表
const speciesSchema = new Schema({
    name: String,
})

speciesSchema.pre('save', function (next) {
    next()
})
speciesSchema.methods = {
    updateAndSave: function () {
        return this.save();
    }
}
speciesSchema.statics = {
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
mongoose.model('Species', speciesSchema);
