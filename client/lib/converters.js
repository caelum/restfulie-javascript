var PlainConverter = {
  marshal : function(object){
    return object;
  },
  unmarshal : function(request){
    return request.responseText;
  },
  findAndBuildLinks: function(resource){
    return resource;
  }
};

var XmlConverter = {
  marshal : function(object){
    return json2xml(object);
  },
  unmarshal : function(request){
    var content = request.responseText;
    if (!content) return {};
    json = xml2json(parseXml(content), "  ");
		return this.findAndBuildLinks(JSON.parse(json));
  },
  findAndBuildLinks: function(resource){
    if (typeof(resource) != 'object') return resource;

    for (var attribute in resource){
      resource[attribute] = this.findAndBuildLinks(resource[attribute]);
    }

    if (!resource.link) return resource;

		//checking if the resource is an array or is a literal link, if it's literal transform it in an Array.
    if (!(resource.link instanceof Array)){
      var link = resource.link;
      resource.link = [];
      resource.link[0] = link;
    }

    resource.links = {};
    for (i in resource.link){
			createRestfulieLinkOn(resource)
    }

    delete resource.link;
    return resource;
  }
};

var createRestfulieLinkOn = function(resource){
	var rel = resource.link[i]["rel"],
  href = resource.link[i]["href"],
  accept = resource.link[i]["type"];

  var linkResource = Restfulie.at(href);

  if(accept) {
    linkResource.accepts(accept);
  }
  resource.links[rel] = linkResource;
};

var JsonConverter = {
  marshal : function(object){
    return JSON.stringify(object);
  },
  unmarshal : function(request){
    var content = request.responseText;
    if (!content) return {};
    result = JSON.parse(content);
    result = this.findAndBuildLinks(result);             
    return result;
  },

  findAndBuildLinks: function(resource){
    if (!resource) return resource;
    if (typeof(resource) != 'object') return resource;
    for (var attribute in resource){
      resource[attribute] = this.findAndBuildLinks(resource[attribute]);
    }
    if (!resource.link) return resource;

    if (!resource.link.length){
      var link = resource.link;
      resource.link = [];
      resource.link[0] = link;
    }
    resource.links = [];
    for (var i=0;i<resource.link.length;i++){
      var rel = resource.link[i]["rel"],
      href = resource.link[i]["href"],
      accept = resource.link[i]["type"];

      var linkResource = href;
      var linkResource = Restfulie.at(href);

      if (!accept) {
        linkResource.accepts(accept);
      }
      resource.links[rel] = linkResource;
    }
    delete resource.link;
    return resource;
  }
};
	mediaTypes = {}
var Converters = {
  // registry
  mediaTypes : {},

  register : function(name, converter) {
    mediaTypes[name] = converter
  },

  getMediaType : function(format){
    var converter = mediaTypes[format];  
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
