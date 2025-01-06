import React, { useState, useEffect } from 'react';
import { Box, Typography, Fade } from '@mui/material';
import { keyframes } from '@mui/system';
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

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
  const [isEasterEgg, setIsEasterEgg] = useState(false);
  const [content, setContent] = useState({
    logo: process.env.NODE_ENV === 'development' 
      ? '../assets/icons/logo.png'
      : '../../assets/icons/logo.png',
    title: 'TourSync',
    subtitle: 'An Internal Tool for Affordable Property Management'
  });

  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  const getEasterEggPath = (imageName) => {
    return process.env.NODE_ENV === 'development'
      ? `../assets/icons/easter eggs/${imageName}`
      : `../../assets/icons/easter eggs/${imageName}`;
  };

  useEffect(() => {
    if (Math.random() < 0.035) {
      const easterEggs = [
        {
          logo: getEasterEggPath('easter1.png'),
          title: ':c',
          subtitle: '"Secretly I am very lonely..."'
        },
        {
          logo: getEasterEggPath('easter2.png'),
          title: '˚ʚ♡ɞ˚',
          subtitle: 'YOU HAVE NO OTHER OPTION AHHAHAHAHAHHAHAHAHA :3'
        },
        {
          logo: getEasterEggPath('easter3.png'),
          title: 'D:',
          subtitle: 'I am telling!'
        },
        {
          logo: getEasterEggPath('easter4.png'),
          title: 'Crayon Eater',
          subtitle: 'Maybe not the red ones though,,,, they are mine!'
        },
        {
          logo: getEasterEggPath('easter5.png'),
          title: 'Meow :3',
          subtitle: 'Me, if you even care...'
        },
        {
          logo: getEasterEggPath('easter6.png'),
          title: 'Credit Score',
          subtitle: 'How am I looking? Can I apply?'
        },
        {
          logo: getEasterEggPath('easter7.png'),
          title: 'Uhhhhhhh,,,,',
          subtitle: 'brain = empty'
        },
        {
          logo: getEasterEggPath('easter8.png'),
          title: 'NOM NOM NOM',
          subtitle: 'nom nom nom nom nom'
        }
      ];
      const randomEgg = easterEggs[Math.floor(Math.random() * easterEggs.length)];
      setContent(randomEgg);
      setIsEasterEgg(true);
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
        color: 'text.primary',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {isEasterEgg && (
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            // Your confetti options here
            fullScreen: {
              zIndex: 1
            },
            emitters: [
              {
                position: {
                  x: 0,
                  y: 30
                },
                rate: {
                  quantity: 5,
                  delay: 0.15
                },
                particles: {
                  move: {
                    direction: "top-right",
                    outModes: {
                      top: "none",
                      left: "none",
                      default: "destroy"
                    }
                  }
                }
              },
              {
                position: {
                  x: 100,
                  y: 30
                },
                rate: {
                  quantity: 5,
                  delay: 0.15
                },
                particles: {
                  move: {
                    direction: "top-left",
                    outModes: {
                      top: "none",
                      right: "none",
                      default: "destroy"
                    }
                  }
                }
              }
            ],
            particles: {
              color: {
                value: [
                  "#ffffff",
                  "#FF0000"
                ]
              },
              move: {
                decay: 0.05,
                direction: "top",
                enable: true,
                gravity: {
                  enable: true
                },
                outModes: {
                  top: "none",
                  default: "destroy"
                },
                speed: {
                  min: 10,
                  max: 50
                }
              },
              number: {
                value: 0
              },
              opacity: {
                value: 1
              },
              rotate: {
                value: {
                  min: 0,
                  max: 360
                },
                direction: "random",
                animation: {
                  enable: true,
                  speed: 30
                }
              },
              tilt: {
                direction: "random",
                enable: true,
                value: {
                  min: 0,
                  max: 360
                },
                animation: {
                  enable: true,
                  speed: 30
                }
              },
              size: {
                value: {
                  min: 0,
                  max: 2
                },
                animation: {
                  enable: true,
                  startValue: "min",
                  count: 1,
                  speed: 16,
                  sync: true
                }
              },
              roll: {
                darken: {
                  enable: true,
                  value: 25
                },
                enable: true,
                speed: {
                  min: 5,
                  max: 15
                }
              },
              wobble: {
                distance: 30,
                enable: true,
                speed: {
                  min: -7,
                  max: 7
                }
              },
              shape: {
                type: [
                  "circle",
                  "square"
                ],
                options: {}
              }
            }
          }}
        />
      )}

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