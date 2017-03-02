APK="apk/app.apk"

# This should come in when this script is called
PACKAGE=$1

# This should come in when this script is called
DELAY=$2

# This should come in when this script is called
EVENT_COUNT=$3

# Test all the app on all connected devices
for SERIAL in $(adb devices | tail -n +2 | cut -sf 1);
do
  echo "*** Running MonkeyRunner on device: " + $SERIAL;
  adb -s $SERIAL shell monkey -p $PACKAGE --throttle $DELAY --monitor-native-crashes --ignore-crashes $EVENT_COUNT &
done
