function UserCtrl($scope,$http,$location){
	$scope.renderDebates = function(){
		$location.path('/debates');
	}
	$http.get("/api/users/me.json").success(function(d){
		$scope.user = d;
	});
}
		
function DebatesCtrl($scope,$http,$location,currentDebate){
	$scope.renderDebate = function(d){
		currentDebate.place(d);
		$location.path('/debates/' + d.id);			
	}
	$scope.countPremises = function(debate){
		if(debate.nodes == null)
			return 0;
		var counts = debate.nodes.map(function(n){
			return n.statements.length;
		});
		if(counts.length == 0)
			return 0;
		return counts.reduce(function(a,b){return a+b;});
	}
	$scope.createDebate = function(){
		var yea,nay;
		$scope.showNewDebate=false;
		if($scope.side){
			yea = $scope.user.email;
			nay = $scope.opponent;
		}
		else{
			yea = $scope.opponent;
			nay = $scope.user.email;
		}
		var debate = newDebate($scope.q,yea,nay,$scope.sendinvite);
		$http.post('/api/debates/new',JSON.stringify(debate)).success(function(d){
			$scope.renderDebate(d);	
		});
	}
	$scope.removeDebate = function(debate){
		if(confirm("You sure about that?")){
			$http.post('/api/debates/delete.json',JSON.stringify({debate_id:debate.id})).success(function(d){
				$scope.user.debates = $scope.user.debates.filter(function(de){
					return de.id != debate.id;
				});
			});
		}
	}
	$http.get("/api/users/me.json").success(function(d){
		$scope.user = d;
		if($scope.user.debates == null || $scope.user.debates.length == 0){
			$scope.showNewDebate = true;
		}
	});
	
	$scope.side = true;
	$scope.sendinvite = true;
}
function DebateCtrl($scope,$http,$location,currentDebate){
	$scope.addStatement = function(item){
		if(item.temp != null && item.temp.val !== ""){
			// find links and move to evidence
			item.statements = (item.statements == null ? [] : item.statements);
			item.statements.push(newStatement(item.temp));
			item.temp.val = "";
		}
	}
	$scope.removeStatement = function(statement){
		if(confirm("You sure about that?")){
			if(statement.id != null && statement.id > 0){
				$http.post('/api/statements/' + statement.id + '/delete.json',{}).success(function(d){
					$scope.debate.nodes = $scope.debate.nodes.map(function(n){
						n.statements = n.statements.filter(function(s){
							return s != statement;
						});
						return n;
					});
				});
			}
			else{
				$scope.debate.nodes = $scope.debate.nodes.map(function(n){
					n.statements = n.statements.filter(function(s){
						return s != statement;
					});
					return n;
				});
			}
		}
	}

	$scope.disputePremise = function(side,premise){
		var node = newNode('counter_argument',side,"The premise \""+premise.val.replace(/\./,"") +"\" is incorrect.")
		node.debate_id = $scope.debate.id;
		$http.post('/api/nodes/create.json',JSON.stringify(node)).success(function(d){
			node.id = d.id;
			node.username = $scope.user.username;
			$scope.debate.nodes = [node].concat($scope.debate.nodes);
			$("html, body").animate({ scrollTop: 0}, 500);
			$scope.enableEdit(node.id,$scope.user.email);

		});
	}
	$scope.disputeConclusion= function(side,item){
		var node = newNode('counter_argument',side,"The conclusion \""+item.conclusion.replace(/\./,"") +"\" is incorrect.")
		node.debate_id = $scope.debate.id;
		$http.post('/api/nodes/create.json',JSON.stringify(node)).success(function(d){
			node.id = d.id;
			node.username = $scope.user.username;
			$scope.debate.nodes = [node].concat($scope.debate.nodes);
			$("html, body").animate({ scrollTop: 0}, 500);		
			$scope.enableEdit(node.id,$scope.user.email);
		});
	}
	
	$scope.addNode = function(){
		var side = $scope.debate.nay_email == $scope.user.email ? 'right' : 'left';
		var conclusion = $scope.debate.nay_email == $scope.user.email ? 'No.' : 'Yes.';
		var node = newNode('argument',side,conclusion);
		node.debate_id = $scope.debate.id;
		$http.post('/api/nodes/create.json',JSON.stringify(node)).success(function(d){
			node.id = d.id;
			node.username = $scope.user.username;
			node.isNew = true;
			$scope.debate.nodes = [node].concat($scope.debate.nodes);
			$("html, body").animate({ scrollTop: 0}, 500);
			$scope.enableEdit(node.id,$scope.user.email);
		});
	}
	$scope.removeNode = function(id){
		if(confirm("You sure about that?")){
			if(id == 0){
				$scope.debate.nodes = $scope.debate.nodes.filter(function(n){
					return n.id != id;
				});
			}else{
				$http.post('/api/nodes/' + id + '/delete.json',{}).success(function(d){
					$scope.debate.nodes = $scope.debate.nodes.filter(function(n){
						return n.id != id;
					});
				});
			}
		}
	}
	$scope.enableEdit = function(key,side_email){
		if($scope.user.email == side_email)
			$scope.edit[key] = true;
	}
	$scope.disableEdit = function(key,side_email){
		if($scope.user.email == side_email)
			$scope.edit[key] = false;
	}
	$scope.editing = function(key){
		return $scope.edit[key];
	}
	$scope.userIsRight = function(){
		if($scope.user == null || $scope.user.email == null || $scope.debate == null){
			return false;
		}
		return $scope.user.email == $scope.debate.nay_email;
	}
	$scope.userIsLeft = function(){
		if($scope.user == null || $scope.user.email == null || $scope.debate == null){
			return false;
		}
		return $scope.user.email == $scope.debate.yea_email;
	}
	
	$scope.saveNode = function(item){
		// prune out the $$hashkey for item
		var sendableItem = {
			id:item.id,
			// prune out the $$hashkey for statements
			statements:item.statements.map(function(s){
				var st = newStatement(s);
				st.id = s.id == null ? 0 : s.id;
				st.deletePlease = s.deletePlease == null ? false : s.deletePlease;
				return st;
			}),
			conclusion:item.conclusion
		};
		$http.post('/api/nodes/' + item.id + '/save.json',JSON.stringify(sendableItem)).success(function(d){
			$scope.disableEdit(item.id,$scope.user.email);
		});
	}
	
	/* tracks editable items */
	$scope.edit = [];
	if(currentDebate.grab() == null){
		var p = $location.path().split("/");
		currentDebate.place({id:p[p.length-1]});
	}		
	$http.get("/api/debates/" + currentDebate.grab().id + ".json").success(function(d){
		$scope.debate = d;
	});
}