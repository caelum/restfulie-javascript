var PlainConverter = {
  marshal : function(object){
    return object;
  },
  unmarshal : function(request){
    return request.responseText;
  },
  discoveryAndBuildLinks: function(resource){
    return resource;
  }
};

var XmlConverter = {
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
    if (resource == null) return resource;
    if (typeof(resource) != 'object') return resource;
    for (var idx in resource){
      resource[idx] = this.discoveryAndBuildLinks(resource[idx]);
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

      var linkResource = href;
      var linkResource = Restfulie.at(href);

      if (accept != null) {
        linkResource.accepts(accept);
      }
      resource.links[rel] = linkResource;
    }
    delete resource.link;
    return resource;
  }
};

var JsonConverter = {
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
    if (resource == null) return resource;
    if (typeof(resource) != 'object') return resource;
    for (var idx in resource){
      resource[idx] = this.discoveryAndBuildLinks(resource[idx]);
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

      var linkResource = href;
      var linkResource = Restfulie.at(href);

      if (accept != null) {
        linkResource.accepts(accept);
      }
      resource.links[rel] = linkResource;
    }
    delete resource.link;
    return resource;
  }
};

var Converters = {

	// registry
	mediaTypes = {};

	register : function(name, converter) {
		mediaTypes[name] = converter
	}
	
	getMediaType : function(format){
	  var converter = media_types[format];  
	  return converter || PlainConverter;
	}

}

Converters.register('application/json', JsonConverter);
Converters.register('text/json', JsonConverter);
Converters.register('json', JsonConverter);
Converters.register('application/xml', XmlConverter);
Converters.register('text/xml', XmlConverter);
Converters.register('xml', XmlConverter);
Converters.register('text/plain', PlainConverter);
