cd poker-app-client
echo "BUILD POKER-APP-CLIENT";
npm run-script build
ret = $?;
cd ..
exit $ret;