
describe 'Restfulie for javascript'
  describe 'getting resources'
    it 'get resources at success'
    	r = Restfulie.at("http://localhost:3000/items").get();

      r.items[0].price.should.equal 10
      r.response.body.should.not.be_null
      r.response.code.should.equal 200      
    end

    it 'get resources at error'
      r = Restfulie.at("http://localhost:3000/notfound").get();
      r.response.code.should.equal 404
    end
    
    it 'support post resources and 201 redirect'
      r = Restfulie.at("http://localhost:3000/items/1").get();
      r.item.price = 20;
      result = Restfulie.at("http://localhost:3000/items").post(r);
      result.item.id.should.not.equal r.item.id
    end

    it 'Media type support through a registry'
     Restfulie.media_types.register("application/amf",{
      marshal : function(object){},
      unmarshal : function(request){}
     });
      Restfulie.media_types['application/amf'].should.not.be_null
    end
    
    it 'Support xml element retrieve'
var xml = '<?xml version="1.0" encoding="UTF-8"?><item><created-at type="datetime">2010-04-20T14:19:25Z</created-at><id type="integer">1</id><name>Calpis</name><price type="decimal">10.0</price><updated-at type="datetime">2010-04-20T14:19:25Z</updated-at></item>';
    json = $.xml2json(xml);
$.browser.msie.should.equal ""
json.should.equal ""

      r = Restfulie.at("http://localhost:3000/items/1").accepts("application/xml").get();
      r.price.should.equal 10
      r.response.body.should.not.be_null
      JSON.stringify(r).should.be_null
    end


  end
end
