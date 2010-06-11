
var Restfulie = {};

(function(restfulie){
  
  //Media type support through a registry
  restfulie.media_types = [];
  
  restfulie.media_types['register'] = function(format,media){
    restfulie.media_types[format] = media;  
  };
  
  restfulie.media_types['getMediaType'] = function(format){
    var mediaType = restfulie.media_types[format];  
    if (mediaType == null) throw new RestfulieException("media type not supported: "+format,0);
    return mediaType;
  }
  
  // register marshaler for application/json
  restfulie.media_types.register('application/json',{
    marshal : function(object){
      return JSON.stringify(object);
    },
    unmarshal : function(request){
      var content = request.responseText;
      if (content == '') return {};
		  result = JSON.parse(content);             
      return result;
    }  
  });

   
     

  // function for ajax request
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

  
  // entry point restfulie
  restfulie.at = function(uri){
    return new EntryPoint(uri);
  }; 
  
  

  // restfulie class entry point 
  function EntryPoint(uri){
    this.uri = uri;

    this.headers = {
      "Accept" : "application/json",
      "Content-Type" : "application/json"    
    };

    // configure accept
    this.accepts = function(accept){
  		this.headers["Accept"] = accept;
  		return this;
  	}
  	// configure content-Type 
  	this.as = function(contentType){
  		this.headers["Content-Type"] = contentType;
  		return this;
  	}
    
    // send request get
    this.get = function(){
  		var xhr = AjaxRequest.ajax("GET",this.uri,'',this.headers);
      return SerializeXHR.serialize(xhr);
  	}
    
    //send request post
    this.post = function(resource){
      var backup;
      var content;
      var xhr;      
      backup = resource.response;
      delete resource.response;      
      var mediaType = restfulie.media_types.getMediaType(this.headers['Content-Type']);
      content = mediaType.marshal(resource);
      resource.response = backup;
  		xhr = AjaxRequest.ajax("POST",this.uri,content,this.headers);
      return SerializeXHR.serialize(xhr,this);
    }

  }    

  // interpret request response
  SerializeXHR = {
    serialize : function (xhr,entryPoint){
      var serializer = SerializerXHRResponse[xhr.status];
      if (serializer == null) serializer = SerializerXHRResponse["default"];
      return serializer(xhr,entryPoint);
    }
  }

  // interpret request response for status code
  SerializerXHRResponse = {
    "default" : function(xhr,entryPoint){
      var resource = {};
      return addResponseXHR(resource,xhr);
    },
    "200" : function(xhr,entryPoint){
      var mediaType = restfulie.media_types.getMediaType(xhr.getResponseHeader("Content-Type").split(";")[0]);
      return addResponseXHR(mediaType.unmarshal(xhr),xhr);   
    },
    "201" : function(xhr,entryPoint){
      var location = xhr.getResponseHeader("Location");
 		  var accept = entryPoint.headers['Accept'];
 		  return Restfulie.at(location).accepts(accept).get();
    }
  }
  
  // decorator object adicional info request
  function addResponseXHR(resource,xhr){
    resource.response = {};
    resource.response.body = xhr.responseText;
    resource.response.code = xhr.status;
    return resource;
  }  

  function RestfulieException(msg,errCode){
    this.description = msg;
    this.err = errCode;
  }
   
})(Restfulie); 


