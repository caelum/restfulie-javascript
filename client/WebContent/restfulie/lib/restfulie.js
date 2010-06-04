/**
 * Restfulie's client API entry point.<br/>
 * 
 * @author carlos alberto
 */
Restfulie = {
	at : function(uri) {
	  return new EntryPointService(uri);
	}
}


/**
* Função que executa o ajax
* 
* @param method
* @param uri
* @param content
* @param accept
* @return
*/
function ajax(method,uri,content,header){
	return jQuery.ajax({
		beforeSend: function(xhrObj){
			if (header['Accept'])
				xhrObj.setRequestHeader("Accept",header['Accept']);
			if (header['Content-Type'])
				xhrObj.setRequestHeader("Content-Type",header['Content-Type']);
			return xhrObj;
		},
		data:content,
		type: method,
		url: uri,
		async: false
	});
}

/** 
 * entry point 
 * 
 * @param uri
 * @return
 */
 

/**
 * Classe que serve como ponto de entrada para os recursos
 */
function EntryPointService(uri) {
	this.uri = uri;
	this.accept = "application/json";
	this.contentType = "application/json";

	this.accepts = function(accept){
		this.accept = accept;
		return this;
	}
	
	this.as = function(contentType){
		this.contentType = contentType;
		return this;
	}
	
	this.get = function(){
		var accept = this.accept; 
		var xhr = ajax("GET",this.uri,'',{'Content-Type':this.contentType,'Accept': this.accept});
		return new SerializerXHRStrategy().serialize(xhr,this); 
	}
	
	this.post = function(object){
		var backup = object.response;
		delete object.response; 
		var xhr = ajax("POST",this.uri,new SerializerResultStrategy(this.accept).parse(object),{'Content-Type':this.contentType,'Accept': this.accept});
		return new SerializerXHRStrategy().serialize(xhr, this);
	}
}
 
/**
 * Strategy para o tratamento do retorno do xhr 
 * @return
 */
function SerializerXHRStrategy(){
	var serializers = {
			'200' : new SucessXHRSerializer()
	};
	
	this.serialize = function(xhr,entryPoint){
		var serializer = serializers[xhr.status];
		if (serializer == null) serializer = new DefaultXHRSerializer();
		return serializer.serialize(xhr,entryPoint);
	}
}

/**
 * serializador default (status != 200)
 * 
 * @return
 */
function DefaultXHRSerializer(){
	this.serialize = function(xhr,entryPoint){
		var response = xhr.responseText;
		var result = new Object();
		result.toString = function (){return response };
		result.response = {
				body:response,
				code:xhr.status
		};
		return result;
	}
}
 
/**
 * serializa uma resposta de um objeto xhr que obteve sucesso (status == 200)
 */
function SucessXHRSerializer(){
	this.serialize = function(xhr,entryPoint){
		var result = new SerializerResultStrategy(entryPoint.accept).unparse(xhr.responseText);
		result.response = {
				body:xhr.responseText,
				code:xhr.status
		};
		return result;
	}
	
}


/**
 * parser result 
 * 
 * @return
 */
function SerializerResultStrategy(accept) {
	var serializers = {
			'application/json' : new SerializeResultJson()
	};
	this.accept = accept;
	
	this.unparse = function(data)	{
		return getSerializer(this.accept).unparse(data);
	}
	this.parse = function(data){
		return getSerializer(this.accept).parse(data);
	}
	
	function getSerializer (acceptType){
		var serializer = serializers[acceptType];
		if (serializer == null)	throw new RestfulieException('cannot find serializer from '+ accept,0);
		return serializer;
	}
	
}

/**
 * parser para application/json
 * @return
 */
function SerializeResultJson(){

	this.unparse = function(content){
		var result;
		result = JSON.parse(content);
		return result;
	}
	this.parse = function(object){
		return JSON.stringify(object);
	}
	
	this.accept = function(acceptType){
		return acceptType == 'application/json';
	}
}

/**
 * restfulie exception
 */
function RestfulieException(msg,errCode){
	 this.description = msg;
	 this.err = errCode;
}




