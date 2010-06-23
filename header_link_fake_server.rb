require 'rubygems'
require 'fakeweb'

FakeWeb.register_uri(:get, 'http://restfulie.js/items/one',
                      :body => '{"item":{"price":10.0,"name":"Calpis","created_at":"2010-04-20T14:19:25Z","updated_at":"2010-04-20T14:19:25Z","id":1}}',
                      :status => ["200", "OK"],
                      :link => ' </items/two>; rel="two"', :content_type => 'application/json');

FakeWeb.register_uri(:get, 'http://restfulie.js/items/two',
                      :body => '{"item":{"price":10.0,"name":"Calpis","created_at":"2010-04-20T14:19:25Z","updated_at":"2010-04-20T14:19:25Z","id":2}}',
                      :status => ["200", "OK"],
                      :link => ' </items/one>; rel="one"', :content_type => 'application/json');
