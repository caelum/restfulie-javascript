
describe 'Restfulie for javascript'
  describe 'core'
    it 'should unmarshall when response was successful' 
      r = Restfulie.at("http://localhost:3000/items").accepts('application/xml').get();
      r.items.item[0].price.should.equal 10
      r.response.body.should.not.be_null
      r.response.code.should.equal 200      
    end

    it 'should work with 4** error codes'
      r = Restfulie.at("http://localhost:3000/notfound").get();
      r.response.code.should.equal 404
    end
    
    it 'should follow 201 responses'
      r = Restfulie.at("http://localhost:3000/items/1").get();
      r.item.price = 20;
      result = Restfulie.at("http://localhost:3000/items").post(r);
      result.item.id.should.not.equal r.item.id
    end

    it 'should allow media type registration through a registry'
     type = {
      marshal : function(object){},
      unmarshal : function(request){}
     };
     Restfulie.media_types.register("application/amf",type);
      Restfulie.media_types['application/amf'].should.equal type
    end
    
    it 'should support xml retrieval'
      r = Restfulie.at("http://localhost:3000/items").accepts("application/xml").get();
      r.items.item[0].price.should.equal 10
      r.response.body.should.not.be_null
      r.response.code.should.equal 200    
    end
    
    it 'should support xml marshalling'
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
    
    it 'should post the content if its a string'
      rn = Restfulie.at("http://localhost:3000/items").as("application/xml").post("<item><name>Calpis</name><price>500</price></item>");
      rn.response.body.should.not.be_null
      rn.response.code.should.equal 200        
      rn.item.price.should.equal 500
    end
    
    it 'should add all known media types as default accepts'
      entryPoint = Restfulie.at("http://localhost:3000/items");
      entryPoint.headers['Accept'].indexOf("application/xml").should.not.equal -1 
      entryPoint.headers['Accept'].indexOf("application/json").should.not.equal -1 
    end

    it 'should allow the representation to follow those links'
      resource = Restfulie.at("http://localhost:3000/items").accepts("application/xml").get();
      itemForList = resource.items.item[0];
      itemForLink = itemForList.links["self"].get();
      itemForLink.item.id.should.equal itemForList.id
    end

    it 'Support link following for json'
      resource = Restfulie.at("http://localhost:3000/items").accepts("application/json").get();
      itemForList = resource.items[0];
      itemForLink = itemForList.links["self"].get();
      itemForLink.item.id.should.equal itemForList.id
    end

    it 'should follow header links'
      h_one = Restfulie.at("http://restfulie.js/items/one").accepts("application/json").get();
      h_two = h_one.response.headers.links['two'].get();
      h_two.item.id.should.equal 2
    end

  end

  describe 'Rest from scratch examples'
    describe 'Part 1'
      it 'should get items with default response format'
        h = Restfulie.at('http://localhost:3000/items').get();

        h.items.length.should.be_greater_than 0
        h.items[0].name.should.equal "Calpis"
        h.items[0].price.should.equal 10
      end

      it 'should get items when I request specific format, in this case json'
        h = Restfulie.at('http://localhost:3000/items').accepts("application/json").get();

        h.items.length.should.be_greater_than 0
        h.items[0].name.should.equal "Calpis"
        h.items[0].price.should.equal 10

        h.response.code.should.equal 200
        h.response.headers['Content-Type'].indexOf('application/json').should.equal 0
      end

      it 'should create an item using a xml representation of an item'
        xml = '<item><name>calpis_xml</name><price>3</price></item>';
        h = Restfulie.at("http://localhost:3000/items").as("application/xml").post(xml);
        h.item.price.should.equal 3
        h.item.name.should.equal 'calpis_xml'
      end

      it 'should create an item using a json representation of an item'
        json = {
          item: {
            name:'calpis_json',
            price:3
          }
        };
        h = Restfulie.at("http://localhost:3000/items").as("application/json").post(json);
        h.item.price.should.equal 3
        h.item.name.should.equal 'calpis_json'
      end
    end
  end
end

