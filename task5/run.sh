#! /usr/bin/bash
echo "Hello World"
cd ./api
dotnet watch run &
cd ..
cd ./Receive
dotnet watch run &
cd ..
cd ./batching
dotnet watch run &
echo "all apps running in bg"