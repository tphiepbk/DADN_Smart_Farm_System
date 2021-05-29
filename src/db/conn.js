const mongoose = require('mongoose')

const url = "mongodb+srv://tphiepbk:hiepit-2992@cluster0.axbkf.mongodb.net/smart_farm?retryWrites=true&w=majority";
mongoose.connect(url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connect successfully");
}).catch((error) => {
    console.log(error);
})