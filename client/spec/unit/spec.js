function search (what) {
  var description = Restfulie.at("http://localhost:3000/products/opensearch.xml").accepts('application/opensearchdescription+xml').get().resource();
}

JSpec.describe('Restfulie for Javascript', function(){
  describe('when searching', function(){
    it('should be able to search', function(){
      var description = Restfulie.at("http://localhost:3000/products/opensearch.xml").accepts('application/opensearchdescription+xml').get().resource();
      //var items = description.use("application/atom+xml").search({searchTerms : "20", startPage : 1});
      //items.resource.entries.size.should.equal 2
    });
  });
});

