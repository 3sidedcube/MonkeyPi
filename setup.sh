echo "Installing dependencies...";
for file in setup/*.sh;
   do sh "$file";
done;
echo "Finished installing dependencies";
