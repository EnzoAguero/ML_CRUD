const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
	return	res.render('index',{
		visited : products.filter(producto => producto.category === "visited"),
		inSale : products.filter(producto => producto.category === "in-sale"),
		toThousand
		  /* necesito filtrar por categoria  */
	})
	},
	search: (req, res) => {
	let resultado = products.filter(producto => producto.name.toLowerCase().includes(req.query.keywords.toLowerCase().trim()))
    return  res.render('results',{
        products,
        resultado,
        busqueda: req.query.keywords
    })
	},
};

module.exports = controller;
