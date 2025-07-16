const validateName = (value: string): string[] => {
  const errors: string[] = [];

  if (value.length === 0) return errors;

  if (/[^a-zA-Zㄱ-ㅎ가-힣\s]/.test(value)) {
    errors.push('이름은 한글 또는 영문만 입력해주세요.');
  }

  if (value.length < 2) {
    errors.push('이름은 2자 이상 입력해주세요.');
  } else if (value.length > 10) {
    errors.push('이름은 10자 이하로 입력해주세요.');
  }

  return errors;
};

const validateEmail = (value: string): string[] => {
  const errors: string[] = [];

  if (value.length === 0) return errors;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    errors.push('이메일 양식을 확인해주세요.');
  }

  return errors;
};

const validatePassword = (value: string): string[] => {
  const errors: string[] = [];

  if (value.length === 0) return errors;

  if (value.length < 10) {
    errors.push('10자 이상 입력해주세요.');
  }

  const hasLetter = /[a-zA-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[^a-zA-Z0-9]/.test(value);

  const typesIncluded = [hasLetter, hasNumber, hasSpecial].filter(
    Boolean,
  ).length;

  if (typesIncluded < 2) {
    errors.push('영문/숫자/특수문자 중 2가지 이상을 조합해주세요.');
  }

  return errors;
};

const validateConfirmPassword = (value: string, password: string): string[] => {
  const errors: string[] = [];

  if (value.length === 0) return errors;

  if (value !== password) {
    errors.push('비밀번호가 일치하지 않습니다.');
  }

  return errors;
};

export {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
};
