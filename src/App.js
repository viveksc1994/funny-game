import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Constants for game area dimensions and character sizes
const GAME_AREA_HEIGHT = window.innerHeight; // Fullscreen height
const GAME_AREA_WIDTH = window.innerWidth; // Fullscreen width
const CHARACTER_WIDTH = 50; // Character width
const CHARACTER_HEIGHT = 50; // Character height
const OBJECT_SIZE = 70; // Size of falling objects (smaller size)

// List of funny character images (replace with your own URLs)
const funnyCharacterImages = [
  'https://w7.pngwing.com/pngs/311/425/png-transparent-humour-funny-face-youtube-joke-laughter-youtube-comics-face-comic-book-thumbnail.png', // Replace with your funny character image URLs
  'https://w7.pngwing.com/pngs/311/425/png-transparent-humour-funny-face-youtube-joke-laughter-youtube-comics-face-comic-book-thumbnail.png',
  'https://w7.pngwing.com/pngs/311/425/png-transparent-humour-funny-face-youtube-joke-laughter-youtube-comics-face-comic-book-thumbnail.png',
];

function App() {
  const [characterPosition, setCharacterPosition] = useState(GAME_AREA_WIDTH / 2 - CHARACTER_WIDTH / 2);
  const [fallingObjects, setFallingObjects] = useState([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

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
        const newObject = {
          id: Math.random(),
          left: Math.random() * (GAME_AREA_WIDTH - OBJECT_SIZE),
          top: 0,
          image: funnyCharacterImages[Math.floor(Math.random() * funnyCharacterImages.length)], // Random image
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
        obj.top + OBJECT_SIZE >= GAME_AREA_HEIGHT - CHARACTER_HEIGHT &&
        obj.left < characterPosition + CHARACTER_WIDTH &&
        obj.left + OBJECT_SIZE > characterPosition
      ) {
        setIsGameOver(true);
        alert(`Game Over! Your score: ${score}`);
        resetGame(); // Reset game after alert
      } else if (obj.top >= GAME_AREA_HEIGHT - 20) {
        setScore((prev) => prev + 1); // Increment score when an object reaches the bottom
      }
    });
  }, [fallingObjects, characterPosition, score]);

  // Reset the game
  const resetGame = () => {
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

  return (
    <div className="App">
      <h1>Dodge the Falling Objects</h1>
      <h2>Score: {score}</h2>
      <button onClick={resetGame} disabled={!isGameOver}>
        {isGameOver ? 'Play Again' : 'Reset Game'}
      </button>
      <div className="game-area" style={{ height: GAME_AREA_HEIGHT, width: GAME_AREA_WIDTH }}>
        <div
          className="character"
          style={{
            left: `${characterPosition}px`,
            bottom: '0px',
            width: `${CHARACTER_WIDTH}px`,
            height: `${CHARACTER_HEIGHT}px`,
            backgroundColor: 'blue', // Character color for visibility
            position: 'absolute',
          }}
        />
        {fallingObjects.map((obj) => (
          <img
            key={obj.id}
            className="falling-object"
            src={obj.image}
            alt="Falling character"
            style={{
              left: `${obj.left}px`,
              top: `${obj.top}px`,
              width: `${OBJECT_SIZE}px`,
              height: `${OBJECT_SIZE}px`,
              position: 'absolute',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
