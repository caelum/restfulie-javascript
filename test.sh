git submodule init
git submodule update
base=`pwd`

jake
sleep 3
pid_proxyfier=0
pid_server=0
cp -fr $base/restfulie.js $base/proxyfier/public/javascripts


echo "turning server up"
cd $base/server/
rails server &
pid_server=$!
sleep 3

echo "turning proxyfier up"
cd $base/proxyfier/
rails server -p 3001 &
pid_proxyfier=$!
sleep 3


cd $base/proxyfier/public/
echo "Running jspec"
jspec run --rhino

if [[ $pid_proxyfier != 0 ]];then
  echo $pid_proxyfier
  kill -9 $pid_proxyfier
fi

if [[ $pid_server != 0 ]];then
  echo $pid_server
  kill -9 $pid_server
fi

cd $base
