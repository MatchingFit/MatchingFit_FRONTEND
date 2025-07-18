import { useLayoutEffect } from 'react';
import icon from '@/assets/icon.png';
import styles from './Loader.module.css';

const Loader = () => {
  // 로딩 시작, 완료를 알려줌
  // https://aoa.gitbook.io/skymimo/aoa-2018/2018-aria/loading
  useLayoutEffect(() => {
    const loadingStartElement = document.getElementById('loading-start');
    const loadingEndElement = document.getElementById('loading-end');

    if (loadingStartElement) {
      loadingStartElement.innerHTML = '<p class="a11yHidden">로딩중...</p>';
      loadingStartElement.setAttribute('role', 'alert');
    }

    return () => {
      if (loadingStartElement) {
        loadingStartElement.innerHTML = '';
        loadingStartElement.removeAttribute('role');
      }
      if (loadingEndElement) {
        loadingEndElement.innerHTML = '<p class="a11yHidden">로딩완료</p>';
        setTimeout(() => {
          loadingEndElement.innerHTML = '';
        }, 1000);
      }
    };
  }, []);

  return (
    <div className={styles.loader}>
      <img src={icon} className={styles.spinner} alt="" />
    </div>
  );
};

export default Loader;
