cd poker-app-server
echo "BUILD POKER-APP-SERVER";
npm run-script build
ret = $?;
cd ..
exit $ret;