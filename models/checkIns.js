var mongoose = require('mongoose'),
    ObjectId = require('mongoose').Types.ObjectId,
    Schema = mongoose.Schema,

    checkInsSchema = new Schema({
    vendor_id : {
        type:String,
    },
    userId : {
        type:String,
        required:true
    },
    checkin_type : {
        type:String
    },
    points : {
        type:Number
    },
    vendor_name : {
        type:String
    },
    time : {
        type:String
    }
});


var checkIns = mongoose.model('checkIns', checkInsSchema);
module.exports = checkIns;
