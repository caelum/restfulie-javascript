
if [ ! -z "$BROWSER" ]
then
  mybrowser="$BROWSER"
else
  mybrowser="$(which firefox || which opera || which arora)"
fi
PID=0
ruby server.rb &
PID=$!
echo $PID
sleep 10
echo "server already up"
echo "open browser in http://localhost:4567/www/index.html"

$mybrowser "http://localhost:4567/www/index.html"

echo "press any key to shutdown this server..."

read "key"

kill -9 $PID
echo "server is shutdown."



