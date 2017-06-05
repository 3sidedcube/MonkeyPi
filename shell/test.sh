APK="apk/app.apk"

# This should come in when this script is called
PACKAGE=$1

# This should come in when this script is called
DELAY=$2

# This should come in when this script is called
EVENT_COUNT=$3

for SERIAL in $(adb devices | tail -n +2 | cut -sf 1);
do
  echo "*** Running MonkeyRunner on device: " + $SERIAL;
  adb -s $SERIAL shell monkey -p $PACKAGE -v3 --pct-touch 34 --pct-motion 0 --pct-pinchzoom 0 --pct-trackball 0 --pct-rotation 0 --pct-nav 33 --pct-majornav 33 --pct-syskeys 0 --pct-appswitch 0 --pct-flip 0 --pct-anyevent 0 --throttle $DELAY --monitor-native-crashes --ignore-crashes $EVENT_COUNT &
done
