var Restfulie = {};

(function(restfulie){

  // function for ajax request
  AjaxRequest = {
    ajax: function(method,uri,content,headers){
	  	return jQuery.ajax({
	  		beforeSend: function(xhrObj){
	  			for (var header in headers)
	  				xhrObj.setRequestHeader(header, headers[header]);
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
      "Accept" : "",
      "Content-Type" : "application/xml"    
    }; 

    // Default accepts should add all known media types
    for (var format in Converters.mediaTypes)
      if ("register getMediaType".indexOf(format)==-1)
        this.headers["Accept"] += (this.headers["Accept"]=='' ? '':', ') +format;


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
    this.requestAjax = function(method) {
      var xhr = AjaxRequest.ajax(method,this.uri,'',this.headers);
      return SerializeXHR.serialize(xhr);
    }
    
    // send request get
    this.get = function(){
      return this.requestAjax("GET");
  	}
    
    // send request trace
    this.trace = function(){
      return this.requestAjax("TRACE");
  	}
    
    // send request head
    this.head = function(){
      return this.requestAjax("HEAD");
  	}

    // send request delete
    this._delete = function(){
      return this.requestAjax("DELETE");
    }
    
    // send request options
    this.options = function(){
      return this.requestAjax("OPTIONS");
  	}

    this.requestWithPayload = function(method, representation) {
      var backup;
      var content;
      var xhr;      
      backup = representation.response;
      delete representation.response;      
      if((typeof representation) == "string") {
        content = representation;
      } else {
        var mediaType = Converters.getMediaType(this.headers['Content-Type']);
        content = mediaType.marshal(representation);
      }
      representation.response = backup;
      xhr = AjaxRequest.ajax(method,this.uri,content,this.headers);
      return SerializeXHR.serialize(xhr,this);
    }
    
    //send request post
    this.post = function(representation){
      return this.requestWithPayload("POST", representation);
    }

    //send request patch
    this.patch = function(representation){
      return this.requestWithPayload("PATCH", representation);
    }

    //send request put
    this.put = function(representation){
      return this.requestWithPayload("PUT", representation);
    }

  }    

  // interpret request response
  SerializeXHR = {
    serialize : function (xhr,entryPoint){
      var serializer = SerializerXHRResponse[xhr.status];
      if (!serializer) serializer = SerializerXHRResponse["default"];
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
	  var resource = {};
      return addResponseXHR(resource, xhr);   
    },
    "201" : function(xhr,entryPoint){
      var location = xhr.getResponseHeader("Location");
 		  var accept = entryPoint.headers['Accept'];
 		  return Restfulie.at(location).accepts(accept).get();
    }
  }

  function getResponseHeadersFrom(xhr) {
    headers = {};
    headerLinks = {};
    responseHeaders = xhr.getAllResponseHeaders().split("\n");
    for(headerName in responseHeaders){
      headerData = responseHeaders[headerName].split(':');
      header = headerData[0];
      value = headerData[1];
      if (header == 'Link'){
        linkData = value.split(";");
        url = linkData[0].trim().replace(/<|>/g, '');
        rel = linkData[1].split('=')[1].replace(/"+/g, '').trim();
        headerLinks[rel] = Restfulie.at(url).accepts(xhr.getResponseHeader("Content-Type").split(";")[0]);
      }else{
        if (value){
          headers[header] = value.trim();
        }
      }
    }
    headers['links'] = headerLinks;
    return headers;
  }
  
  // decorator object adicional info request
  function addResponseXHR(resource,xhr){
    resource.body = xhr.responseText;
    resource.code = xhr.status;
    resource.headers = getResponseHeadersFrom(xhr);
    resource.resource = function() {
	  var mediaType = Converters.getMediaType(xhr.getResponseHeader("Content-Type").split(";")[0]);
      return mediaType.unmarshal(xhr);
    }
    return resource;
  }  

  function RestfulieException(msg,errCode){
    this.description = msg;
    this.err = errCode;
  }
   
})(Restfulie);


if(!String.prototype.trim){
  String.prototype.trim = function(){
    this.replace(/^\s+|\s+$/g,'');
  }
}
