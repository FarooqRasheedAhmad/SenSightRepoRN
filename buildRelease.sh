echo "Making a Clean/Fresh build release"

# cd ./android && ./gradlew clean && ./gradlew app:assembleRelease --variant=release && cd ..
# echo -p "Success: Please check your device now.. \n" -t 1

cd ./android && ./gradlew clean && ./gradlew app:assembleRelease && cd ..

echo -p "Build Complete \n" -t 1

# echo -p "Pushing on device \n" -t 1
# npx react-native run-android --variant=release
# echo -p "Success: Please check your device now.. \n" -t 1



# yarn android --variant=release

# cd ./android && ./gradlew assembleRelease && cd ..

# cd ./android && ./gradlew app:assembleRelease



