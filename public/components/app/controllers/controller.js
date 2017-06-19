va = angular.module('livronaoseemprestaApp.controllers', []);

va.controller('autorsCtrl', ['$scope', '$http', '$location', '$routeParams', '$resource',
	function($scope, $http, $location, $routeParams, $resource){
		
		$scope.getAutors = function() {
			$http.get('/api/v1/autor').success(function(response){
				$scope.autors = response;
			});
		};

		$scope.autorSave = function() {
			if($scope.autor === undefined ){
				alert("Deve-se preencher todos os campos.");
			}
			else {
				var autor = $resource('/api/v1/autor');
				autor.save($scope.autor,
				function(response){
					alert("Autor registrado com sucesso!");
					$location.path('/autor');
					highlightSearch(); //Highlights the menu of /resource list
				},
				function(response){
					alert("OPS. Verifique tods os campos e tente novamente.");
					if(response.message != undefined){
						alert(response.message);
					}
				});
			}
		};

		$scope.getId = function() {
			var autor_id = $routeParams.autor_id;
			var autor = $resource('/api/v1/autor/:id', { id : '@id'});
			autor.get({id: autor_id}, function(autor, getResponseHeaders){
				$scope.autor = autor;
			});
		}

		$scope.autorUpdate = function() {
			if($scope.autor === undefined ){
				alert("Deve-se preencher todos os campos.");
			}
			else {
				var autor = $resource('/api/v1/autor/:id', { id : '@id'}, { update: { method:'PUT' }});
				autor.update($scope.autor,
				function(response){
					alert("Autor editado com sucesso!");
					$location.path('/autor');
					highlightSearch(); //Highlights the menu of /resource list
				},
				function(response) {
					alert("OPS. Verifique tods os campos e tente novamente.");
					if(response.message != undefined){
						alert(response.message);
					}
				});
			}
		};

		$scope.autorDelete = function(_id) {
			var __id =parseInt(_id);
			if(__id){
				if(confirm("Remover #"+__id+"?")){
					var autor = $resource('/api/v1/autor/:id', { id : '@id'});
					autor.delete({id:__id},
					function(response){
						alert("O autor com o id "+__id+" foi removido com sucesso.");

						var g = $scope.autors;
						for (var i = g.length - 1; i >= 0; i--) {
							if(g[i].id == __id){
								g.splice(i, 1);
								break;
							}
						};
					},
					function(response) {
						alert("OPS. Não foi possível remover. Tente novamente..");
						if(response.message != undefined){
							alert(response.message);
						}
					});
				}
				
			}
		};

	}
]);

