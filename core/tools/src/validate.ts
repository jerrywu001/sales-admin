
export function checkPhone(phone: string, format = '') {
  if (!phone || !phone.trim()) {
    return `请输入${format}手机号`;
  }

  if (phone.length > 11) {
    return `输入的${format}手机号最多填写11位`;
  }

  const reg = /^1[3-9]\d{9}$/;

  if (!reg.test(phone)) {
    return `${format}手机号格式不正确`;
  }

  return '';
}

export function checkSmsCode(code: string) {
  if (!code || !code.trim()) {
    return '请输入验证码';
  }

  if (code.length > 6) {
    return '验证码最多填写6位数字';
  }

  const reg = /^[0-9]{1,6}$/;

  if (!reg.test(code)) {
    return '验证码必须为数字';
  }

  if (code.length !== 4 && code.length !== 6) {
    return '验证码长度为4位或6位数字';
  }

  return '';
}

export function checkEmail(emailStr: string, format = '') {
  if (!emailStr || !emailStr.trim()) {
    return `请输入${format}邮箱`;
  }

  const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;

  if (!reg.test(emailStr)) {
    return `${format}邮箱格式不正确`;
  }

  return '';
}

export function checkSSNId(id: string, format = '') {
  if (!id || !id.trim()) {
    return `请输入${format}身份证号`;
  }

  if (!isValidID(id)) {
    return `${format}身份证号格式不正确`;
  }

  return '';
}

export function checkPass(pass: string, format = '') {
  if (!pass || !pass.trim()) {
    return `请输入${format}密码`;
  }

  if (pass.length < 6) {
    return `${format}密码最少6位`;
  }

  if (pass.length > 20) {
    return `${format}密码最多20位`;
  }

  const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;

  if (!reg.test(pass)) {
    return `${format}密码必须包含字母和数字`;
  }

  return '';
}

/** 校验小数或整数 */
export function checkNumber(val: string, format: string, digit: number) {
  if (!val || !val.trim()) {
    return `请输入${format}`;
  }

  let decimalRegex: RegExp | null = null;

  // 校验整数
  // 校验小数（包括整数）
  if (digit === 1) {
    decimalRegex = /^\d+(\.\d)?$/;
  } else if (digit === 2) {
    decimalRegex = /^\d+(\.\d\d?)?$/;
  } else if (digit === 3) {
    decimalRegex = /^\d+(\.\d\d?\d?)?$/;
  }

  if (!decimalRegex.test(val)) {
    return `${format}必须是有效的整数或保留${digit}位小数`;
  }

  return '';
}

/** 校验小数或整数 */
export function checkDigit(val: string, format: string) {
  if (!val || !val.trim()) {
    return `请输入${format}`;
  }

  // 整数（可以0开头）
  let decimalRegex = /^\d+$/;

  if (!decimalRegex.test(val)) {
    return `${format}必须是有效的数字`;
  }

  return '';
}

/** 校验整数 */
export function checkInterge(val: string) {
  if (!val || !val.trim()) {
    return '请输入整数';
  }

  if (!/^\d+$/.test(val)) {
    return '请输入有效的整数';
  }

  return '';
}

/** 校验社会信用代码 */
export function checkSCCode(scCode: string, format = '') {
  if (!scCode || !scCode.trim()) {
    return `请输入${format}统一社会信用代码`;
  }

  if (scCode.length !== 18) {
    return `${format}统一社会信用代码长度为18位`;
  }

  return '';
}

export function checkUserNames(name: string, str: string = '用户名称') {
  if (!name || !name.trim()) {
    return `请输入${str}`;
  }

  if (name.length > 20) {
    return '请输入不超过20个字符';
  }

  return '';
}

/** 只能输入正数，小数点后最多保留两位小数 */
export function formatMoney(val) {
  const regex = /^\d+(\.\d{1,2})?$/;

  if (!regex.test(val)) {
    return '请输入正数，并且小数点后不得超过两位';
  }
  return '';
}

export function formatPayNumber(val) {
  val = val.replace(/(^\s*)|(\s*$)/g, '');
  if (!val) {
    return '';
  }
  const reg = /[^\d.]/g;

  // 只能是数字和小数点，不能是其他输入
  val = val.replace(reg, '');
  // 保证第一位只能是数字，不能是点
  val = val.replace(/^\./g, '');
  // 小数只能出现1位
  val = val.replace('.', '$#$').replace(/\./g, '')
    .replace('$#$', '.');
  // 小数点后面保留2位
  val = val.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
  return val;
}

function isValidID(id) {
  // 18位身份证号码正则表达式
  const regex18 = /^[1-9]\d{5}(18|19|20|21|22)?\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|[Xx])$/;

  // 15位老身份证号码正则表达式
  const regex15 = /^[1-9]\d{5}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}$/;

  return regex18.test(id) || regex15.test(id);
}
