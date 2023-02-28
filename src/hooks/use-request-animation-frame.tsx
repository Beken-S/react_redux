import { useEffect, useRef, useState } from 'react';

type DrawParameters<T> = T;

type UseRequestAnimationFrameOptions<T = any> = {
  duration: number;
  timingFunction: (x: number) => number;
  drawFunction: (progress: number) => DrawParameters<T> | undefined;
  endFunction?: (parameters?: DrawParameters<T>) => void;
};

function useRequestAnimationFrame<T>({
  duration,
  timingFunction,
  drawFunction,
  endFunction,
}: UseRequestAnimationFrameOptions<T>): [boolean, () => void] {
  const [isStart, setIsStart] = useState(false);
  const previousTimeRef = useRef(0);

  const startAnimation = () => setIsStart(true);

  useEffect(() => {
    if (isStart) {
      requestAnimationFrame(function animate(time) {
        if (previousTimeRef.current === 0) {
          previousTimeRef.current = time;
        }

        let timeFraction = (time - previousTimeRef.current) / duration;
        if (timeFraction > 1) timeFraction = 1;

        let progress = timingFunction(timeFraction);
        let parameters = drawFunction(progress);

        if (timeFraction < 1) {
          requestAnimationFrame(animate);
        } else {
          if (endFunction != null) {
            endFunction(parameters);
          }
          previousTimeRef.current = 0;
          setIsStart(false);
        }
      });
    }

    return () => cancelAnimationFrame(previousTimeRef.current);
  }, [isStart, setIsStart, duration, timingFunction, drawFunction, endFunction]);

  return [isStart, startAnimation];
}

export default useRequestAnimationFrame;
export type { UseRequestAnimationFrameOptions, DrawParameters };
