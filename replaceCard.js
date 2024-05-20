module.exports = (element, product) => {
    let output = element.replace(/{title}/g, product.productName);
    output = output.replace(/{image}/g , product.image)
    output = output.replace(/{price}/g, product.price)
    output = output.replace(/{description}/g , product.description)
    
    return output;
}