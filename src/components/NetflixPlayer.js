import React, { useEffect, useRef, useState, useCallback } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings, 
  SkipBack, 
  SkipForward,
  Subtitles,
  Languages,
  RotateCcw
} from "lucide-react";

const NetflixPlayer = () => {
  const id = "603692";
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const progressBarRef = useRef(null);
  const adaptiveTimeoutRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Enhanced quality states
  const [currentQuality, setCurrentQuality] = useState('auto');
  const [actualQuality, setActualQuality] = useState('1080p');
  const [maxQuality, setMaxQuality] = useState('1080p');
  const [audioTracks, setAudioTracks] = useState([]);
  const [currentAudioTrack, setCurrentAudioTrack] = useState(0);
  const [subtitleTracks, setSubtitleTracks] = useState([]);
  const [currentSubtitleTrack, setCurrentSubtitleTrack] = useState(-1);
  const [networkCondition, setNetworkCondition] = useState('good');
  const [bufferHealth, setBufferHealth] = useState(0);
  const [availableLevels, setAvailableLevels] = useState([]);

  // Define available qualities and their URLs
  const qualityOptions = [
    { label: 'Auto', value: 'auto', height: 'adaptive' },
    { label: '1080p', value: '1080p', height: 1080 },
    { label: '720p', value: '720p', height: 720 },
    { label: '480p', value: '480p', height: 480 }
  ];

  const getMasterPlaylistUrl = () => {
    return `https://r2-video-worker.ayush201.workers.dev/testvideo/master.m3u8`;
  };

  const getVideoUrl = (quality) => {
    if (quality === 'auto') {
      return getMasterPlaylistUrl();
    }
    return `https://r2-video-worker.ayush201.workers.dev/testvideo/${quality}.m3u8`;
  };

  // Load HLS.js dynamically
  const loadHlsJs = async () => {
    if (window.Hls) return window.Hls;

    try {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.4.12/hls.min.js';
      script.async = true;
      
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      return window.Hls;
    } catch (error) {
      throw new Error('Failed to load HLS.js');
    }
  };

  // Helper function to find the appropriate level index based on quality
  const findLevelByQuality = useCallback((levels, targetQuality) => {
    if (!levels || levels.length === 0) return -1;
    
    // Sort levels by height in descending order
    const sortedLevels = levels.map((level, index) => ({ ...level, originalIndex: index }))
      .sort((a, b) => (b.height || 0) - (a.height || 0));
    
    switch (targetQuality) {
      case '1080p':
        // Find the highest quality level >= 1080p
        return sortedLevels.find(level => (level.height || 0) >= 1080)?.originalIndex ?? 
               sortedLevels[0]?.originalIndex ?? -1;
      case '720p':
        // Find level closest to 720p
        return sortedLevels.find(level => (level.height || 0) >= 720 && (level.height || 0) < 1080)?.originalIndex ??
               sortedLevels.find(level => (level.height || 0) >= 720)?.originalIndex ??
               sortedLevels[0]?.originalIndex ?? -1;
      case '480p':
        // Find level closest to 480p
        return sortedLevels.find(level => (level.height || 0) >= 480 && (level.height || 0) < 720)?.originalIndex ??
               sortedLevels.find(level => (level.height || 0) >= 480)?.originalIndex ??
               sortedLevels[sortedLevels.length - 1]?.originalIndex ?? -1;
      default:
        return -1; // Auto mode
    }
  }, []);

  // Monitor network conditions and buffer health
  const monitorNetworkConditions = useCallback(() => {
    const video = videoRef.current;
    const hls = hlsRef.current;
    
    if (!video || !hls) return;

    // Check buffer health
    const buffered = video.buffered;
    if (buffered.length > 0) {
      const bufferEnd = buffered.end(buffered.length - 1);
      const bufferAhead = bufferEnd - video.currentTime;
      setBufferHealth(bufferAhead);

      // Network condition assessment based on buffer health and quality switches
      if (bufferAhead < 5) {
        setNetworkCondition('poor');
      } else if (bufferAhead < 15) {
        setNetworkCondition('medium');
      } else {
        setNetworkCondition('good');
      }
    }

    // Track current playing quality
    if (hls.levels && hls.currentLevel >= 0) {
      const currentLevel = hls.levels[hls.currentLevel];
      if (currentLevel) {
        if (currentLevel.height >= 1080) {
          setActualQuality('1080p');
        } else if (currentLevel.height >= 720) {
          setActualQuality('720p');
        } else {
          setActualQuality('480p');
        }
      }
    }
  }, []);

  // Enhanced HLS configuration for adaptive streaming
  const getHlsConfig = (quality) => {
    const baseConfig = {
      enableWorker: true,
      lowLatencyMode: false,
      backBufferLength: 30,
      maxBufferLength: 60,
      maxMaxBufferLength: 120,
      maxBufferHole: 0.1,
      maxBufferSize: 60 * 1000 * 1000, // 60MB
      maxLoadingDelay: 4,
      startLevel: -1, // Let HLS.js choose initial level
      testBandwidth: true,
      debug: false
    };

    if (quality === 'auto') {
      return {
        ...baseConfig,
        startLevel: -1, // Auto start level
        capLevelToPlayerSize: true,
        capLevelOnFPSDrop: true
      };
    } else {
      return {
        ...baseConfig,
        startLevel: -1, // We'll set this after manifest is parsed
        capLevelToPlayerSize: false,
        capLevelOnFPSDrop: false
      };
    }
  };

  // Initialize HLS player with adaptive streaming
  const initializeVideo = useCallback(async (quality, resumeTime = 0) => {
    const video = videoRef.current;
    const videoSrc = getVideoUrl(quality);

    if (!video) return;

    const wasPlaying = !video.paused;
    
    // Clean up existing HLS instance
    if (hlsRef.current?.destroy) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (video.canPlayType('application/vnd.apple.mpegurl') && quality !== 'auto') {
        // Safari native HLS support (limited adaptive capabilities)
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', () => {
          if (resumeTime > 0) {
            video.currentTime = resumeTime;
          }
          if (wasPlaying) {
            video.play();
          }
          setIsLoading(false);
        }, { once: true });
        return;
      }

      const Hls = await loadHlsJs();
      
      if (Hls && Hls.isSupported()) {
        const config = getHlsConfig(quality);
        const hls = new Hls(config);
        
        hlsRef.current = hls;

        // Enhanced event handling for adaptive streaming
        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          console.log('Available levels:', data.levels);
          setAvailableLevels(data.levels);
          
          // Set quality constraint if manual quality is selected
          if (quality !== 'auto') {
            const targetLevelIndex = findLevelByQuality(data.levels, quality);
            console.log(`Setting quality ${quality} to level index ${targetLevelIndex}`);
            
            if (targetLevelIndex >= 0 && targetLevelIndex < data.levels.length) {
              // Force to specific quality level - use loadLevel and currentLevel
              hls.loadLevel = targetLevelIndex;
              hls.currentLevel = targetLevelIndex;
              
              // Set autoLevelCapping to limit quality switching
              if (typeof hls.autoLevelCapping !== 'undefined') {
                hls.autoLevelCapping = targetLevelIndex;
              }
            } else {
              console.warn(`Invalid level index ${targetLevelIndex} for quality ${quality}`);
              // Fallback to auto if we can't find the requested quality
              hls.currentLevel = -1; // Auto
            }
          } else {
            // Enable automatic level switching for auto quality
            hls.currentLevel = -1; // Auto
            
            // Remove any capping for auto mode
            if (typeof hls.autoLevelCapping !== 'undefined') {
              hls.autoLevelCapping = -1;
            }
          }

          if (resumeTime > 0) {
            video.currentTime = resumeTime;
          }
          if (wasPlaying) {
            video.play();
          }
          setIsLoading(false);
        });

        hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
          const level = hls.levels[data.level];
          console.log('Level switched to:', data.level, level);
          if (level) {
            if (level.height >= 1080) {
              setActualQuality('1080p');
            } else if (level.height >= 720) {
              setActualQuality('720p');
            } else {
              setActualQuality('480p');
            }
          }
        });

        hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (event, data) => {
          setAudioTracks(data.audioTracks);
        });

        hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, (event, data) => {
          setCurrentAudioTrack(data.id);
        });

        hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (event, data) => {
          setSubtitleTracks(data.subtitleTracks);
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                setError('Network error - please check your connection');
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                setError('Media error - trying to recover...');
                hls.recoverMediaError();
                break;
              default:
                setError(`Failed to load ${quality} quality`);
                break;
            }
            setIsLoading(false);
          }
        });

        // Buffer monitoring for network conditions
        hls.on(Hls.Events.BUFFER_APPENDED, monitorNetworkConditions);
        hls.on(Hls.Events.BUFFER_EOS, monitorNetworkConditions);

        hls.loadSource(videoSrc);
        hls.attachMedia(video);

      } else {
        setError("HLS not supported in this browser");
        setIsLoading(false);
      }
    } catch (error) {
      setError(`Failed to load ${quality} quality`);
      setIsLoading(false);
    }
  }, [monitorNetworkConditions, findLevelByQuality]);

  // Initialize video on component mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    initializeVideo(currentQuality);

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      monitorNetworkConditions();
    };
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const handleLoadedMetadata = () => setIsLoading(false);

    // Disable video context menu and controls
    const handleContextMenu = (e) => e.preventDefault();
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('contextmenu', handleContextMenu);

    // Disable video controls
    video.controls = false;
    video.controlsList = 'nodownload nofullscreen noremoteplaybook';
    video.disablePictureInPicture = true;

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('contextmenu', handleContextMenu);
      
      if (hlsRef.current?.destroy) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentQuality, initializeVideo, monitorNetworkConditions]);

  // Enhanced controls auto-hide with mouse movement detection
  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      if (isPlaying && !showSettings) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    if (showControls) {
      resetControlsTimeout();
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, showControls, showSettings]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyPress = (e) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        skipTime(-10);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        skipTime(10);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        handleVolumeChange(Math.min(1, volume + 0.1));
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        handleVolumeChange(Math.max(0, volume - 0.1));
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [volume]);

  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  }, [isPlaying]);

  const handleSeek = useCallback((e) => {
    const video = videoRef.current;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * duration;
  }, [duration]);

  const handleVolumeChange = useCallback((newVolume) => {
    const video = videoRef.current;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (isMuted) {
      video.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!document.fullscreenElement) {
      await container.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  const skipTime = useCallback((seconds) => {
    const video = videoRef.current;
    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, duration));
  }, [duration]);

  // Enhanced quality change with proper level mapping
  const changeQuality = useCallback((newQuality) => {
    if (newQuality === currentQuality) return;
    
    const video = videoRef.current;
    const hls = hlsRef.current;
    const resumeTime = video.currentTime;
    
    console.log(`Changing quality from ${currentQuality} to ${newQuality}`);
    
    // If we have an active HLS instance and changing to a manual quality
    if (hls && hls.levels && newQuality !== 'auto') {
      const targetLevelIndex = findLevelByQuality(hls.levels, newQuality);
      console.log(`Target level index for ${newQuality}: ${targetLevelIndex}`);
      
      if (targetLevelIndex >= 0 && targetLevelIndex < hls.levels.length) {
        // Switch quality without reinitializing if using the same source
        if (currentQuality === 'auto') {
          hls.loadLevel = targetLevelIndex;
          hls.currentLevel = targetLevelIndex;
          
          // Set autoLevelCapping to limit quality switching
          if (typeof hls.autoLevelCapping !== 'undefined') {
            hls.autoLevelCapping = targetLevelIndex;
          }
          
          setCurrentQuality(newQuality);
          setShowSettings(false);
          return;
        }
      }
    } else if (hls && newQuality === 'auto') {
      // Switching to auto mode
      hls.currentLevel = -1;
      
      // Remove any capping for auto mode
      if (typeof hls.autoLevelCapping !== 'undefined') {
        hls.autoLevelCapping = -1;
      }
      
      setCurrentQuality(newQuality);
      setShowSettings(false);
      return;
    }
    
    // Full reinitialization for quality change
    setCurrentQuality(newQuality);
    setShowSettings(false);
    
    // If switching from manual to auto, allow full adaptation
    if (newQuality === 'auto') {
      setMaxQuality('1080p');
    } else {
      // Set max quality constraint for manual selection
      setMaxQuality(newQuality);
    }
    
    initializeVideo(newQuality, resumeTime);
  }, [currentQuality, initializeVideo, findLevelByQuality]);

  const changeAudioTrack = useCallback((trackId) => {
    if (hlsRef.current && hlsRef.current.audioTracks) {
      hlsRef.current.audioTrack = trackId;
      setCurrentAudioTrack(trackId);
      setShowSettings(false);
    }
  }, []);

  const changeSubtitleTrack = useCallback((trackId) => {
    if (hlsRef.current && hlsRef.current.subtitleTracks) {
      hlsRef.current.subtitleTrack = trackId;
      setCurrentSubtitleTrack(trackId);
      setShowSettings(false);
    }
  }, []);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCurrentQualityLabel = () => {
    if (currentQuality === 'auto') {
      return `Auto (${actualQuality})`;
    }
    const quality = qualityOptions.find(q => q.value === currentQuality);
    return quality ? quality.label : currentQuality;
  };

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    document.body.style.cursor = 'default';
  }, []);

  const handleMouseStop = useCallback(() => {
    if (isPlaying && !showSettings) {
      document.body.style.cursor = 'none';
    }
  }, [isPlaying, showSettings]);

  const styles = {
    container: {
      position: 'relative',
      width: '100%',
      height: '100vh',
      backgroundColor: '#000',
      overflow: 'hidden',
      cursor: showControls ? 'default' : (isPlaying ? 'none' : 'default')
    },
    video: {
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 1000
    },
    spinner: {
      width: '48px',
      height: '48px',
      border: '4px solid #dc2626',
      borderTop: '4px solid transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    errorContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000',
      color: '#fff',
      zIndex: 1000
    },
    errorIcon: {
      fontSize: '64px',
      marginBottom: '16px'
    },
    errorTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    errorMessage: {
      color: '#9ca3af',
      marginBottom: '24px',
      textAlign: 'center',
      maxWidth: '400px'
    },
    retryButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      backgroundColor: '#dc2626',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    playOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    },
    playButton: {
      width: '96px',
      height: '96px',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: '50%',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      transform: 'scale(1)'
    },
    controlsOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.8) 100%)',
      transition: 'opacity 0.3s ease',
      opacity: showControls ? 1 : 0,
      pointerEvents: showControls ? 'auto' : 'none',
      zIndex: 200
    },
    topControls: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      padding: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    titleSection: {
      flex: 1
    },
    title: {
      color: '#fff',
      fontSize: isFullscreen ? '28px' : '24px',
      fontWeight: 'bold',
      margin: 0
    },
    subtitle: {
      color: '#d1d5db',
      fontSize: '14px',
      margin: '4px 0 0 0'
    },
    qualityIndicator: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      padding: '6px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    networkIndicator: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: networkCondition === 'good' ? '#10b981' : 
                      networkCondition === 'medium' ? '#f59e0b' : '#ef4444'
    },
    bottomControls: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '24px'
    },
    progressContainer: {
      width: '100%',
      height: '4px',
      backgroundColor: '#4b5563',
      borderRadius: '2px',
      cursor: 'pointer',
      marginBottom: '16px',
      position: 'relative'
    },
    progressBar: {
      height: '100%',
      backgroundColor: '#dc2626',
      borderRadius: '2px',
      position: 'relative',
      transition: 'height 0.2s'
    },
    progressThumb: {
      position: 'absolute',
      right: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: '12px',
      height: '12px',
      backgroundColor: '#dc2626',
      borderRadius: '50%',
      opacity: 0,
      transition: 'opacity 0.2s'
    },
    controlsRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    leftControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    rightControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    controlButton: {
      color: '#fff',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s',
      padding: '8px',
      borderRadius: '4px'
    },
    volumeGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    volumeSliderContainer: {
      width: 0,
      overflow: 'hidden',
      transition: 'width 0.3s'
    },
    volumeSlider: {
      width: '80px',
      height: '4px',
      backgroundColor: '#4b5563',
      borderRadius: '2px',
      appearance: 'none',
      cursor: 'pointer'
    },
    timeDisplay: {
      color: '#fff',
      fontSize: '14px',
      minWidth: '100px'
    },
    settingsPanel: {
      position: 'absolute',
      bottom: '80px',
      right: '24px',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      borderRadius: '8px',
      padding: '16px',
      minWidth: '220px',
      maxHeight: '400px',
      overflowY: 'auto',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      zIndex: 300
    },
    settingsTitle: {
      color: '#fff',
      fontWeight: '600',
      marginBottom: '12px',
      fontSize: '14px'
    },
    settingsOptions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    settingOption: {
      width: '100%',
      textAlign: 'left',
      padding: '10px 12px',
      borderRadius: '4px',
      fontSize: '14px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      backgroundColor: 'transparent',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    activeOption: {
      backgroundColor: '#dc2626',
      color: '#fff'
    },
    inactiveOption: {
      color: '#d1d5db',
      backgroundColor: 'transparent'
    },
    noOptionsText: {
      color: '#9ca3af',
      fontSize: '14px',
      padding: '8px 12px'
    },
    qualityBadge: {
      fontSize: '11px',
      padding: '2px 6px',
      borderRadius: '3px',
      backgroundColor: currentQuality === 'auto' ? '#10b981' : '#6b7280',
      color: '#fff'
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .volume-slider::-webkit-slider-thumb {
            appearance: none;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #dc2626;
            cursor: pointer;
          }
          
          .volume-slider::-moz-range-thumb {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #dc2626;
            cursor: pointer;
            border: none;
          }
          
          .progress-container:hover .progress-bar {
            height: 6px;
          }
          
          .progress-container:hover .progress-thumb {
            opacity: 1;
          }
          
          .control-button:hover {
            background-color: rgba(255, 255, 255, 0.1);
            color: #f3f4f6;
          }
          
          .play-button:hover {
            background-color: rgba(0, 0, 0, 0.8);
            transform: scale(1.05);
          }
          
          .retry-button:hover {
            background-color: #b91c1c;
          }
          
          .volume-group:hover .volume-slider-container {
            width: 80px;
          }
          
          .setting-option:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
          
          video::-webkit-media-controls {
            display: none !important;
          }
          
          video::-webkit-media-controls-enclosure {
            display: none !important;
          }
          
          *:focus {
            outline: none;
          }
        `}
      </style>
      
      <div 
        ref={containerRef}
        style={styles.container}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseStop}
        onClick={() => setShowSettings(false)}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          style={styles.video}
          onClick={togglePlayPause}
          onDoubleClick={toggleFullscreen}
          controls={false}
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture={true}
          preload="metadata"
        />

        {/* Loading Spinner */}
        {(isLoading || isBuffering) && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}>⚠️</div>
            <h2 style={styles.errorTitle}>Playback Error</h2>
            <p style={styles.errorMessage}>{error}</p>
            <button 
              style={styles.retryButton}
              className="retry-button"
              onClick={() => initializeVideo(currentQuality)}
            >
              <RotateCcw size={20} />
              Retry
            </button>
          </div>
        )}

        {/* Play Button Overlay */}
        {!isPlaying && !isLoading && !error && (
          <div style={styles.playOverlay}>
            <button
              style={styles.playButton}
              className="play-button"
              onClick={togglePlayPause}
            >
              <Play size={48} fill="white" style={{ marginLeft: '4px' }} />
            </button>
          </div>
        )}

        {/* Controls */}
        <div style={styles.controlsOverlay}>
          
          {/* Top Controls */}
          <div style={styles.topControls}>
            <div style={styles.titleSection}>
              <h1 style={styles.title}>Stranger Things</h1>
              <p style={styles.subtitle}>Series • 2026 • HD</p>
            </div>
            
            {/* Quality and Network Indicator */}
            <div style={styles.qualityIndicator}>
              <div style={styles.networkIndicator}></div>
              {getCurrentQualityLabel()}
              {currentQuality === 'auto' && (
                <span style={styles.qualityBadge}>ABR</span>
              )}
            </div>
          </div>

          {/* Bottom Controls */}
          <div style={styles.bottomControls}>
            
            {/* Progress Bar */}
            <div 
              ref={progressBarRef}
              style={styles.progressContainer}
              className="progress-container"
              onClick={handleSeek}
            >
              <div 
                style={{...styles.progressBar, width: `${(currentTime / duration) * 100}%`}}
                className="progress-bar"
              >
                <div style={styles.progressThumb} className="progress-thumb"></div>
              </div>
            </div>

            {/* Control Buttons */}
            <div style={styles.controlsRow}>
              <div style={styles.leftControls}>
                
                {/* Play/Pause */}
                <button 
                  onClick={togglePlayPause} 
                  style={styles.controlButton}
                  className="control-button"
                  title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                >
                  {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" />}
                </button>

                {/* Skip Buttons */}
                <button 
                  onClick={() => skipTime(-10)} 
                  style={styles.controlButton}
                  className="control-button"
                  title="Rewind 10s (←)"
                >
                  <SkipBack size={24} />
                </button>
                <button 
                  onClick={() => skipTime(10)} 
                  style={styles.controlButton}
                  className="control-button"
                  title="Forward 10s (→)"
                >
                  <SkipForward size={24} />
                </button>

                {/* Volume */}
                <div style={styles.volumeGroup} className="volume-group">
                  <button 
                    onClick={toggleMute} 
                    style={styles.controlButton}
                    className="control-button"
                    title={isMuted ? "Unmute (M)" : "Mute (M)"}
                  >
                    {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>
                  <div style={styles.volumeSliderContainer} className="volume-slider-container">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      style={styles.volumeSlider}
                      className="volume-slider"
                      title="Volume (↑/↓)"
                    />
                  </div>
                </div>

                {/* Time Display */}
                <div style={styles.timeDisplay}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div style={styles.rightControls}>
                
                {/* Subtitles */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSettings(showSettings === 'subtitles' ? false : 'subtitles');
                  }}
                  style={styles.controlButton}
                  className="control-button"
                  title="Subtitles"
                >
                  <Subtitles size={24} />
                </button>

                {/* Audio */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSettings(showSettings === 'audio' ? false : 'audio');
                  }}
                  style={styles.controlButton}
                  className="control-button"
                  title="Audio tracks"
                >
                  <Languages size={24} />
                </button>

                {/* Settings */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSettings(showSettings === 'quality' ? false : 'quality');
                  }}
                  style={styles.controlButton}
                  className="control-button"
                  title="Quality settings"
                >
                  <Settings size={24} />
                </button>

                {/* Fullscreen */}
                <button 
                  onClick={toggleFullscreen} 
                  style={styles.controlButton}
                  className="control-button"
                  title="Fullscreen (F)"
                >
                  <Maximize size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div style={styles.settingsPanel} onClick={(e) => e.stopPropagation()}>
            
            {/* Quality Settings */}
            {showSettings === 'quality' && (
              <div>
                <h3 style={styles.settingsTitle}>Video Quality</h3>
                <div style={styles.settingsOptions}>
                  {qualityOptions.map((quality) => (
                    <button
                      key={quality.value}
                      onClick={() => changeQuality(quality.value)}
                      style={{
                        ...styles.settingOption,
                        ...(currentQuality === quality.value ? styles.activeOption : styles.inactiveOption)
                      }}
                      className="setting-option"
                    >
                      <span>{quality.label}</span>
                      {quality.value === 'auto' && (
                        <span style={{...styles.qualityBadge, backgroundColor: '#10b981'}}>
                          Adaptive
                        </span>
                      )}
                      {currentQuality === quality.value && quality.value !== 'auto' && (
                        <span style={{...styles.qualityBadge, backgroundColor: '#dc2626'}}>
                          Fixed
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <div style={{...styles.noOptionsText, marginTop: '12px', fontSize: '12px'}}>
                  Auto adapts quality based on your connection speed
                </div>
              </div>
            )}

            {/* Audio Settings */}
            {showSettings === 'audio' && (
              <div>
                <h3 style={styles.settingsTitle}>Audio Track</h3>
                <div style={styles.settingsOptions}>
                  {audioTracks.length > 0 ? audioTracks.map((track, index) => (
                    <button
                      key={index}
                      onClick={() => changeAudioTrack(track.id)}
                      style={{
                        ...styles.settingOption,
                        ...(currentAudioTrack === track.id ? styles.activeOption : styles.inactiveOption)
                      }}
                      className="setting-option"
                    >
                      <span>{track.name || track.lang || `Track ${index + 1}`}</span>
                      {currentAudioTrack === track.id && (
                        <span style={{...styles.qualityBadge, backgroundColor: '#dc2626'}}>
                          Active
                        </span>
                      )}
                    </button>
                  )) : (
                    <div style={styles.noOptionsText}>No audio tracks available</div>
                  )}
                </div>
              </div>
            )}

            {/* Subtitle Settings */}
            {showSettings === 'subtitles' && (
              <div>
                <h3 style={styles.settingsTitle}>Subtitles</h3>
                <div style={styles.settingsOptions}>
                  <button
                    onClick={() => changeSubtitleTrack(-1)}
                    style={{
                      ...styles.settingOption,
                      ...(currentSubtitleTrack === -1 ? styles.activeOption : styles.inactiveOption)
                    }}
                    className="setting-option"
                  >
                    <span>Off</span>
                    {currentSubtitleTrack === -1 && (
                      <span style={{...styles.qualityBadge, backgroundColor: '#dc2626'}}>
                        Active
                      </span>
                    )}
                  </button>
                  {subtitleTracks.length > 0 ? subtitleTracks.map((track, index) => (
                    <button
                      key={index}
                      onClick={() => changeSubtitleTrack(track.id)}
                      style={{
                        ...styles.settingOption,
                        ...(currentSubtitleTrack === track.id ? styles.activeOption : styles.inactiveOption)
                      }}
                      className="setting-option"
                    >
                      <span>{track.name || track.lang || `Subtitle ${index + 1}`}</span>
                      {currentSubtitleTrack === track.id && (
                        <span style={{...styles.qualityBadge, backgroundColor: '#dc2626'}}>
                          Active
                        </span>
                      )}
                    </button>
                  )) : (
                    <div style={styles.noOptionsText}>No subtitles available</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default NetflixPlayer;