git submodule init
git submodule update

cd server/rest_in_practice/part_3/
ruby script/server & 
PID=$!
cd ../../../client
sleep 10
jspec run --rhino
echo $PID
kill -9 $PID
cd ..
