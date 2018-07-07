const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: String,
    _sid: String,
    gene: String,
    tracks: mongoose.Schema.Types.Mixed,
    users: mongoose.Schema.Types.Mixed,
})

projectSchema.pre('save', function (next) {
    next()
})
projectSchema.methods = {
    updateAndSave: function () {
        return this.save();
    }
}
projectSchema.statics = {
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
mongoose.model('Project', projectSchema);
