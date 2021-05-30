const mongoose = require('mongoose')

const url = "mongodb+srv://tphiepbk:hiepit-2992@cluster0.axbkf.mongodb.net/bk-iot?retryWrites=true&w=majority";
mongoose.connect(url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connect to MongoDB successfully");
}).catch((error) => {
    console.log(error);
})

