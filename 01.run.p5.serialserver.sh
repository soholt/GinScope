#!/bin/sh
echo 'starting serial server in insecure mode'
echo 'todo: wss'
cd node_modules/p5.serialserver && node startserver.js
cd ../../
