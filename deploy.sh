#!/bin/bash

cd deployment
ant -f deploy.xml -lib jsch-0.1.50.jar
cd ..