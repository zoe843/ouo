import type { CSSProperties } from "react";
import styles from "./FallingPetals.module.css";

// Fixed variations keep the first render stable and the breeze irregular.
const PETALS = [
  { left: 5, size: 12, fall: 29, sway: 6.2, turn: 8, delay: -7, opacity: .48, drift: 26 },
  { left: 15, size: 8, fall: 37, sway: 7.8, turn: 9, delay: -24, opacity: .32, drift: -18 },
  { left: 27, size: 10, fall: 33, sway: 6.8, turn: 7, delay: -14, opacity: .4, drift: 30 },
  { left: 38, size: 7, fall: 41, sway: 8.4, turn: 10, delay: -31, opacity: .28, drift: -22 },
  { left: 47, size: 11, fall: 35, sway: 7.2, turn: 8, delay: -3, opacity: .38, drift: 24 },
  { left: 57, size: 8, fall: 38, sway: 8.2, turn: 11, delay: -19, opacity: .3, drift: -28 },
  { left: 68, size: 13, fall: 31, sway: 6.4, turn: 9, delay: -25, opacity: .46, drift: 20 },
  { left: 78, size: 7, fall: 43, sway: 9.2, turn: 12, delay: -11, opacity: .28, drift: -24 },
  { left: 88, size: 10, fall: 34, sway: 7.6, turn: 8, delay: -17, opacity: .4, drift: 28 },
  { left: 96, size: 8, fall: 39, sway: 8.8, turn: 10, delay: -33, opacity: .32, drift: -18 },
];

export default function FallingPetals() {
  return (
    <div className={styles.field} aria-hidden="true">
      {PETALS.map((petal, index) => (
        <span
          key={petal.left}
          className={styles.fall}
          style={{
            left: `${petal.left}%`,
            "--size": `${petal.size}px`,
            "--fall": `${petal.fall}s`,
            "--sway": `${petal.sway}s`,
            "--turn": `${petal.turn}s`,
            "--delay": `${petal.delay}s`,
            "--opacity": petal.opacity,
            "--drift": `${petal.drift}px`,
            "--phase": `${-index * 1.7}s`,
          } as CSSProperties}
        >
          <span className={styles.sway}><span className={styles.petal} /></span>
        </span>
      ))}
    </div>
  );
}
