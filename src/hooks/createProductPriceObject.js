// function that takes in the array of products data from the database and creates an object using the identifiers set for those products
// as keys and the price of those products as values
export default function createProductPriceObject(productArray) {
    const productObject = {};
    
    productArray.forEach(product => {
      productObject[product.product_identifier] = product.product_price
    })
    return productObject;
}