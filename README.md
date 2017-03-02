# MonkeyPi

Test multiple Android devices simultaneously with random user input through a website hosted on a Raspberry Pi.

# Features

1. Performs random user input on the device(s)

2. Provides inputs to *all available devices* simultaneously

3. Website allows the use of [`MonkeyRunner`](https://developer.android.com/studio/test/monkey.html) without requiring any technical knowledge

# Prerequisites

1. [`Arch Linux ARM`](https://archlinuxarm.org/) installed and running on your Raspberry Pi.
    * [Guide for Raspberry Pi 1](https://archlinuxarm.org/platforms/armv6/raspberry-pi)
    * [Guide for Raspberry Pi 2](https://archlinuxarm.org/platforms/armv7/broadcom/raspberry-pi-2)
    * [Guide for Raspberry Pi 3](https://archlinuxarm.org/platforms/armv8/broadcom/raspberry-pi-3)

*Please note: Only Raspberry Pi 2 has been confirmed as working. If you have issues running MonkeyPi on other Raspberry Pi models [create an issue](https://github.com/JamieCruwys/MonkeyPi/issues).*

### Why Arch Linux?

MonkeyPi requires [`Android Debug Bridge (ADB)`](https://developer.android.com/studio/command-line/adb.html) to work. When running [`Raspbian`](https://www.raspbian.org/), the [Debian packages for ADB](https://packages.debian.org/jessie/android-tools-adb) do not support `arm` or are unable to detect connected devices. Arch Linux ARM on the other hand, has packages for [ARM6](https://archlinuxarm.org/packages/armv6h/android-tools) and  [ARM7](https://archlinuxarm.org/packages/armv7h/android-tools) that work as intended.

# Setup

1. Make `install.sh` & `run.sh` executable with:
```
sudo chmod +x install.sh
sudo chmod +x run.sh
```

2. Run `install.sh` to install all of the projects dependencies. Agree to package installations.

3. Plug in Android devices to the Raspberry Pi using USB cables.

4. For each device - [enable developer mode, USB debugging and grant USB debugging permissions](https://developer.android.com/studio/run/device.html) so that the Raspberry Pi can send commands to the device. You can run `adb devices` to see a list of connected devices.

# Usage

1. Run `run.sh` to start the MonkeyPi server.

2. Go to  [`http://alarmpi:3000`](http://alarmpi:3000) in your browser and begin installing and testing your Android application on connected devices.

3. Log files are created in the `logs` folder and are named using timestamps.
    * You shouldn't need to check the logs for crash reports if you have crash reporting included in your Android application.
