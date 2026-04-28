# Convert videos

```shell
ffmpeg -i input.mkv -c:v libx264 -crf 22 -preset slow -c:a copy output.mp4
```
