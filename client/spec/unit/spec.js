
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
      r = Restfulie.at("http://localhost:3000/items").accepts("application/xml").get();
      r.items.item[0].price.should.equal 10
      r.response.body.should.not.be_null
      r.response.code.should.equal 200    
    end
    
    it 'Support xml posting'
      r = Restfulie.at("http://localhost:3000/items/1").accepts("application/xml").get();
      r.item.price.should.equal 10
      r.response.body.should.not.be_null
      r.response.code.should.equal 200  
      r.item.price = 500
      rn = Restfulie.at("http://localhost:3000/items").as("application/xml").post(r);
      rn.response.body.should.not.be_null
      rn.response.code.should.equal 200        
      rn.item.price.should.equal 500
    end

  end
end
