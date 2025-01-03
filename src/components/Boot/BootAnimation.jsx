import React, { useState, useEffect } from 'react';
import { Box, Typography, Fade } from '@mui/material';
import { keyframes } from '@mui/system';

const gradientShift = keyframes`
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const easterEggs = [
  {
    logo: '../assets/icons/easter eggs/easter1.png',
    title: ':c',
    subtitle: '"Secretly I am very lonely..."'
  },
  {
    logo: '../assets/icons/easter eggs/easter2.png',
    title: '˚ʚ♡ɞ˚',
    subtitle: 'YOU HAVE NO OTHER OPTION AHHAHAHAHAHHAHAHAHA :3'
  },
  {
    logo: '../assets/icons/easter eggs/easter3.png',
    title: 'D:',
    subtitle: 'I am telling!'
  },
  {
    logo: '../assets/icons/easter eggs/easter4.png',
    title: 'Crayon Eater',
    subtitle: 'Maybe not the red ones though,,,, they are mine!'
  },
  {
    logo: '../assets/icons/easter eggs/easter5.png',
    title: 'Meow :3',
    subtitle: 'Me, if you even care...'
  },
  {
    logo: '../assets/icons/easter eggs/easter6.png',
    title: 'Credit Score',
    subtitle: 'How am I looking? Can I apply?'
  },
  {
    logo: '../assets/icons/easter eggs/easter7.png',
    title: 'Uhhhhhhh,,,,',
    subtitle: 'brain = empty'
  },
  {
    logo: '../assets/icons/easter eggs/easter8.png',
    title: 'NOM NOM NOM',
    subtitle: 'nom nom nom nom nom'
  }
];

export default function BootAnimation({ onComplete }) {
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showSubtext, setShowSubtext] = useState(false);
  const [content, setContent] = useState({
    logo: '../assets/icons/logo.png',
    title: 'TourSync',
    subtitle: 'An Internal Tool for Affordable Property Management'
  });

  useEffect(() => {
    // 0.5% chance for easter egg
    if (Math.random() < 0.005) {
      const randomEgg = easterEggs[Math.floor(Math.random() * easterEggs.length)];
      setContent(randomEgg);
    }

    const sequence = async () => {
      setShowLogo(true);
      await new Promise(r => setTimeout(r, 800));
      setShowText(true);
      await new Promise(r => setTimeout(r, 600));
      setShowSubtext(true);
      await new Promise(r => setTimeout(r, 1200));
      onComplete();
    };
    
    sequence();
  }, [onComplete]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        color: 'text.primary'
      }}
    >
      <Fade in={showLogo} timeout={1000}>
        <Box
          component="img"
          src={content.logo}
          sx={{
            width: 240,
            height: 'auto',
            mb: 4,
            filter: 'drop-shadow(0 0 12px rgba(139, 31, 47, 0.35))'
          }}
        />
      </Fade>
      
      <Fade in={showText} timeout={800}>
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: '3rem',
            background: 'linear-gradient(90deg, #8B1F2F, #A62639, #6B1825, #455A64, #8B1F2F)',
            backgroundSize: '200% 100%',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            mb: 1.5,
            animation: `${gradientShift} 2s linear infinite`
          }}
        >
          {content.title}
        </Typography>
      </Fade>
      
      <Fade in={showSubtext} timeout={800}>
        <Typography 
          variant="subtitle1" 
          color="text.secondary"
          sx={{ 
            fontSize: '1.25rem'
          }}
        >
          {content.subtitle}
        </Typography>
      </Fade>
    </Box>
  );
} 