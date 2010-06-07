AjaxRequest.ajax = function(method,uri,content,headers){
	if (uri == 'basket.json' && method == "GET"){
		return ajaxMock(200,"{\"price\":40.0,\"link\":[{\"href\":\"http://localhost:3000/baskets/1/payments\",\"rel\":\"payment\",\"type\":\"application/json\"},{\"href\":\"http://localhost:3000/baskets/1\",\"rel\":\"self\",\"type\":\"application/json\"}]}"
		,{'Accept': "application/json","Content-Type":"application/json"}		
		); 
	}
	
	if (uri == 'error' && method == "GET"){
		return ajaxMock(404,"",{'Accept': "application/json","Content-Type":"application/json"});
	}
	
	if (uri == 'atualiza' && method == "POST"){
		return ajaxMock(200,"",{'Accept': "application/json","Content-Type":"application/json",'Location':"novo"});
	}

	if (uri == 'basket.json' && method == "POST"){
		return ajaxMock(201,"",{'Accept': "application/json","Content-Type":"application/json",'Location':"novo"});
	}

	if (uri == "novo" && method == "GET"){
		return ajaxMock(200,"{\"id\":4}",{'Accept':"application/json","Content-Type":"application/json"});
	}
}
function ajaxMock(status,responseText,headers){
	return {'status': status,
		'responseText' : responseText,
		getResponseHeader : function(header){
			return headers[header];
		}
	};
}
