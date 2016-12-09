#!/bin/sh
#./ginscope/0.selfSign.cert.sh
mkdir -p ssl
openssl req -subj "/CN=neris.io/O=FUND ME!/C=GB/OU=ginscope" -new -newkey rsa:2048 -sha256 -days 3650 -nodes -x509 -keyout ssl/ginscope.key -out ssl/ginscope.crt
