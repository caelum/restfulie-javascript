git submodule init
git submodule update 

cd server/rest_in_practice/part_3/

server=$(curl http://localhost:3000/items.json -I -s | grep '200 OK')
#server down
PID=0
if [[ $server == '' ]]; then
  echo "turning server up"
  ruby script/server & 
  PID=$!
  sleep 10
else
  echo "server already up"
fi

cd ../../../client
jspec run --rhino

if [[ $PID != 0 ]];then
  echo $PID
  kill -9 $PID
fi

cd ..
