import React, { useState, useRef, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';

const WallPaper = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  overflow: 'hidden',
  background: 'linear-gradient(rgb(255, 38, 142) 0%, rgb(255, 105, 79) 100%)',
  transition: 'all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s',
  '&::before': {
    content: '""',
    width: '140%',
    height: '140%',
    position: 'absolute',
    top: '-40%',
    right: '-50%',
    background:
      'radial-gradient(at center center, rgb(62, 79, 249) 0%, rgba(62, 79, 249, 0) 64%)',
  },
  '&::after': {
    content: '""',
    width: '140%',
    height: '140%',
    position: 'absolute',
    bottom: '-50%',
    left: '-30%',
    background:
      'radial-gradient(at center center, rgb(247, 237, 225) 0%, rgba(247, 237, 225, 0) 70%)',
    transform: 'rotate(30deg)',
  },
});

const Widget = styled('div')(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  width: 343,
  maxWidth: '100%',
  margin: 'auto',
  position: 'relative',
  zIndex: 1,
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)',
  backdropFilter: 'blur(40px)',
}));

const CoverImage = styled('div')({
  width: 100,
  height: 100,
  objectFit: 'cover',
  overflow: 'hidden',
  flexShrink: 0,
  borderRadius: 8,
  backgroundColor: 'rgba(0,0,0,0.08)',
  '& > img': {
    width: '100%',
  },
});

const TinyText = styled(Typography)({
  fontSize: '0.75rem',
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

export default function MusicPlayerSlider() {
  const audioRef = useRef(null);
  const audioPlayerRef = useRef(new Audio());
  const [uploadedFile, setUploadedFile] = useState(null);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(30);
  const [playlist, setPlaylist] = useState([]);
  const [position, setPosition] = useState(0); 
  const [duration, setDuration] = useState(0);
  const theme = useTheme();

  const formatDuration = (value) => {
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';
  const lightIconColor =
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        setUploadedFile(file);
        addToPlaylist(file);
      }
    };
  

    const togglePlayPause = () => {
      const audioPlayer = audioPlayerRef.current;
      if (!audioPlayer.src && uploadedFile) {
        audioPlayer.src = URL.createObjectURL(uploadedFile);
        audioPlayer.addEventListener('loadedmetadata', () => {
          setDuration(audioPlayer.duration); 
        });
      }
      if (audioPlayer.paused) {
        audioPlayer.play();
      } else {
        audioPlayer.pause();
      }
      setIsPlaying(!audioPlayer.paused);
    };

    const handleVolumeChange = (event, newValue) => {
      const audioPlayer = audioPlayerRef.current;
      setVolume(newValue);
      audioPlayer.volume = newValue / 100;
    };

  const handleTimeUpdate = () => {
    setCurrentTime(audioPlayer.currentTime);
  };

  const handleTimeChange = (_, newValue) => {
    const audioPlayer = audioPlayerRef.current;
    setPosition(newValue);
    audioPlayer.currentTime = newValue;
  };

  const addToPlaylist = (file) => {
    const newSong = { name: file.name, artist: 'Unknown', duration: '3:30' }; 
    setPlaylist([...playlist, newSong]);
  };
  
  

  useEffect(() => {
    const audioPlayer = audioPlayerRef.current;
    const updatePosition = () => {
      setPosition(Math.round(audioPlayer.currentTime)); 
    };
    audioPlayer.addEventListener('timeupdate', updatePosition);
    return () => {
      audioPlayer.removeEventListener('timeupdate', updatePosition);
    };
  }, []);

  const handleSongClick = (index) => {
    setPosition(index); 
    playSong(index); 
  };
  
  const playSong = (index) => {
    const audioPlayer = audioPlayerRef.current;
    const selectedSong = playlist[index];
    const selectedFile = selectedSong.file; 
  
    if (selectedFile) {
      audioPlayer.src = URL.createObjectURL(selectedFile);
      audioPlayer.play();
      setIsPlaying(true);
    }
  };

  const handleSongEnded = () => {

  if (position + 1 < playlist.length) {
    setPosition(position + 1);
    playNextSong();
  } else {
    setIsPlaying(false);
  }
};

const playNextSong = () => {
  const audioPlayer = audioPlayerRef.current;
  const nextSong = playlist[position + 1];
  const nextFile = nextSong.file;

  if (nextFile) {
    audioPlayer.src = URL.createObjectURL(nextFile);
    audioPlayer.play();
    setIsPlaying(true);
  }
};

const handleSongSelect = (index) => {
  const selectedSong = playlist[index];
  const selectedFile = selectedSong.file;
  if (selectedFile) {
    const audioPlayer = audioPlayerRef.current;
    audioPlayer.src = URL.createObjectURL(selectedFile);
    audioPlayer.play();
  }
};

const handlePreviousSong = () => {
  const audioPlayer = audioPlayerRef.current;
  audioPlayer.currentTime = 0; 
  audioPlayer.play(); 
};

const handleNextSong = () => {
  const audioPlayer = audioPlayerRef.current;
  if (position + 1 < playlist.length) {
    setPosition(position + 1); 
    playNextSong(); 
  } else {
    audioPlayer.play(); 
  }
};

    

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Widget>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="file"
          id="upload-file"
          accept="audio/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <Box sx={{ ml: 1.5, minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
          </Typography>
          {uploadedFile && (
            <Typography noWrap>
              <b>{uploadedFile.name}</b>
            </Typography>
          )}
        </Box>
      </Box>


      <Slider
        aria-label="time-indicator"
        value={position}
        min={0}
        max={duration}
        onChange={handleTimeChange}
        sx={{
          color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
          height: 4,
          '& .MuiSlider-thumb': {
            width: 8,
            height: 8,
            transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
            '&::before': {
              boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
            },
            '&:hover, &.Mui-focusVisible': {
              boxShadow: `0px 0px 0px 8px ${
                theme.palette.mode === 'dark'
                  ? 'rgb(255 255 255 / 16%)'
                  : 'rgb(0 0 0 / 16%)'
              }`,
            },
            '&.Mui-active': {
              width: 20,
              height: 20,
            },
          },
          '& .MuiSlider-rail': {
            opacity: 0.28,
          },
        }}
      />
      <audio ref={audioPlayerRef} />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: -2,
          }}
        >
          <TinyText>{formatDuration(position)}</TinyText>
          <TinyText>-{formatDuration(duration - position)}</TinyText>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: -1,
          }}
        >
          <IconButton aria-label="previous song" onClick={handlePreviousSong}>
  <FastRewindRounded fontSize="large" htmlColor={mainIconColor} />
