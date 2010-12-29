JSpec.describe('Restfulie for Javascript', function(){
  describe('when searching', function(){
    it('should be able to search', function(){
      var description = Restfulie.at("http://localhost:3001/proxy/opensearch/xml").accepts('application/opensearchdescription+xml').get();
      var items = description.use("application/atom+xml").search({searchTerms : "20", startPage : 1});
      expect(function(){ items.resource.entries }).to(equal, 2, 'LOL');
    });
  });
});

