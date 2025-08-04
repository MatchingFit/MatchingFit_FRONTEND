import styles from './Option.module.css';

type OptionProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: string;
};

const Option = ({ children, ...props }: OptionProps) => {
  return (
    <button type="button" className={styles.button} {...props}>
      {children}
    </button>
  );
};

export default Option;
