import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import easeInOutQuint from 'common/ease-in-out-quint';
import getRandomInt from 'common/get-random-int';
import useRequestAnimationFrame from 'hooks/use-request-animation-frame';
import React, { useCallback, useEffect, useRef } from 'react';

import styles from './Roulette.module.scss';

type RouletteProps = {
  buttonText: string;
  children: React.ReactNode;
  countTargets: number;
  countLaps?: number;
  duration?: number;
};

const Roulette: React.FC<RouletteProps> = ({ buttonText, countTargets, duration = 3000, countLaps = 3, children }) => {
  const wrapper = useRef<HTMLDivElement>(null);
  const stack = useRef<HTMLDivElement>(null);
  const countChildren = React.Children.count(children);
  const lapDistance = countTargets / countChildren;
  const target = useRef(0);
  const lap = useRef(0);
  const fullDistance = useRef(0);
  const previousPosition = useRef(0);
  const [isStart, startAnimation] = useRequestAnimationFrame({
    duration,
    timingFunction: easeInOutQuint,
    drawFunction: (progress: number): number => {
      const distanceLapsCompleted = lapDistance * lap.current;
      const distanceToGo = fullDistance.current * progress;
      let position = distanceToGo - distanceLapsCompleted + previousPosition.current;

      if (position >= lapDistance) {
        lap.current += 1;
        position = 0;
      }
      if (stack.current == null) {
        throw new Error('stack не определен.');
      }

      stack.current.style.setProperty('--position', `-${position * 100}%`);
      return position;
    },
    endFunction: (position) => {
      if (position != null) {
        previousPosition.current = position;
      }
      lap.current = 0;
    },
  });

  const onClickHandler = useCallback((): void => {
    target.current = getRandomInt(0, countTargets);
    fullDistance.current = (target.current + countChildren * countLaps) / countChildren;
    startAnimation();
  }, [target, countTargets, countChildren, countLaps, fullDistance, startAnimation]);

  useEffect(() => {
    if (wrapper.current == null) {
      throw new Error('wrapper не определен.');
    }
    if (stack.current == null) {
      throw new Error('stack не определен.');
    }

    const childrenGap = 8;
    const height = stack.current.scrollHeight / countChildren - childrenGap;
    wrapper.current.style.setProperty('--height', `${height}px`);
    stack.current.style.setProperty('--position', '0');
    previousPosition.current = 0;
  }, [countChildren]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div ref={wrapper} className={styles.wrapper}>
        <div ref={stack} className={styles.stack}>
          {children}
        </div>
      </div>
      <Button onClick={onClickHandler} disabled={isStart} variant="contained">
        {buttonText}
      </Button>
    </Box>
  );
};

export default Roulette;
export type { RouletteProps };
