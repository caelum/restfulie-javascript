Proxyfier::Application.routes.draw do
  root :controller => :proxy, :action => :index
  
  match "proxy/opensearch/:type" => "proxy#opensearch"
end
