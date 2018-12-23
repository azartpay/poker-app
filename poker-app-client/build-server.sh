cd poker-app-server
echo "BUILD POKER-APP-SERVER";
npm build
ret = $?;
cd ..
exit ret;