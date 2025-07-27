import Hls from 'hls.js'; // ← make sure to install it

useEffect(() => {
  const video = videoRef.current;
  if (!video) return;

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(hlsUrl);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play();
      setIsPlaying(true);
    });

    return () => {
      hls.destroy();
    };
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = hlsUrl;
    video.addEventListener('loadedmetadata', () => {
      video.play();
      setIsPlaying(true);
    });
  }
}, [hlsUrl]);
