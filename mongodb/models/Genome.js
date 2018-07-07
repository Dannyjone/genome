const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//会议表
const GenomeSchema = new Schema({
    FileName: String,
    ClassName: String,
    txStart: Number,
    txEnd: Number,
    cdsStart: Number,
    cdsEnd: Number,
    strand: String,
    Name: String,
    exonStarts: String,
    exonEnds: String
})

GenomeSchema.pre('save', function (next) {
    next()
})
GenomeSchema.methods = {
    updateAndSave: function () {
        return this.save();
    }
}
GenomeSchema.statics = {
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
mongoose.model('Genome', GenomeSchema);
