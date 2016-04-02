var express = require('express');
var pg = require('pg');
var router = express.Router();
// var connectionString = 'postgres://postgres:123456@localhost:5432/todo';
var connectionString = 'postgres://oqbblevydycgxj:DhLQyyNA24mj4vJuz2HBkfvo9y@ec2-54-235-93-178.compute-1.amazonaws.com:5432/d8hvkouerbvocs';

router.get('/produtos', function(req, res, next){
	var results = [];

	pg.connect(connectionString, function(err, client, done){
		if(err){
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}

		var query = client.query('SELECT produto.*, preco.valor FROM csc.produto produto INNER JOIN csc.preco preco ON preco.produto_id = produto.id WHERE preco.ativo = true', [],function(err, result){
			done();
			return res.status(200).json(result.rows);
		});
	});
});

router.post('/produtos', function(req, res, next){
	var produto = {nome: req.body.nome, descricao: req.body.descricao, quantidade: req.body.quantidade, preco: req.body.preco};

	pg.connect(connectionString, function(err, client, done){
		if(err){
			done();
			console.log(err);
			return res.json({success: false, data: err});
		}
		client.query('INSERT INTO csc.produto(nome, descricao, quantidade) VALUES($1, $2, $3) RETURNING id', [produto.nome, produto.descricao, produto.quantidade], function(err, result){
			if(err){
				console.log(err);
				return res.json({success: false, data: err});
			} else{
				produto.id = result.rows[0].id;
				console.log(produto.id, result.rows[0].id);
				done();
				client.query('INSERT INTO csc.preco(valor, produto_id) VALUES($1, $2)', [produto.preco, produto.id], function(err, result){
					if(err){
						console.log(err);
						return res.status(500).json({success: false, error: err});
					} else{
						return res.status(201).json({produto: produto});
					}
				});
			}
		});
	});
});

router.put('/produto/:id', function(req, res, next){
	var id = req.params.id;
	var produto = {nome: req.body.nome, descricao: req.body.descricao, valor: req.body.preco};

	pg.connect(connectionString, function(err, client, done){
		if(err){
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}

		client.query("UPDATE csc.produto SET nome=($1), descricao=($2) WHERE id = $3", [produto.nome, produto.descricao, id], function(err, result){
			if(err){
				console.log(err);
				return res.status(500).json({success: false, data: err});
			}

			if(produto.valor !== null){
				client.query("UPDATE csc.preco SET ativo=false WHERE produto_id = $1", [id], function(err, result){
					if(err){
						console.log(err);
						return res.status(500).json({success: false, data: err});
					}

					client.query("INSERT INTO csc.preco(valor, produto_id) VALUES($1, $2)", [produto.valor, id], function(err, result){
						if(err){
							console.log(err);
							return res.status(500).json({success: false, data: err});
						}
						return res.status(200).json({sucess: true});
					});
				});
			} else{
				return res.status(200).json({success: true});
			}
		});
	});
});

// router.delete('/produto/:id', function(req, res, next){
// 	var id = req.params.id;

// 	pg.connect(connectionString, function(err, client, done){
// 		if(err){
// 			done();
// 			console.log(err);
// 			return res.status(500).json({success: false, data: err});
// 		}

// 		client.query("DELETE FROM csc.preco WHERE id = $1", [id], function(err, result){
// 			if(err){
// 				done();
// 				console.log(err);
// 				return res.status(500).json({success: false, data: err});
// 			}

// 			client.query("DELETE FROM csc.produto WHERE id = $1", [id], function(err, result){
// 				if(err){
// 					done();
// 					console.log(err);
// 					return res.status(500).json({success: false});
// 				}

// 				return res.status(200).json({success: true});
// 			});
// 		});
// 	});
// });

module.exports = router;