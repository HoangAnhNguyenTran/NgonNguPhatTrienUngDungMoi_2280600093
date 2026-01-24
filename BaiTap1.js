// Câu 1:constructor function Product
function Product(id, name, price, quantity, category, isAvailable) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.category = category;
    this.isAvailable = isAvailable;
}
// Câu 2:products with 6 products in at least 3 categories
const products = [
    new Product(1, "iPhone 15", 25000000, 10, "Phone", true),
    new Product(2, "Samsung Galaxy S23", 22000000, 0, "Phone", true),
    new Product(3, "MacBook Air M2", 32000000, 5, "Laptop", true),
    new Product(4, "Dell XPS 13", 28000000, 3, "Laptop", false),
    new Product(5, "AirPods Pro", 6000000, 20, "Accessories", true),
    new Product(6, "Logitech Mouse", 800000, 15, "Accessories", true)
];
// Câu 3: price and name of each product
const nameAndPrice = products.map(p => ({
    name: p.name,
    price: p.price
}));
console.log("Câu 3:", nameAndPrice);
// Câu 4: products with quantity > 0
const inStockProducts = products.filter(p => p.quantity > 0);
console.log("Câu 4:", inStockProducts);
// Câu 5: products with price > 30,000,000
const hasExpensiveProduct = products.some(p => p.price > 30000000);
console.log("Câu 5:", hasExpensiveProduct);
// Câu 6: accessories available
const allAccessoriesAvailable = products
    .filter(p => p.category === "Accessories")
    .every(p => p.isAvailable === true);
console.log("Câu 6:", allAccessoriesAvailable);
// Câu 7: total inventory value
const totalInventoryValue = products.reduce(
    (total, p) => total + p.price * p.quantity,
    0
);
console.log("Câu 7: T?ng giá tr? kho =", totalInventoryValue);
// Câu 8: for...or products
console.log("Câu 8:");
for (const p of products) {
    console.log(
        `Tên: ${p.name} | Danh m?c: ${p.category} | Tr?ng thái: ${p.isAvailable ? "Ðang bán" : "Ng?ng bán"}`
    );
}
// Câu 9: for...in name and value of first product
console.log("Câu 9:");
for (const key in products[0]) {
    console.log("Thu?c tính:", key);
    console.log("Giá tr?:", products[0][key]);
}
// Câu 10: names of products that are available and in stock
const sellingAndInStockNames = products
    .filter(p => p.isAvailable && p.quantity > 0)
    .map(p => p.name);

console.log("Câu 10:", sellingAndInStockNames);
