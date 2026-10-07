import { useState } from 'react';
import styles from './Header.module.scss';

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

export function Header() {
  const [today] = useState(() => dateFormatter.format(new Date()));

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>My Todos</h1>
      <p className={styles.date}>{today}</p>
    </header>
  );
}
