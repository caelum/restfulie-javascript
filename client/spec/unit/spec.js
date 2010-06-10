
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

  end
end
