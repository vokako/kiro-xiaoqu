#!/usr/bin/env bash
# Put the fonts the MV and the cover need into mv/fonts/.
#   - Kiro's own site fonts from kiro.dev: AWS Diatype, AWS Diatype Rounded (Semi-Mono), Fragment Mono.
#     AWS Diatype is Dinamo's typeface licensed to AWS; it is not part of this repository. Fetch it only if your use is
#     covered by that licence. Fragment Mono is SIL OFL 1.1.
#   - Resource Han Rounded CN, Maple Mono CN and Noto Sans SC from their own releases (SIL OFL 1.1).
set -euo pipefail
cd "$(dirname "$0")/../mv/fonts"
for f in AWSDiatype-Regular AWSDiatype-Bold AWSDiatypeRounded-Bold AWSDiatypeRoundedSemi-Mono-Regular AWSDiatypeRoundedSemi-Mono-Bold FragmentMono-Regular FragmentMono-Italic; do
  [ -f "$f.woff2" ] || curl -fsSL "https://kiro.dev/styles/fonts/$f.woff2" -o "$f.woff2"
done
tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
if [ ! -f ResourceHanRoundedCN-Heavy.ttf ]; then
  curl -fsSL https://github.com/CyanoHao/Resource-Han-Rounded/releases/download/v0.990/RHR-CN-0.990.7z -o "$tmp/rhr.7z"
  rhr="ResourceHanRoundedCN-Light.ttf ResourceHanRoundedCN-Bold.ttf ResourceHanRoundedCN-Heavy.ttf"
  if command -v 7z >/dev/null; then 7z e -y -o. "$tmp/rhr.7z" $rhr >/dev/null
  else python3 -c "import sys, py7zr; py7zr.SevenZipFile(sys.argv[1]).extract(path='.', targets=sys.argv[2:])" "$tmp/rhr.7z" $rhr; fi   # needs 7z or: pip install py7zr
fi
if [ ! -f MapleMono-CN-Bold.ttf ]; then
  curl -fsSL https://github.com/subframe7536/maple-font/releases/download/v7.9/MapleMono-CN.zip -o "$tmp/maple.zip"
  unzip -o -q -j "$tmp/maple.zip" MapleMono-CN-Regular.ttf MapleMono-CN-Bold.ttf -d .
fi
[ -f NotoSansSC-VF.ttf ] || curl -fsSL "https://github.com/google/fonts/raw/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf" -o NotoSansSC-VF.ttf
ls -l
