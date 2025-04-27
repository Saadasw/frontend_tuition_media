// pages/index.tsx
'use client'
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import styles from '../../styles/LetterSwapGame.module.css';

export default function LetterSwapGame(){
  const [targetString, setTargetString] = useState<string>('');
  const [currentString, setCurrentString] = useState<string>('');
  const [firstSelected, setFirstSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [previousCount, setPreviousCount] = useState<number>(0);
  const [isWinner, setIsWinner] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number, y: number } | null>(null);
  
  const emotionContainerRef = useRef<HTMLDivElement>(null);
  
  const words = [
    'XYLOPHONE', 'QUIZZICAL', 'JINXED', 'WHIZZING', 
    'VAPORIZED', 'JACKPOT', 'FLAPJACK', 'BUZZKILL',
    'ZIGZAG', 'JUKEBOX', 'SPHINX', 'NOWADAYS',
    'QUIXOTIC', 'FRAZZLED', 'WHIMSY', 'ZEPHYR'
  ];

  const getRandomWord = () => {
    // On smaller screens, choose shorter words
    if (typeof window !== 'undefined' && window.innerWidth <= 480) {
      const shorterWords = words.filter(word => word.length <= 8);
      if (shorterWords.length > 0) {
        return shorterWords[Math.floor(Math.random() * shorterWords.length)];
      }
    }
    return words[Math.floor(Math.random() * words.length)];
  };

  const shuffleString = (str: string) => {
    let array = str.split('');
    let shuffled: string[];
    
    // Keep shuffling until we get a different arrangement
    do {
      shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    } while (str === shuffled.join(''));
    
    return shuffled.join('');
  };

  const countCorrectPositions = (current: string, target: string) => {
    let count = 0;
    for (let i = 0; i < target.length; i++) {
      if (current[i] === target[i]) {
        count++;
      }
    }
    return count;
  };

  const startNewGame = () => {
    const newTarget = getRandomWord();
    const newCurrent = shuffleString(newTarget);
    
    setTargetString(newTarget);
    setCurrentString(newCurrent);
    setFirstSelected(null);
    setIsWinner(false);
    
    // Calculate initial correct count
    const initialCorrectCount = countCorrectPositions(newCurrent, newTarget);
    setCorrectCount(initialCorrectCount);
    setPreviousCount(initialCorrectCount);
    
    console.log('Target (hidden):', newTarget);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (!targetString || !currentString) return;
    
    const newCorrectCount = countCorrectPositions(currentString, targetString);
    setCorrectCount(newCorrectCount);
    
    // Check win condition
    if (newCorrectCount === targetString.length) {
      setIsWinner(true);
      createFireworks();
    }
    
    // Trigger emotion animation
    animateCounterChange(newCorrectCount);
  }, [currentString, targetString]);

  const handleLetterClick = (index: number) => {
    if (isDragging) return;
    
    if (firstSelected === null) {
      setFirstSelected(index);
    } else {
      if (firstSelected === index) {
        setFirstSelected(null);
        return;
      }
      
      swapLetters(firstSelected, index);
      setFirstSelected(null);
    }
  };

  const swapLetters = (index1: number, index2: number) => {
    if (index1 === index2) return;
    
    const lettersArray = currentString.split('');
    [lettersArray[index1], lettersArray[index2]] = [lettersArray[index2], lettersArray[index1]];
    
    // Update the current string
    setCurrentString(lettersArray.join(''));
  };

  // Drag and drop functionality
  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    // Store initial position for determining if this is a drag or a click
    const initialX = e.clientX;
    const initialY = e.clientY;
    let dragStarted = false;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      // If moved more than 5px, it's a drag not a click
      if (!dragStarted && 
          (Math.abs(moveEvent.clientX - initialX) > 5 || 
           Math.abs(moveEvent.clientY - initialY) > 5)) {
        dragStarted = true;
        startDrag(moveEvent, index);
      }
      
      if (dragStarted) {
        setDragPosition({ x: moveEvent.clientX, y: moveEvent.clientY });
      }
    };
    
    const handleMouseUp = (upEvent: MouseEvent) => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      if (dragStarted) {
        endDrag(upEvent);
      } else {
        // It was just a click, not a drag
        handleLetterClick(index);
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const startDrag = (e: MouseEvent, index: number) => {
    setIsDragging(true);
    setDraggedIndex(index);
    setDragPosition({ x: e.clientX, y: e.clientY });
  };
  
  const endDrag = (e: MouseEvent) => {
    if (!isDragging || draggedIndex === null) return;
    
    // Find if we're hovering over another letter
    const letters = document.querySelectorAll(`.${styles.letter}`);
    let targetIndex = null;
    
    for (let i = 0; i < letters.length; i++) {
      if (i === draggedIndex) continue;
      
      const rect = letters[i].getBoundingClientRect();
      if (
        e.clientX >= rect.left && 
        e.clientX <= rect.right && 
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom
      ) {
        targetIndex = i;
        break;
      }
    }
    
    // Clean up drag state
    setIsDragging(false);
    setDraggedIndex(null);
    setDragPosition(null);
    
    // If we found a target, swap letters
    if (targetIndex !== null) {
      swapLetters(draggedIndex, targetIndex);
    }
  };
  
  // Touch handling for mobile
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    const touch = e.touches[0];
    const touchStartX = touch.clientX;
    const touchStartY = touch.clientY;
    let dragStarted = false;
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      moveEvent.preventDefault();
      
      const moveTouch = moveEvent.touches[0];
      
      if (!dragStarted && 
          (Math.abs(moveTouch.clientX - touchStartX) > 5 || 
           Math.abs(moveTouch.clientY - touchStartY) > 5)) {
        dragStarted = true;
        setIsDragging(true);
        setDraggedIndex(index);
      }
      
      if (dragStarted) {
        setDragPosition({ x: moveTouch.clientX, y: moveTouch.clientY });
      }
    };
    
    const handleTouchEnd = (endEvent: TouchEvent) => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      if (dragStarted) {
        const endTouch = endEvent.changedTouches[0];
        
        // Find if we're hovering over another letter
        const letters = document.querySelectorAll(`.${styles.letter}`);
        let targetIndex = null;
        
        for (let i = 0; i < letters.length; i++) {
          if (i === index) continue;
          
          const rect = letters[i].getBoundingClientRect();
          if (
            endTouch.clientX >= rect.left && 
            endTouch.clientX <= rect.right && 
            endTouch.clientY >= rect.top && 
            endTouch.clientY <= rect.bottom
          ) {
            targetIndex = i;
            break;
          }
        }
        
        // Clean up drag state
        setIsDragging(false);
        setDraggedIndex(null);
        setDragPosition(null);
        
        // If we found a target, swap letters
        if (targetIndex !== null && draggedIndex !== null) {
          swapLetters(draggedIndex, targetIndex);
        }
      } else {
        // It was just a tap, not a drag
        handleLetterClick(index);
      }
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  // Animation functions
  const animateCounterChange = (newCount: number) => {
    const diff = newCount - previousCount;
    
    // Show emotions based on count difference
    if (diff === -1) {
      showEmotion('sad');
    } else if (diff <= -2) {
      showEmotion('very-sad');
    } else if (diff === 1) {
      showEmotion('happy');
    } else if (diff >= 2) {
      showEmotion('very-happy');
    }
    
    // Update previous count
    setPreviousCount(newCount);
  };

  const showEmotion = (type: string) => {
    if (!emotionContainerRef.current) return;
    
    if (type === 'sad') {
      const emoji = document.createElement('div');
      emoji.className = styles.sadEmoji;
      emoji.textContent = '😞';
      emoji.style.left = '50%';
      emotionContainerRef.current.appendChild(emoji);
      
      setTimeout(() => emoji.remove(), 2000);
    } 
    else if (type === 'very-sad') {
      const emoji = document.createElement('div');
      emoji.className = styles.verySadEmoji;
      emoji.textContent = '😭';
      emoji.style.left = '50%';
      emotionContainerRef.current.appendChild(emoji);
      
      setTimeout(() => emoji.remove(), 2500);
    } 
    else if (type === 'happy') {
      const explosion = document.createElement('div');
      explosion.className = styles.happyExplosion;
      explosion.style.backgroundColor = '#FFD700';
      emotionContainerRef.current.appendChild(explosion);
      
      setTimeout(() => explosion.remove(), 1500);
    } 
    else if (type === 'very-happy') {
      const burst = document.createElement('div');
      burst.className = styles.happyBurst;
      emotionContainerRef.current.appendChild(burst);
      
      const colors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF'];
      
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = styles.happyParticle;
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 100;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.top = '10px';
        particle.style.left = '50%';
        
        burst.appendChild(particle);
      }
      
      setTimeout(() => burst.remove(), 2000);
    }
  };

  const createFireworks = () => {
    if (typeof document === 'undefined') return;
    
    // Create multiple fireworks
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const firework = document.createElement('div');
        firework.className = styles.firework;
        
        // Random position
        const randomX = Math.random() * window.innerWidth;
        const randomY = Math.random() * window.innerHeight;
        
        firework.style.left = `${randomX}px`;
        firework.style.top = `${randomY}px`;
        firework.style.transform = 'translate(0, 0)';
        
        // Random color
        const colors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        firework.style.boxShadow = `0 0 0 4px ${randomColor}88,
                                     0 0 0 8px ${randomColor}66,
                                     0 0 0 12px ${randomColor}44`;
        
        document.body.appendChild(firework);
        
        // Remove after animation completes
        setTimeout(() => {
          firework.remove();
        }, 800);
      }, i * 200); // Stagger fireworks
    }
  };

  return (
    <>
      <Head>
        <title>Letter Swap Game</title>
        <meta name="description" content="Swap letters to match the hidden word" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className={styles.gameContainer}>
        <h1>Letter Swap Game</h1>
        <p>Swap letters to match the hidden string. The number shows how many letters are correctly positioned.</p>
        
        <div className={styles.stats}>
          Correct positions: <span className={styles.correctCount}>{correctCount}</span>/{targetString.length}
        </div>
        
        <div ref={emotionContainerRef} className={styles.emotionContainer} />
        
        <div className={styles.userString}>
          {currentString.split('').map((letter, index) => (
            <div
              key={`letter-${index}`}
              className={`${styles.letter} ${firstSelected === index ? styles.selected : ''} ${draggedIndex === index && isDragging ? styles.dragging : ''}`}
              onMouseDown={(e) => handleMouseDown(e, index)}
              onTouchStart={(e) => handleTouchStart(e, index)}
            >
              {letter}
            </div>
          ))}
        </div>
        
        <div className={styles.targetString}>
          {targetString.split('').map((letter, index) => (
            <div key={`target-${index}`} className={styles.card}>
              <div className={`${styles.cardInner} ${isWinner ? styles.flipped : ''}`}>
                <div className={styles.cardFront}>?</div>
                <div className={styles.cardBack}>{letter}</div>
              </div>
            </div>
          ))}
        </div>
        
        <button className={styles.newGame} onClick={startNewGame}>
          Reset
        </button>
        
        {isWinner && <div className={styles.winMessage}>Congratulations! You Won!</div>}
        
        {/* Dragging letter element */}
        {isDragging && dragPosition && (
          <div 
            className={styles.dragLetter} 
            style={{
              left: `${dragPosition.x}px`,
              top: `${dragPosition.y}px`
            }}
          >
            {currentString[draggedIndex || 0]}
          </div>
        )}
      </div>
    </>
  );
};
