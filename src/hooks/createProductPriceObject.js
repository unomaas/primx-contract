// function that takes in the array of products data from the database and creates an object using the identifiers set for those products
// as keys and the price of those products as values
export default function createProductPriceObject(productArray) {
    const productObject = {};
    // loop through product array, making a key of the product's identifying code from the database and setting the value to that product's price
    productArray.forEach(product => {
      productObject[product.product_identifier] = product.product_price
    })
    return productObject;
}