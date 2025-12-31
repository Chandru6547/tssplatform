#!/bin/bash

LANG=$1

cd /workspace || exit 1

case $LANG in
  c)
    gcc main.c -o main && ./main
    ;;
  cpp)
    g++ main.cpp -o main && ./main
    ;;
  python)
    python3 main.py
    ;;
  java)
    javac Main.java && java Main
    ;;
  *)
    echo "Unsupported language"
    ;;
esac