</IconButton>
          <div>
      <audio ref={audioRef} src={uploadedFile && URL.createObjectURL(uploadedFile)} />
      <IconButton
        aria-label={isPlaying ? 'pause' : 'play'}
        onClick={togglePlayPause}
      >
        {isPlaying ? (
          <PauseRounded sx={{ fontSize: '3rem' }} />
        ) : (
          <PlayArrowRounded sx={{ fontSize: '3rem' }} />
        )}
      </IconButton>
      <audio ref={audioPlayerRef} />
    </div>
    <IconButton aria-label="next song" onClick={handleNextSong}>
  <FastForwardRounded fontSize="large" htmlColor={mainIconColor} />
</IconButton>
        </Box>
        <Stack spacing={2} direction="row" sx={{ mb: 1, px: 1 }} alignItems="center">
          <VolumeDownRounded htmlColor={lightIconColor} />
          <Slider
        aria-label="Volume"
        value={volume}
        onChange={handleVolumeChange}
        sx={{
          color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
              '& .MuiSlider-track': {
                border: 'none',
              },
          '& .MuiSlider-track': {
            border: 'none',
          },
          '& .MuiSlider-thumb': {
            width: 24,
            height: 24,
            backgroundColor: '#fff',
            '&::before': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
            },
            '&:hover, &.Mui-focusVisible, &.Mui-active': {
              boxShadow: 'none',
            },
          },
        }}
      />
      <audio ref={audioPlayerRef} />
          <VolumeUpRounded htmlColor={lightIconColor} />
        </Stack>
        <label htmlFor="upload-file">
          <IconButton component="span">
            <DriveFolderUploadIcon />
          </IconButton>
        </label>

        <List
  sx={{
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background',
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
    '& ul': { padding: 0 },
  }}
  subheader={<ListSubheader sx={{ fontSize: '1.2rem', bgcolor: 'transparent', fontWeight: 'bold' }}>Playlist :</ListSubheader>}

>
  {playlist.map((song, index) => (
    <ListItem key={index} button onClick={() => handleSongSelect(index)}>
      <ListItemText primary={song.name} />
    </ListItem>
  ))}
</List>


      </Widget>
      <WallPaper />
    </Box>
  );
}


