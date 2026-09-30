const mongoose=require("mongoose");
const transactionSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    amount:{
        type:Number,
        required:true,
        min:0
    },
    type:{
        type:String,
        enum:["income","expense"],
        required:true

    },
    category:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        trim:true,
        maxlength:500
    },
    date:{
        type:Date,
        default:Date.now
    }

},
{
    timestamps:true
}
);
const Transaction=mongoose.model(
    "Transaction",
    transactionSchema
);
// Indexes for faster queries
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, category: 1 });
module.exports=Transaction;