#!/bin/sh
# render.sh in.svg|html out.png W H  — Chromium 스크린샷 후 정확한 크기로 자름
CH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
$CH --headless --no-sandbox --disable-gpu --hide-scrollbars --default-background-color=00000000 --window-size=$3,$(($4+300)) --screenshot=/tmp/claude-0/-home-user-uno/4b84e692-a160-5ca1-b82d-08c3a48e5811/scratchpad/logo/_shot.png "file://$(realpath $1)" >/dev/null 2>&1
convert /tmp/claude-0/-home-user-uno/4b84e692-a160-5ca1-b82d-08c3a48e5811/scratchpad/logo/_shot.png -crop ${3}x${4}+0+0 +repage $2
