describe 'Restfulie'
  describe 'client services'
    it 'get resource at success'
    	x = Restfulie.at("basket.json").accepts('application/json').get();
    	x.price.should.equal 40
    	x.response.body.should.not.be_null
    	x.response.code.should.equal 200
    end
    
    it 'get resource at with error'
    	x = Restfulie.at("error").get();
    	x.should.not.be_null
    	x.toString().should.equal x.response.body
    	x.response.code.should.not.equal 200
    end
    
    it 'post resource'
    	x = Restfulie.at("atualiza").as("application/json").post({"id":1});
    	x.toString().should.not.be_null;
    end
    
    it 'support follow 201 response'
    	x = Restfulie.at("basket.json").post({'data':2});
    	x.id.should.equal(4);
		x.response.code.should.equal 200     	
    end
    
  end
end

 
describe 'Result Serializers'
	describe 'JSON Serializer'
	 	before_each  
	 		parser = new SerializeResultJson();
	 	end 
	
		it 'accept should be application/json'
			parser.accept('application/json').should.be_true;
		end 
		
		it 'convert text format json in object'
			r  = parser.unparse('{"price":40}');
			r.price.should.equal 40
		end
		
		it 'convert object in json'
			var r = new Object();
			r.price = 40;
			result = parser.parse(r);
			result.should.equal('{"price":40}');
		end
	end
end

describe 'XHR Serializer'
	describe 'DefaultXHRSerializer'
		
		before_each
			serializer = new DefaultXHRSerializer();
		end
		
		it 'default return result'
			result = serializer.serialize({responseText:'body',status:404},null);
			result.toString().should.equal('body');
			result.response.body.should.equal(result.toString());
			result.response.code.should.equal(404);
		end
	end
end

	