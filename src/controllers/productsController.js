const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const guardar = (products) => {
	fs.writeFileSync(productsFilePath,
	  JSON.stringify(products, null, 2),
	  "utf-8");
  }; //escribo el json

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		return res.render('products',{
			products,
			toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let product = products.find(product => product.id === +req.params.id)

		return res.render('detail',{
			product,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		return res.render('product-create-form') /* renderiza la pagina */
	},
	
	// Create -  Method to store
	store: (req, res) => {
		const {name,price,discount,category,description} = req.body

		let product = {   /* creo una variable que va a ser un producto que se va a ingresar por req.body que seria lo que se ingreso por la pagina */
			id : products[products.length-1].id+1,
			name,
			price : +price,
			discount : +discount,
			category,
			description,
			image : 'default-image.png'
		}
		products.push(product)  /* y lo pusheo */
		guardar(products)
		res.redirect("/products");


	},

	// Update - Form to edit
	edit: (req, res) => {
		let product = products.find(product => product.id === +req.params.id)
		return res.render('product-edit-form',{
			product, /* le paso como objeto literal el producto que encontro por parametros, es decir el que yo clickie */
		})
	},
	// Update - Method to update
	update: (req, res) => {


		const { name, price, discount, category, description } = req.body;

		products.forEach(product => {
			if (product.id === +req.params.id) {
			  product.id=+req.params.id;
			  product.name = name;
			  product.price = +price;
			  product.discount = +discount;
			  product.category = category;
			  product.description = description;
			}
		  });

		guardar(products)
		return res.redirect('/products')
	
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		products.forEach(product => {
			if(product.id === +req.params.id){
				var eliminar = products.indexOf(product) /* busco el producto que paso por parametro  */ /* el indexof me devuelve un indice */
				products.splice(eliminar,1)  /* y elimino solo ese producto */


				/* products = products.filter(product => product.id !== +req.params.id) */
			}

		})
		fs.writeFileSync(productsFilePath,JSON.stringify(products,null,2),'utf-8') 
		return res.redirect('products/detail' + req.params.id)
	}
};

module.exports = controller;