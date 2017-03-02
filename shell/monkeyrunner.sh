APK="apk/app.apk"

# This should come in when this script is called
PACKAGE=$1

# This should come in when this script is called
DELAY=$2

# This should come in when this script is called
EVENT_COUNT=$3

# Install the app on all connected devices
for SERIAL in $(adb devices | tail -n +2 | cut -sf 1);
do
  echo "*** Clearing data for device: " + $SERIAL;
  adb -s $SERIAL shell pm clear $PACKAGE

  echo "*** Installing application to device: " + $SERIAL;
  adb -s $SERIAL install -r $APK

  echo "*** Running MonkeyRunner on device: " + $SERIAL;
  adb -s $SERIAL shell monkey -p $PACKAGE --throttle $DELAY --monitor-native-crashes --ignore-crashes $EVENT_COUNT &
done
