APK="./apk/app.apk"

# This should come in when this script is called
PACKAGE="com.cube.gdpc.rfb"

# This should come in when this script is called
DELAY="250"

# This should come in when this script is called
EVENT_COUNT="2000"

# Install the app on all connected devices
for SERIAL in $(adb devices | tail -n +2 | cut -sf 1);
do
  adb -s $SERIAL shell pm clear $PACKAGE
  adb -s $SERIAL install -r $APK
done

# Test using monkey runner on all connected devices
for SERIAL in $(adb devices | tail -n +2 | cut -sf 1);
do
  adb -s $SERIAL shell monkey -p $PACKAGE --throttle $DELAY --monitor-native-crashes $EVENT_COUNT &
done
