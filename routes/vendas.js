var express = require('express');
var pg = require('pg');
var router = express.Router();
// var connectionString = 'postgres://postgres:123456@localhost:5432/todo';
var connectionString = 'postgres://oqbblevydycgxj:DhLQyyNA24mj4vJuz2HBkfvo9y@ec2-54-235-93-178.compute-1.amazonaws.com:5432/d8hvkouerbvocs';

router.get('/vendas', function(req, res, next){
	var results = [];

	pg.connect(connectionString, function(err, client, done){
		if(err){
			done();
			console.log(err);
			return req.status(500).json({success: false});
		}

		var query = client.query("SELECT * FROM csc.venda");
		query.on('row', function(row){
			client.query("SELECT * FROM csc.produto WHERE produto.id = $1", [row.id], function(err, result){
				if(err){
					done();
					console.log(err);
					return res.status(500).json({success: false, err: err});
				}

				row.produto = result.rows[0];
			});

			results.push(row);
		});
	});

	return res.json(results);
});

router.post('/vendas', function(req, res, next){
	var venda = {produto_id: req.body.produto_id, preco_id: req.body.preco_id, quantidade: req.body.quantidade};

	pg.connect(connectionString, function(err, client, done){
		if(err){
			done();
			console.log(err);
			return res.status(500).json({success: false, err: err});
		}

		client.query('INSERT INTO csc.venda(produto_id, preco_id) VALUES($1, $2)', [venda.produto_id, venda.preco_id], function(err, result){
			if(err){
				done();
				console.log(err);
				return res.status(500).json({success: false, err: err});
			}

			return res.status(201).json({success: true});
		});
	});
});

module.exports = router;