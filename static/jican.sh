#!/bin/bash
export DISPLAY=:0
pactl set-sink-mute 0 0
mkdir -p /tmp/linuxdeepin-tmp/ && wget -O /tmp/linuxdeepin-tmp/login.m4a https://api.lyoi.ac/say\?text\=fa+fa+fa+fa+fa+fa+fa+fa+fa+fa+fa+fa+fa+fa+fa+fa+fa+fa+fa+fa+fa+fa+fa+fa+fa+fa\&voice\=Cellos && mplayer /tmp/linuxdeepin-tmp/login.m4a
sleep 1
