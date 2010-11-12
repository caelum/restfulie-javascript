//Default link Builder, work with json and xml with the same behavior
var Links = { 
  build: function(resource){
    if (typeof(resource) != 'object') return resource;

    for (var attribute in resource){
      resource[attribute] = this.build(resource[attribute]);
    }

    if (!resource.link) return resource;

		//checking if the resource is an array or is a literal link, if it's literal transform it in an Array.
    if (!(resource.link instanceof Array)){
      var link = resource.link;
      resource.link = [];
      resource.link[0] = link;
    }

    resource.links = {};
    for (var linkName in resource.link){
			this._createRestfulieLinkOn(resource, linkName);
    }

    delete resource.link;
    return resource;
	},

  _createRestfulieLinkOn : function(resource, linkName){
    var rel = resource.link[linkName]["rel"],
    href = resource.link[linkName]["href"],
    accept = resource.link[linkName]["type"];

    var linkResource = Restfulie.at(href);

    if(accept) {
      linkResource.accepts(accept);
    }
    resource.links[rel] = linkResource;
  }
};

//Converters
var PlainConverter = {
  marshal : function(object){
    return object;
  },
  unmarshal : function(request){
    return request.responseText;
  }
};

var XmlConverter = {
  marshal : function(object){
    return json2xml(object);
  },
  unmarshal : function(request){
    var content = request.responseText;
    if (!content) return {};
    var json = xml2json(parseXml(content), "  ");
		return Links.build(JSON.parse(json));
  }
};

var JsonConverter = {
  marshal : function(object){
    return JSON.stringify(object);
  },
  unmarshal : function(request){
    var content = request.responseText;
    if (!content) return {};
    return Links.build(JSON.parse(content));
  }
};


//Converters Registry
var Converters = {
  // registry
  mediaTypes : {},

  register : function(name, converter) {
    this.mediaTypes[name] = converter
  },

  getMediaType : function(format){
    var converter = this.mediaTypes[format];  
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
