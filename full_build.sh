rvm gemset create restfulie-js
rvm gemset use restfulie-js
gem install bundler --no-ri --no-rdoc
bundle install

sh tests.sh