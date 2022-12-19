var db = require('../config/connection');
var collection = require('../config/colletions');


module.exports = {
    doLoginAdmin : (adminData) =>{
        return new Promise( async (resolve, reject) =>{

            let response = {};
            let Admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({$and :[{username : adminData.username},{password : adminData.password}]});

            if(Admin){
                response.admin = Admin
                response.status = true;
                resolve(response);
            }
            else{
                let err = new Error('there is no such admin')
                reject(err);
            }


        })
      
       
    }
}