va.controller('categoriasCtrl', ['$scope', '$http', '$location', '$routeParams', '$resource',
	function($scope, $http, $location, $routeParams, $resource){

		$scope.getCategorias = function() {
			$http.get('/api/v1/categoria').success(function(response){
				$scope.categorias = response;
			});
		};

		$scope.categoriaSave = function() {
			if($scope.categoria === undefined ){
				alert("Deve-se preencher todos os campos.");
			}
			else {
				var categoria = $resource('/api/v1/categoria');
				categoria.save($scope.categoria,
				function(response){
					alert("Categoria registrada com sucesso.");
					$location.path('/categoria');
					highlightSearch(); //Highlights the menu of /resource list
				},
				function(response) {
					alert("OPS. Verifique tods os campos e tente novamente.");
					if(response.message != undefined){
						alert(response.message);
					}
				});
			}
		};

		$scope.getId = function() {
			var categoria_id = $routeParams.categoria_id;
			var categoria = $resource('/api/v1/categoria/:id', { id : '@id'});
			categoria.get({id: categoria_id}, function(categoria, getResponseHeaders){
				$scope.categoria = categoria;
			});
		}

		$scope.categoriaUpdate = function() {
			if($scope.categoria === undefined ){
				alert("Deve-se preencher todos os campos.");
			}
			else {
				var categoria = $resource('/api/v1/categoria/:id', { id : '@id'}, { update: { method:'PUT' }});
				categoria.update($scope.categoria,
				function(response){
					alert("Categoria editada com sucesso!");
					$location.path('/categoria');
					highlightSearch(); //Highlights the menu of /resource list
				},
				function(response) {
					alert("OPS. Verifique tods os campos e tente novamente.");
					if(response.message != undefined){
						alert(response.message);
					}
				});
			}
		};

		$scope.categoriaDelete = function(_id) {
			var __id =parseInt(_id);
			if(__id){
				if(confirm("Remover #"+__id+"?")){
					var categoria = $resource('/api/v1/categoria/:id', { id : '@id'});
					categoria.delete({id:__id},
					function(response){
						alert("A categoria de id "+__id+" foi removida");
						//$location.path('/');
						//$location.path('/categorias');
						var g = $scope.categorias;
						for (var i = g.length - 1; i >= 0; i--) {
							if(g[i].id == __id){
								g.splice(i, 1);
								break;
							}
						};
						highlightSearch(); //Highlights the menu of /resource list
					},
					function(response) {
						alert("OPS. Não foi possível remover. Tente novamente..");
						if(response.message != undefined){
							alert(response.message);
						}
					});
				}
				
			}
		};
	}
]);
va.controller('livrosCtrl', ['$scope', '$http', '$location', '$routeParams', '$resource', '$log',
	function($scope, $http, $location, $routeParams, $resource, $log){

		$scope.livro = {};
		$scope.autors = [];
		$scope.categorias = [];

		$scope.getlivros = function() {
			$http.get('/api/v1/livro').success(function(response){
				$scope.livros = response;
				for (var i = $scope.livros.length - 1; i >= 0; i--) {
					$http.get('/api/v1/autor/'+$scope.livros[i].autor_id).success(function(response){
						for (var i = $scope.livros.length - 1; i >= 0; i--) {
							if($scope.livros[i].autor_id == response.id){
								$scope.livros[i].autor = response;
							}
						};
					});
					$http.get('/api/v1/categoria/'+$scope.livros[i].categoria_id).success(function(response){
						for (var i = $scope.livros.length - 1; i >= 0; i--) {
							if($scope.livros[i].categoria_id == response.id){
								$scope.livros[i].categoria = response;
							}
						};
					});
				};
			});
		};

		$scope.getOptions = function() {
			$http.get('/api/v1/autor').success(function(response){
				$scope.autors = response;
			});
			$http.get('/api/v1/categoria').success(function(response){
				$scope.categorias = response;
			});
		};

		$scope.livroSave = function() {
			if($scope.livro === undefined ){
				alert("Deve-se preencher todos os campos.");
			}
			else {
				var livro = $resource('/api/v1/livro');
				livro.save($scope.livro,
				function(response){
					alert("Livro adicionado com sucesso!");
					$location.path('/livro');
					highlightSearch(); //Highlights the menu of /resource list
				},
				function(response) {
					alert("OPS. Verifique tods os campos e tente novamente.");
					if(response.message != undefined){
						alert(response.message);
					}
				});
			}
		};

		$scope.getId_ = function() {
			var livro_id = $routeParams.livro_id;
			var livro = $resource('/api/v1/livro/:id', { id : '@id'});
			livro.get({id: livro_id}, function(livro, getResponseHeaders){
				$scope.livro = livro;
			});
		}

		$scope.livroUpdate = function() {
			if($scope.livro === undefined ){
				alert("Deve-se preencher todos os campos.");
			}
			else {
				var livro = $resource('/api/v1/livro/:id', { id : '@id'}, { update: { method:'PUT' }});
				livro.update($scope.livro,
				function(response){
					alert("Livro editado com sucesso.");
					$location.path('/livro');
					highlightSearch(); //Highlights the menu of /resource list
				},
				function(response) {
					alert("OPS. Verifique tods os campos e tente novamente.");
					if(response.message != undefined){
						alert(response.message);
					}
				});
			}
		};

		$scope.livroDelete = function(_id) {
			var __id =parseInt(_id);
			if(__id){
				if(confirm("Remover #"+__id+"?")){
					var livro = $resource('/api/v1/livro/:id', { id : '@id'});
					livro.delete({id:__id},
					function(response){
						alert("O livro com o ID "+__id+" foi removido.");

						var g = $scope.livros;
						for (var i = g.length - 1; i >= 0; i--) {
							if(g[i].id == __id){
								g.splice(i, 1);
								break;
							}
						};
					},
					function(response) {
						alert("OPS. Não foi possível remover. Tente novamente..");
						if(response.message != undefined){
							alert(response.message);
						}
					});
				}
				
			}
		};

	}
]);

va.controller('emprestadoCtrl', ['$scope', '$http', '$location', '$routeParams',
	function($scope, $http, $location, $routeParams){

		$scope.getClients = function(){
			$http.get('/api/v1/emprestado').success(function(response){
				$scope.emprestado = response;
			});
		}
	}
]);