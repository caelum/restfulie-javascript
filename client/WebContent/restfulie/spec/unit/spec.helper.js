
AjaxRequest.ajax = function(method,uri,content,headers){
	if (uri == 'basket.json' && method == "GET"){
		return {
			status : 200,
			responseText : "{\"price\":40.0,\"link\":[{\"href\":\"http://localhost:3000/baskets/1/payments\",\"rel\":\"payment\",\"type\":\"application/json\"},{\"href\":\"http://localhost:3000/baskets/1\",\"rel\":\"self\",\"type\":\"application/json\"}]}" 
		};
	}
	
	if (uri == 'error' && method == "GET"){
		return {
			status : 404,
			responseText : "" 
		};
	}
	
	if (uri == 'basket.json' && method == "POST"){
		return {
			status : 201,
			responseText : "" 
		};
	}
	
}
