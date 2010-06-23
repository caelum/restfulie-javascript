require 'fakeweb'

FakeWeb.register_uri(:get, 'http://localhost:3000/items/one',
                      :body => '{"item":{"price":10.0,"name":"Calpis","created_at":"2010-04-20T14:19:25Z","updated_at":"2010-04-20T14:19:25Z","id":1}}',
                      :link => ' </items/two>; rel="two"');

FakeWeb.register_uri(:get, 'http://localhost:3000/items/two',
                      :body => '{"item":{"price":10.0,"name":"Calpis","created_at":"2010-04-20T14:19:25Z","updated_at":"2010-04-20T14:19:25Z","id":2}}',
                      :link => ' </items/two>; rel="two"');
