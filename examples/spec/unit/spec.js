
describe 'Restfulie-javascript examples'
  describe 'accessing the Twitter API'
    it 'should recover public_timeline'
      timeline = Restfulie.at("http://api.twitter.com/1/statuses/public_timeline.xml").get();
      timeline.response.body.should.not.equal ""
      timeline.response.code.should.equal 200      
      timeline.statuses.status[0].id.should.not.equal 0
      timeline.statuses.status[0].text.should.not.equal ''
    end
  end
end
