RVM_PATH="/home/hudson/.rvm/gems/ruby-1.8.7-head"
PATH="$RVM_PATH/bin:/home/hudson/.rvm/bin:$PATH"
RUBY_VERSION='ruby 1.8.7-head'
GEM_HOME="$RVM_PATH"
GEM_PATH="$RVM_PATH"
BUNDLE_PATH="$RVM_PATH"

gem install bundler
bundle install

git submodule init
git submodule update

cd server/rest_in_practice/part_3/
script/server & 
PID=$!

echo Server started

cd ../../../client
sleep 10
jspec run --rhino
echo $PID
kill -9 $PID
cd ..

