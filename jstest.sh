#!/bin/bash
cd client/restfulie

cd spec
ruby start_server.rb &
SINATRA=$!
cd ..

jspec run --server --browsers safari &
JSPEC_PID=$!
while [ ! -f finished ]; do
	sleep 1
done
kill $JSPEC_PID
kill $SINATRA
FAILS=`cat finished`
rm finished
echo $FAILS
exit $FAILS
