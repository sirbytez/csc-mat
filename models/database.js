var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://oqbblevydycgxj:DhLQyyNA24mj4vJuz2HBkfvo9y@ec2-54-235-93-178.compute-1.amazonaws.com:5432/d8hvkouerbvocs';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query(
	'CREATE SCHEMA csc; '+
	'CREATE TABLE csc.produto ' +
	'( ' +
	   'id bigserial,  ' +
	   'nome text,  ' +
	   'descricao text,  ' +
	   'quantidade integer,  ' +
	   'PRIMARY KEY (id) ' +
	') ' + 
	'WITH (OIDS = FALSE); ' +
	'CREATE TABLE csc.preco ' +
	'( ' +
	  'id bigint NOT NULL, ' +
	  'valor numeric, ' +
	  'data date, ' +
	  'ativo boolean, ' +
	  'produto_id bigint, ' +
	  'CONSTRAINT preco_pkey PRIMARY KEY (id), ' +
	  'CONSTRAINT preco_produto_id_fkey FOREIGN KEY (produto_id) ' +
	      'REFERENCES csc.produto (id) MATCH SIMPLE ' +
	      'ON UPDATE NO ACTION ON DELETE NO ACTION ' +
	') ' +
	'WITH (OIDS=FALSE); ' +
	'CREATE TABLE csc.venda ' +
	'( ' +
	  'id bigserial NOT NULL, ' +
	  'produto_id bigint, ' +
	  'data date, ' +
	  'preco_id bigint, ' +
	  'CONSTRAINT venda_pkey PRIMARY KEY (id), ' +
	  'CONSTRAINT venda_preco_id_fkey FOREIGN KEY (preco_id) ' +
	      'REFERENCES csc.preco (id) MATCH SIMPLE ' +
	      'ON UPDATE NO ACTION ON DELETE NO ACTION, ' +
	  'CONSTRAINT venda_produto_id_fkey FOREIGN KEY (produto_id) ' +
	      'REFERENCES csc.produto (id) MATCH SIMPLE ' +
	      'ON UPDATE NO ACTION ON DELETE NO ACTION ' +
	') ' +
	'WITH (OIDS=FALSE);' 
	);

query.on('end', function(){client.end();});