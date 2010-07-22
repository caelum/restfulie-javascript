#!/usr/bin/env ruby

require 'rubygems'
require 'sinatra'
require 'net/http'
require 'uri'


def load_properties(properties_filename)
  properties = {}
  File.open(properties_filename, 'r') do |properties_file|
    properties_file.read.each_line do |line|
      line.strip!
      if (line[0] != ?# and line[0] != ?=)
        i = line.index('=')
        if (i)
          properties[line[0..i - 1].strip] = line[i + 1..-1].strip
        else
          properties[line] = ''
        end
      end
    end      
  end
  properties
end


proxy = load_properties("../proxy.properties")

proxy_addr = proxy['proxy_host']
proxy_port = proxy['proxy_port']
proxy_user = proxy['proxy_user']
proxy_pass = proxy['proxy_pass']

get '/proxy/http/*' do |path|
  opath = path.gsub('/proxy/http/','')
  opath = "http://"+opath
  url = URI.parse(opath)
  req = Net::HTTP::Get.new(url.path)
  res = Net::HTTP::Proxy(proxy_addr, proxy_port,proxy_user,proxy_pass).start(url.host, url.port) {|http|
    headers.each {|key,value| req[key] = value}
    http.request(req)
  }
  
  res.each {|key,value| headers[key]=value}
  status res.code
  res.body
end

post '/proxy/http/*' do |path|
  opath = path.gsub('/proxy/http/','')
  opath = "http://"+opath
  url = URI.parse(opath)
  req = Net::HTTP::Post.new(url.path)
  request.set_form_data(params)
  res = Net::HTTP::Proxy(proxy_addr, proxy_port,proxy_user,proxy_pass).start(url.host, url.port) {|http|
    headers.each {|key,value| req[key] = value}
    http.request(req)
  }
  status res.code
  res.body
end

get '/www/*' do |path|
  send_file File.dirname(__FILE__) +"/www/"+  path
end








