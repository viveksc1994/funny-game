import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import backgroundMusic from './badme.mp3'; // Import your background music
// Import your character image
import characterImage from './dancin-monkey.gif'; // Adjust the path as necessary
import blastImage from './blast.gif'; // Adjust the path as necessary
import metoDarGaiSound from './metodargai.mp3'; // Import the audio for game over sound

let CHARACTER_WIDTH = 100;
let CHARACTER_HEIGHT = 100;
const GAME_AREA_HEIGHT = window.innerHeight; // Fullscreen height
const GAME_AREA_WIDTH = window.innerWidth; // Fullscreen width
const OBJECT_SIZE = 70; // Size of falling objects

const funnyCharacterImages = [
  '/fruits-1.gif',
  '/fruits-2.gif',
  '/fruits-3.gif',
  '/fruits-4.gif',
  '/fruits-5.gif',
  '/fruits-6.gif',
];

const fireImages = [
  '/fire-flame.gif', // Replace with actual fire image URLs
];

const snakeImages = [
  '/Snake.png', // Replace with actual fire image URLs
];

function App() {
  const [characterPosition, setCharacterPosition] = useState(GAME_AREA_WIDTH / 2 - CHARACTER_WIDTH / 2);
  const [fallingObjects, setFallingObjects] = useState([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false); // State to track music playing
  const audioRef = useRef(null); // Ref to store audio element
  const gameOverAudioRef = useRef(null); // Ref to store audio element

  // Handle key down events for character movement
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowLeft') {
      setCharacterPosition((prev) => Math.max(prev - 15, 0)); // Move left
    }
    if (event.key === 'ArrowRight') {
      setCharacterPosition((prev) => Math.min(prev + 15, GAME_AREA_WIDTH - CHARACTER_WIDTH)); // Move right
    }
  }, []);

  // Start generating falling objects
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isGameOver) {
        const isFire = Math.random() < 0.4; // 40% chance to be a fire object
        const isSnake = Math.random() < 0.2; // 20% chance to be a snake object
        const newObject = {
          id: Math.random(),
          left: Math.random() * (GAME_AREA_WIDTH - OBJECT_SIZE),
          top: 0,
          image: isFire
            ? fireImages[Math.floor(Math.random() * fireImages.length)] // Random fire image
            : isSnake
            ? snakeImages[Math.floor(Math.random() * snakeImages.length)] 
            : funnyCharacterImages[Math.floor(Math.random() * funnyCharacterImages.length)], // Random funny image
          size: OBJECT_SIZE,
        };
        setFallingObjects((prev) => [...prev, newObject]);
      }
    }, 1000); // Generate a new falling object every second

    return () => clearInterval(intervalId);
  }, [isGameOver]);

  // Move falling objects down
  useEffect(() => {
    const moveObjects = setInterval(() => {
      setFallingObjects((prev) => {
        return prev.map((obj) => ({
          ...obj,
          top: obj.top + 10, // Move down by 10 pixels
        })).filter((obj) => obj.top < GAME_AREA_HEIGHT); // Remove objects that fall below the game area
      });
    }, 100);

    return () => clearInterval(moveObjects);
  }, []);

  // Check for collisions and scoring
  useEffect(() => {
    fallingObjects.forEach((obj) => {
      if (
        obj.top + obj.size >= GAME_AREA_HEIGHT - 250 &&
        obj.left < characterPosition + CHARACTER_WIDTH &&
        obj.left + obj.size > characterPosition
      ) {
        if (fireImages.includes(obj.image)) {
          setIsGameOver(true); // Game over if touching fire
          handlePlayMusic();
          // alert(`Game Over! Your score: ${score}`);
          // resetGame(); // Reset game after alert
        }else if (snakeImages.includes(obj.image)){
          setIsGameOver(true); // Game over if touching fire
          handlePlayMusicsnake();
        } else if (funnyCharacterImages.includes(obj.image)) {
          // Absorb the object
          CHARACTER_WIDTH = CHARACTER_WIDTH + 0.001;
          CHARACTER_HEIGHT = CHARACTER_HEIGHT + 0.001;
          const newSize = obj.size + 10; // Increase size of the object
          setScore((prev) => prev + 1); // Increment score when absorbed
          setFallingObjects((prev) => 
            prev.map((item) => 
              item.id === obj.id ? { ...item, size: newSize, left: item.left - 5 } : item
            )
          );
        }
      }
    });
  }, [fallingObjects, characterPosition]);

  // Reset the game
  const resetGame = () => {
    audioRef.current.pause();
    gameOverAudioRef.current.pause();
    setCharacterPosition(GAME_AREA_WIDTH / 2 - CHARACTER_WIDTH / 2);
    setFallingObjects([]);
    setScore(0);
    setIsGameOver(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Function to play music
  const handlePlayMusic = () => {
    if (audioRef.current) {
      audioRef.current.play(); // Play the music
      setIsMusicPlaying(true); // Update music state
    }else{
      gameOverAudioRef.current.play();
      setIsMusicPlaying(true); // Update music state
    }
  };

    // Function to play music
    const handlePlayMusicsnake = () => {
      if (gameOverAudioRef.current) {
        gameOverAudioRef.current.play();
        setIsMusicPlaying(true); // Update music state
      }
    };

  return (
    <div className="App">
      <h1>मार मार साले का खोपडी तोड़</h1>
      <h2>कितना खाया: {score}</h2>
      <button onClick={resetGame} disabled={!isGameOver}>
        {isGameOver ? 'Play Again' : 'Reset Game'}
      </button>
      <div className="game-area" style={{ height: GAME_AREA_HEIGHT, width: GAME_AREA_WIDTH }}>
        <img
          className="character"
          src={isGameOver ? blastImage : characterImage}
          alt="Character"
          style={{
            left: `${characterPosition}px`,
            bottom: '0px',
            width: `${CHARACTER_WIDTH}px`,
            height: `${CHARACTER_HEIGHT}px`,
            position: 'absolute',
          }}
        />
        {fallingObjects.map((obj) => (
          <img
            key={obj.id}
            className="falling-object"
            src={obj.image}
            alt="Falling object"
            style={{
              left: `${obj.left}px`,
              top: `${obj.top}px`,
              width: `${obj.size}px`,
              height: `${obj.size}px`,
              position: 'absolute',
            }}
          />
        ))}
      </div>
      <audio ref={audioRef} src={backgroundMusic}  /> {/* Background music */}
      <audio ref={gameOverAudioRef} src={metoDarGaiSound} /> {/* Game over sound */}
    </div>
  );
}

export default App;
