const path=require('path');
const moment = require('moment');
module.exports ={

    uploadDir:path.join(__dirname,'../public/uploads/'),

    isEmpty:function(obj){
        for( let key in obj){
            if(obj.hasOwnProperty(key)){
                return false;
            }
        }
        return true;
    },
        generateDate: function(date, format){
            return moment(date).format(format);
    }
    

};