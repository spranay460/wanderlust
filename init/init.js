const initdata = require("./data.js");
const mongoose = require('mongoose');
const Listing = require("../models/listing.js");

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then(()=>{
    console.log("connected to wanderlust db");
}).catch((err)=>{
    console.log("not connected to wanderlust db");
    console.log(err);
})

async function initializeData(){
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj, owner:"67348b17e2c1f6cc6e018123"}));
    await Listing.insertMany(initdata.data).then(()=>{
        console.log("all data is added to wanderlust db");
    }).catch((err)=>{
        console.log("all data is not added to wanderlust db");
        console.log(err);
    })
}
initializeData();

