cd poker-app-client
echo "BUILD POKER-APP-CLIENT";
npm build
ret = $?;
cd ..
exit ret;