var db = require('../config/connection');
var collection = require('../config/colletions');
const { Collection } = require('mongodb');
const { response } = require('../app');
var objectId = require('mongodb').ObjectId

module.exports = {
    
    addProduct:(product, callback) =>{

        db.get().collection('product').insertOne(product).then((data) =>{
            console.log(data);
            callback(product._id);
        })
    },
    getAllProducts : () =>{
        return new Promise (async(resolve, reject) =>{
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray();
            resolve(products)
        })
    },
    deleteProduct : (prodId) =>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id : objectId(prodId)}).then((response) =>{
               console.log(response);
                resolve(response)
            })
        })
    },
    getProductDetails : (prodId) =>{
        return new Promise ((resolve, reject) =>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id :objectId(prodId)}).then((product)=>{
                resolve(product);
            })
        })
    },
    updateProduct : (proId, proDetail) =>{
        return new Promise((resolve, reject) =>{
            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id : objectId(proId)},{
                $set : {
                    name : proDetail.name,
                    category : proDetail.category,
                    description : proDetail.description,
                    price : proDetail.price
                }
            }).then((response) =>{
                resolve()
            })
        })
    }
}