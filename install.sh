echo "*** MonkeyPi Install Begun ***";

echo "Updating system packages...";
pacman -Suy

echo "Installing Android Tools (ADB & Fastboot)...";
pacman -S android-tools

echo "Installing Git...";
pacman -S git

echo "Installing NodeJS and NPM...";
pacman -S nodejs npm

echo "Installing node project dependencies...";
npm install

echo "*** MonkeyPi Install Complete ***";
