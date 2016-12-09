#!/bin/sh
cd html && ../node_modules/http-server/bin/http-server \
  -p 8080 \
  -a 0.0.0.0 \
  --ssl --key ../ssl/ginscope.key --cert ../ssl/ginscope.crt --cors
cd ../
