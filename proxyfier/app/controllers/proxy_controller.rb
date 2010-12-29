class ProxyController < ApplicationController
  respond_to :atom, :html, :xml, :commerce, :opensearch, :json

  def index

  end

  def opensearch
    body = Restfulie.at("http://localhost:3000/products/opensearch.#{params[:type]}").accepts('application/opensearchdescription+xml').get.body
    render :content_type => "application/opensearchdescription+xml" , :text => body
  end

end
