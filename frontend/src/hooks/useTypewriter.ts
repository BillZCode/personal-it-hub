import { useState, useEffect, useCallback } from 'react';

interface UseTypewriterOptions {
  words: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  delaySpeed?: number;
  loop?: boolean;
}

/**
 * useTypewriter
 * Elite typewriter hook supporting smooth typing, reading delay, backspacing, and hover pause.
 */
export function useTypewriter({
  words,
  typeSpeed = 75,
  deleteSpeed = 38,
  delaySpeed = 4800,
  loop = true,
}: UseTypewriterOptions) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  useEffect(() => {
    if (!words || words.length === 0) return;
    const currentWord = words[wordIndex % words.length];

    if (isPaused) return;

    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (text.length < currentWord.length) {
        // Natural typing cadence
        const naturalVariance = Math.floor(Math.random() * 20) - 10;
        const nextSpeed = Math.max(typeSpeed + naturalVariance, 30);

        timer = setTimeout(() => {
          setText(currentWord.substring(0, text.length + 1));
        }, nextSpeed);
      } else {
        // Word completely typed out
        if (!loop && wordIndex === words.length - 1) {
          return;
        }
        // Reading pause before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, delaySpeed);
      }
    } else {
      if (text.length > 0) {
        // Backspacing
        timer = setTimeout(() => {
          setText(currentWord.substring(0, text.length - 1));
        }, deleteSpeed);
      } else {
        // Finished deleting, move to next word
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words, typeSpeed, deleteSpeed, delaySpeed, loop, isPaused]);

  return {
    text,
    isDeleting,
    isComplete: words.length > 0 && text === words[wordIndex % words.length],
    pause,
    resume,
  };
}

export default useTypewriter;
