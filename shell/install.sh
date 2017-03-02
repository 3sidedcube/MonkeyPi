APK="apk/app.apk"

# This should come in when this script is called
PACKAGE=$1

# Uninstall the app on all connected devices
for SERIAL in $(adb devices | tail -n +2 | cut -sf 1);
do
  echo "*** Clearing data for device: " + $SERIAL;
  adb -s $SERIAL shell pm clear $PACKAGE

  echo "*** Uninstall the package if it already exists";
  adb -s $SERIAL uninstall $PACKAGE
done

# Install the app on all connected devices
for SERIAL in $(adb devices | tail -n +2 | cut -sf 1);
do
  echo "*** Installing application to device: " + $SERIAL;
  adb -s $SERIAL install -r $APK
done
