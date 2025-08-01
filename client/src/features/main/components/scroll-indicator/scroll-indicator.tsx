import { CircleArrowDown } from 'lucide-react';
import styles from './scroll-indicator.module.scss';

const ScrollIndicator = () => (
  <div className={styles.scrollWrapper}>
    <p className={styles.scrollText}>Scroll for more</p>
    <CircleArrowDown color="white" />
  </div>
);

export default ScrollIndicator;
