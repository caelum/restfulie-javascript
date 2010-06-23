
var Restfulie = {};

(function(restfulie){
  
  //Media type support through a registry
  restfulie.media_types =[];
  
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
      result = this.discoveryAndBuildLinks(result);             
      return result;
    },
    discoveryAndBuildLinks: function(resource){
      for (var part in resource){
          resource[part] = this.discoveryAndBuildLinks(resource[part]);    
      }

      if (resource.link == undefined) return resource;

      if (resource.link.length == undefined ){
        var link = resource.link;
        resource.link = new Array();
        resource.link[0] = link;
      }
      resource.links = new Array();
      for (var i=0;i<resource.link.length;i++){
        var rel = resource.link[i]["rel"],
          href = resource.link[i]["href"],
          accept = resource.link[i]["type"];

          var linkResource = Restfulie.at(href);

        if (accept != null) {
          linkResource.accepts(accept);
        } 
        resource.links[rel] = linkResource;
      } 
      delete resource.link;
      return resource;
    } 
  });

  // register marshaler for application/xml
  restfulie.media_types.register('application/xml',{
    marshal : function(object){
      return json2xml(object);
    },
    unmarshal : function(request){
      var content = request.responseText;
      if (content == '') return {};
		  result = xml2json(parseXml(content), "  ");
      result = JSON.parse(result);
      result = this.discoveryAndBuildLinks(result);
      return result;
    },
    discoveryAndBuildLinks: function(resource){
      for (var part in resource){
          resource[part] = this.discoveryAndBuildLinks(resource[part]);    
      }

      if (resource.link == undefined) return resource;

      if (resource.link.length == undefined ){
        var link = resource.link;
        resource.link = new Array();
        resource.link[0] = link;
      }
      resource.links = new Array();
      for (var i=0;i<resource.link.length;i++){
        var rel = resource.link[i]["@rel"],
          href = resource.link[i]["@href"],
          accept = resource.link[i]["@type"];

          var linkResource = Restfulie.at(href);

        if (accept != null) {
          linkResource.accepts(accept);
        } 
        resource.links[rel] = linkResource;
      } 
      delete resource.link;
      return resource;
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
      "Accept" : "",
      "Content-Type" : "application/xml"    
    }; 

    // Default accepts should add all known media types
    for (var format in Restfulie.media_types)
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
    this.request_a = function(method){
  		var xhr = AjaxRequest.ajax(method,this.uri,'',this.headers);
      return SerializeXHR.serialize(xhr);
  	}
    
    // send request get
    this.get = function(){
		return this.request_a("GET");
  	}
    
    // send request trace
    this.trace = function(){
		return this.request_a("TRACE");
  	}
    
    // send request head
    this.head = function(){
		return this.request_a("HEAD");
  	}

    // send request delete
    this._delete = function(){
      return this.request_a("DELETE");
    }
    
    // send request options
    this.options = function(){
		return this.request_a("OPTIONS");
  	}

	this.request_with_payload = function(method, representation) {
      var backup;
      var content;
      var xhr;      
      backup = representation.response;
      delete representation.response;      
      if((typeof representation) == "string") {
        content = representation;
      } else {
        var mediaType = restfulie.media_types.getMediaType(this.headers['Content-Type']);
        content = mediaType.marshal(representation);
      }
      representation.response = backup;
      xhr = AjaxRequest.ajax(method,this.uri,content,this.headers);
      return SerializeXHR.serialize(xhr,this);
	}
    
    //send request post
    this.post = function(representation){
		return this.request_with_payload("POST", representation);
    }

    //send request patch
    this.patch = function(representation){
		return this.request_with_payload("PATCH", representation);
    }

    //send request put
    this.put = function(representation){
		return this.request_with_payload("PUT", representation);
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

  function getHeaderLinkData(headerValue) {
    linkData = headerValue.split(';');
    linkProperties = { href: linkData[0].replace(/^\s+|\s+$/g,'').replace('<', '').replace('>', '')};
    for(x=1; x < linkData.length; x++)
    {
      linkProperty = linkData[x].split('=');
      linkProperties[linkProperty[0].replace(/^\s+|\s+$/g,'')] = linkProperty[1].replace(/^"/g, '');
    }

    link = {};
    link['href'] = linkProperties.href;
    link['rel'] = ( linkProperties.rel != undefined ) ? linkProperties.rel : linkProperties.href;

    return link;
  }

  function getResponseHeadersFrom(xhr) {
    headers = {links:{}};
    responseHeaders = xhr.getAllResponseHeaders().split("\n");
    for(idx in responseHeaders)
    {
      header = responseHeaders[idx].split(":")[0];
      value = xhr.getResponseHeader(header);
      isHeaderLink = header.toLowerCase() == 'link';
      if(isHeaderLink)
      {
        link = getHeaderLinkData(value);
        entryPoint = new EntryPoint(link.url).accepts(xhr.getResponseHeader('Content-Type').split(";")[0]);
        headers.links[link.rel] = entryPoint;
      }
      else
      {
        headers[header] = value.replace(/^\s+|\s+$/g,"");
      }
    }
    return headers;
  }
  
  // decorator object adicional info request
  function addResponseXHR(resource,xhr){
    resource.response = {};
    resource.response.body = xhr.responseText;
    resource.response.code = xhr.status;
    resource.response.headers = getResponseHeadersFrom(xhr);
    return resource;
  }  

  function RestfulieException(msg,errCode){
    this.description = msg;
    this.err = errCode;
  }
   
})(Restfulie); 
