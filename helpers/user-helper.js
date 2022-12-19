var db = require('../config/connection');
var collection = require('../config/colletions');
const bcrypt = require('bcrypt');

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email });
            console.log(user);
            if (user) {
                let err = new Error('user already exists')
                reject(err)
            }
            else{
                userData.password = await bcrypt.hash(userData.password, 10);
                db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                    console.log(data);
                    resolve(userData)
                })
            }


        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            loginStatus = false;
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log('success')
                        response.user = user 
                        response.status = true;
                        resolve(response)
                    }
                    else {
                        console.log('login failed');
                        resolve({status :false});

                    }
                })

            }
            else {
            
                console.log('login failed');
                resolve({status: false})
            }
        })
    }


}