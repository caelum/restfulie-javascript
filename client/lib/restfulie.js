
var Restfulie = {};

(function(restfulie){

  restfulie.at = function(uri){
    return new EntryPoint(uri);
  }; 


  AjaxRequest = {
    ajax: function(method,uri,content,headers){
	  	return jQuery.ajax({
	  		beforeSend: function(xhrObj){
	  			for (var x in headers)
	  				xhrObj.setRequestHeader(x,headers[x]);
	  			return xhrObj;
	  		},
	  		data:content,
	  		type: method,
	  		url: uri,
	  		async: false
	  	});
  	} 
  }  
  


  function EntryPoint(uri){
    this.uri = uri;

    this.headers = {
      "Accept" : "application/json",
      "Content-Type" : "application/json"    
    };

    this.accepts = function(accept){
  		this.headers["Accept"] = accept;
  		return this;
  	}
  	
  	this.as = function(contentType){
  		this.headers["Content-Type"] = contentType;
  		return this;
  	}

    this.get = function(){
  		var xhr = AjaxRequest.ajax("GET",this.uri,'',this.headers);
      return SerializeXHR.serialize(xhr);
  	}
    
    this.post = function(resource){
      var backup;
      var content;
      var xhr;      
      
      backup = resource.response;
      delete resource.response;      
      content = resourceToString(resource,this.headers['Content-Type']);
      resource.response = backup;
  		xhr = AjaxRequest.ajax("POST",this.uri,content,this.headers);
      return SerializeXHR.serialize(xhr,this);
    }

  }    

  SerializeXHR = {
    serialize : function (xhr,entryPoint){
      var serializer = SerializerXHRResponse[xhr.status];
      if (serializer == null) serializer = SerializerXHRResponse["default"];
      return serializer(xhr,entryPoint);
    }
  }

  SerializerXHRResponse = {
    "default" : function(xhr,entryPoint){
      var resource = {};
      return addResponseXHR(addResponseXHR(resource,xhr),xhr);
    },
    "200" : function(xhr,entryPoint){
      return addResponseXHR(responseToObject(xhr),xhr);   
    },
    "201" : function(xhr,entryPoint){
      var location = xhr.getResponseHeader("Location");
 		  var accept = entryPoint.headers['Accept'];
 		  return Restfulie.at(location).accepts(accept).get();
    }

   
  }
  
  function addResponseXHR(resource,xhr){
    resource.response = {};
    resource.response.body = xhr.responseText;
    resource.response.code = xhr.status;
    return resource;
  }  

    

  function responseToObject(xhr){
    var contentType = xhr.getResponseHeader("Content-Type").split(";")[0];
    var parser = XHRResultParser[contentType];
    if (parser == null) throw new RestfulieException("Content-Type: "+contentType+" is not supported",0);
    return parser.toObject(xhr);
  }

  function resourceToString(resource,contentType){
    var parser = XHRResultParser[contentType];
    if (parser == null) throw new RestfulieException("Content-Type: "+contentType+" is not supported",0);
    return parser.toString(resource);
  }

  XHRResultParser = {
    "application/json" : {
      toObject : function (xhr){
        var content = xhr.responseText;
        if (content == '') return {};
		    result = JSON.parse(content);             
        return result;
      },
      toString : function(resource){
        return JSON.stringify(resource);
      }   
    }
  }  

  function RestfulieException(msg,errCode){
    this.description = msg;
    this.err = errCode;
  }
   
})(Restfulie); 


