import dayjs from 'dayjs';

export type ITimeRanger = [string, string] | [];

/**
 * 将键值对转换成对象格式
 * @param { string } cookie [key=value;key=value...] 格式的字符串
 */
export function parseCookie<T = any>(cookie: string): T {
  return cookie
    .split(';')
    .filter(Boolean)
    .reduce<T>((result, value) => {
      const [key, val] = value.split('=').map((txt) => txt.trim());

      if (val) {
        result[key] = decodeURIComponent(val);
      }
      return result;
    }, {} as T);
}

/**
 * 解析 url 参数转换成 { [key]: value } 格式
 * @description 特殊场景  ?a=/somePath?ttt=4%26someParam=haha&type=12  ->  { a: '/somePath?ttt=4&someParam=haha', type: '12' }
 * @param { string } queryString 以 ? 开头的字符串
 */
export function parseQueryString<T>(queryString = `?${window.location.href.split('?')[1]}`): T {
  if (queryString.startsWith('?')) {
    const result = {} as T;
    const queryValue = queryString.substring(1);
    const paramArray = queryValue.split('&');

    paramArray.forEach((str) => {
      const splitIdx = str.indexOf('='); // 取第一个 =
      const key = str.substring(0, splitIdx);
      const value = str.substring(splitIdx + 1);

      result[key] = decodeURIComponent(value);
    });
    return result;
  }
  return {} as T;
}

/**
 * json 转换成 '?a=...&b=...&c=...' 格式
 */
export function parseJsonToQueryString<T>(json: T): string {
  return Object.entries(json)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}

/**
 * 手机号码加****
 * 13851861590 -> 138****1590
 */
export const fuzzyMobile = (mobile = ''): string => {
  const reg = /(\d{3})\d{4}(\d{4})/;

  mobile = typeof mobile !== 'string' ? '' : mobile;
  return mobile.replace(reg, '$1****$2');
};

/**
 * 数值转百分比
 * 这里需要先用Number进行数据类型转换，然后去指定截取转换后的小数点后几位(按照四舍五入)，这里是截取一位，0.1266转换后会变成12.7%
 */
export const toPercent = (point: number) => {
  let str = Number(point * 100).toFixed(1);

  str += '%';
  return str;
};

/**
 * 去除文本中的非数字字符
 */
export function getNumberStrFromChars(str = '', canStartsWithZero = false) {
  let result = str.replace(/[^\d]/g, '');

  if (!canStartsWithZero && result.startsWith('0')) {
    result = result.substring(1);
  }
  return result;
}

export function getHostbaseUrl(): string {
  if (__ENABLE_DEV_MOCK__ || __MOCK_PROD__) {
    return `${location.protocol}//${location.hostname}:${location.port || 80}/mock`;
  }

  if (!__ENV_DEV__) {
    return `${location.protocol}//${__PROD__HOST_API__}`;
  }

  return `${location.protocol}//${location.hostname}:${location.port}`;
}

export function logEnvInfo() {
  const red = (str) => {
    console.log(`%c${str}`, 'color: red');
  };

  const blue = (str) => {
    console.log(`%c${str}`, 'color: blue');
  };

  blue(`本地开发环境？ ${__ENV_DEV__ ? '是' : '否'}，版本：${__VERSION__}，最后构建时间：${__BUILDDATE__}`);

  red(`接口HOST：${getHostbaseUrl()}`);

  if (__ENABLE_DEV_MOCK__ || __MOCK_PROD__) red('当前环境已开启mock服务');
}

export function copyToClipboard(text: string) {
  const textarea = document.createElement('textarea');

  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

export function getDateString(date?: Date | dayjs.Dayjs, format = 'YYYY-MM-DD') {
  return date ? dayjs(date).format(format) : undefined;
}

export function isNull(val: any) {
  return val === null || val === undefined || val === '';
}

export function groupBy<T>(array: T[], key: string): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = item[key];

    if (!result[groupKey]) {
      result[groupKey] = [];
    }

    result[groupKey].push(item);

    return result;
  }, {});
}

export function downloadFile(blob: Blob, name?: string, suffix?: string) {
  const hasCustomSuffix = !!suffix;
  const theName = name || parseTime(new Date());
  const theSuffix = hasCustomSuffix ? `.${suffix}` : '';

  const link = document.createElement('a');

  link.href = window.URL.createObjectURL(blob);
  link.download = theName + theSuffix;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// 下载文件zip
export function downloadZipFile(obj, name) {
  const url = window.URL.createObjectURL(new Blob([obj], { type: 'application/zip' }));

  const link = document.createElement('a');

  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function downloadImage(imageUrl: string) {
  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`图片下载失败: ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = blobUrl;
    link.target = '_blank';
    link.download = '';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('图片下载失败:', error);
  }
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat = '{y}-{m}-{d} {h}:{i}:{s}') {
  if (arguments.length === 0) {
    return null;
  }

  const format = cFormat;
  let date: Date = null;

  if (typeof time === 'undefined' || time === null || time === 'null') {
    return '';
  }

  if (typeof time === 'object') {
    date = time;
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = Number.parseInt(time);
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time *= 1000;
    }
    date = new Date(time);
  }

  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };

  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];

    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }

    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }

    return value || 0;
  });

  return time_str;
}

export function getExplorer(): {
  type: string;
  v: number | null;
} {
  const Sys = {} as any;
  const ua = navigator.userAgent.toLowerCase();
  let s: RegExpMatchArray | null = null;

  (s = ua.match(/rv:([\d.]+)\) like gecko/))
    ? Sys.ie = s[1] :
    (s = ua.match(/msie ([\d.]+)/))
      ? Sys.ie = s[1] :
      (s = ua.match(/edge\/([\d.]+)/))
        ? Sys.edge = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/))
          ? Sys.firefox = s[1] :
          (s = ua.match(/(?:opera|opr).([\d.]+)/))
            ? Sys.opera = s[1] :
            (s = ua.match(/chrome\/([\d.]+)/))
              ? Sys.chrome = s[1] :
              (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

  if (Sys.ie) {
    return {
      type: 'ie',
      v: Sys.ie,
    };
  }

  if (Sys.edge) {
    return {
      type: 'edge',
      v: Sys.edge,
    };
  }

  if (Sys.firefox) {
    return {
      type: 'firefox',
      v: Sys.firefox,
    };
  }

  if (Sys.chrome) {
    return {
      type: 'chrome',
      v: Sys.chrome,
    };
  }

  if (Sys.opera) {
    return {
      type: 'opera',
      v: Sys.opera,
    };
  }

  if (Sys.safari) {
    return {
      type: 'safari',
      v: Sys.safari,
    };
  }

  return {
    type: 'unknow',
    v: null,
  };
}

export const imageTypeStrs = '.jpg,.png,.jpeg,.bmp,.gif';
export const officeFileTypes = ['pdf', 'xlsx', 'docx', 'pptx', 'xls'];

export const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/bmp'];

export function toElScrollTop(scrollClassName = '.el-scrollbar__wrap') {
  const container = document.querySelector('.main-content');
  const elScrollDom = container.querySelector(scrollClassName);

  if (!elScrollDom) return;

  setTimeout(() => {
    elScrollDom?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, 380);
}

export function scrollToErrorField(el: HTMLDivElement, scrollClassName = '.el-scrollbar__wrap', targetClassName = '.is-error') {
  if (!el) return;

  const elScrollDom = el.closest(scrollClassName);

  const targetDiv = elScrollDom.querySelector(targetClassName);
  const rect = targetDiv.getBoundingClientRect();
  const scrollableRect = elScrollDom.getBoundingClientRect();
  const targetPosition = rect.top - scrollableRect.top + elScrollDom.scrollTop;

  if (targetDiv) {
    elScrollDom.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
    return;
  }

  elScrollDom.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

export function getDisabledDate() {
  return (date) => {
    if (date && date > new Date()) {
      return true;
    }

    return false;
  };
}

export function getRangeDates(dateStrings: ITimeRanger | []) {
  return dateStrings.map((str, index) => {
    return `${str} ${index === 0 ? '00:00:00' : '23:59:59'}`;
  });
}

export function getFileExt(url: string) {
  return url ? url.substring(url.lastIndexOf('.') + 1) : '';
}

export function changeTimeToFormat(str: string) {
  let newStr = '';

  for (let i = 0; i < str.length; i++) {
    if (i === 3 || i === 5) {
      newStr = newStr + str[i] + '-';
    } else {
      newStr += str[i];
    }
  }
  return newStr;
}

/** 20200514 - > 2020-05-14 */
export function changeFormatToDate(str: string) {
  return !str || str.includes('-') ? str : str.replace(/(.{4})(.{2})/, '$1-$2-');
}

export function getCosFileName(cosUrl?: string) {
  const p = cosUrl.substring(cosUrl.lastIndexOf('/')).substring(cosUrl.substring(cosUrl.lastIndexOf('/')).indexOf('-'), cosUrl.length) || '';

  return cosUrl ? p.slice(1) : '';
}

/**
 * @function 获取树形结构数据所有子节点id
 *
 */

export function getAllChildrenIds(treeData) {
  let ids = [];

  for (let v of treeData) {
    if (!v.children || v.children.length <= 0) {
      ids = ids.concat([v.menuId]);
    } else {
      ids = ids.concat(getAllChildrenIds(v.children));
    }
  }
  return ids;
}

/**
 * @function 求两个数组之间的交集
 */

export function getArrayIntersection(arr, arr2) {
  return arr2.filter((v) => new Set(arr).has(v));
}

/**
 * @function 格式化默认选中树形结构数据
*/

export function formatTreeData(arr, arr2) {
  if (!arr || arr.length === 0) {
    return [];
  }
  return getArrayIntersection(arr, getAllChildrenIds(arr2));
}

/**
 * @function 递归查询树形结构总节点数
*/

export function getTreeDataCount(treeData) {
  let count = 0;

  function recursiveCount(arr) {
    arr.forEach((node) => {
      count++;
      if (node.children && node.children.length > 0) {
        recursiveCount(node.children);
      }
    });
  }
  recursiveCount(treeData);
  return count;
}

export function getPathByRouteName(routeName: string) {
  return `/${routeName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;
}

export function getDivRealHeight(div: HTMLDivElement) {
  const style = window.getComputedStyle(div);

  if (style.display === 'none' || Number.parseInt(style.height) === 0) return 0;

  const height = div.offsetHeight; // 包括 padding 和 border，但不包括 margin

  const marginTop = Number.parseFloat(style.marginTop);
  const marginBottom = Number.parseFloat(style.marginBottom);

  const totalHeight = height + marginTop + marginBottom;

  return totalHeight;
}

export function getDivContentHeight(div: HTMLDivElement) {
  const style = window.getComputedStyle(div);

  if (style.display === 'none' || Number.parseInt(style.height) === 0) return 0;

  const paddingTop = Number.parseFloat(style.paddingTop);
  const paddingBottom = Number.parseFloat(style.paddingBottom);

  return div.clientHeight - paddingTop - paddingBottom;
}

/**
 * @function 格式化数字
 * @param str 输入值
 * @param n 保留小数位数
*/
export function formatNumber(str: string, n = 2) {
  if (n === 0) {
    return String(str).replace(/^([0-9+]\d*)?.*$/, '$1')
      .replace(/^0(\d{1,})?$/, '$1');

  }

  return String(str).replace(new RegExp(`^([0-9+]\\d*\\.?\\d{0,${n}})?.*$`), '$1')
    .replace(new RegExp(`^0(\\d{1,})(\\.\\d{0,${n}})?$`), '$1$2');
}

/**
 * @function 合并表格列
 * @param {Array} list 表格数据
 * @param {String} sign 合并标识
 */
export function mergeTableColumns(list, sign: string, sign1?: string) {
  let colArr = [];
  let position = 0;

  list.forEach((item, index) => {
    if (index === 0) {
      colArr.push(1);
      position = 0;
    } else {
      if (sign1) {
        // 判断当前元素与上一个元素是否相同
        if (item[sign] === list[index - 1][sign] && item[sign1] === list[index - 1][sign1]) {
          colArr[position] += 1;
          colArr.push(0);
        } else {
          colArr.push(1);
          position = index;
        }
      } else {
        // 判断当前元素与上一个元素是否相同
        if (item[sign] === list[index - 1][sign]) {
          colArr[position] += 1;
          colArr.push(0);
        } else {
          colArr.push(1);
          position = index;
        }
      }

    }
  });

  return {
    colArr,
    position,
  };
}

export function imageToBase64(url: string) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.crossOrigin = 'Anonymous'; // 处理跨域问题
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL(); // 转换为 Base64

      resolve(dataURL);
    };
    img.onerror = function(err) {
      reject(err);
    };
    img.src = url;
  });
}

/**
 * @function 获取EchatsY轴最大值
*/
export function calMax(arr) {
  const max = Math.max.apply(null, arr); // 获取最大值方法
  const maxint = Math.ceil(max / 5); // 向上以5的倍数取整
  const maxval = maxint * 5 + 5; // 最终设置的最大值

  return maxval; // 输出最大值
}

/**
 * @function 获取EchatsY轴最小值
*/
export function calMin(arr) {
  const min = Math.min.apply(null, arr); // 获取最小值方法
  const minint = Math.ceil(min / 1); // 向下以1的倍数取整
  const minval = minint * 1 - 5; // 最终设置的最小值

  return minval; // 输出最小值
}

/**
 * @function 格式化数字
 * @param num 输入值
 * @param [under=0] 指定小于值默认为0
 * @param [outweigh=100] 指定大于值默认为100
*/
export function processNumberInRange(num, under = 0, outweigh = 100, underEqual = true) {
  let numValue = Number.parseFloat(num);

  if (underEqual) {
    if (Number.isNaN(numValue) || numValue < under || numValue >= outweigh) {
      return '';
    }
  } else {
    if (Number.isNaN(numValue) || numValue <= under || numValue >= outweigh) {
      return '';
    }
  }

  return formatNumber(num);
}

export function imageFileToBase64(file: File) {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64 = reader.result;

      resolve(base64 as string);
    };

    reader.onerror = () => {
      resolve('');
    };

    reader.onabort = () => {
      resolve('');
    };
  });
}

export function imageBase64ToFile(base64: string) {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*)/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;

  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], 'image.png', { type: mime });
}

/**
 * 格式化金额, 保留3位小数
 * @param cash 金额
 * @returns 格式化后的金额
 */
export function formatCountValue(cash: number, parseFloat = true) {
  if (cash < 10000) {
    return {
      value: cash,
      unit: '',
    };
  }

  // 存在亿单位
  if (cash >= 100000000) {
    const val = (cash / 100000000).toFixed(parseFloat ? 3 : 0);

    // 小数点后两位是000，则不显示小数点
    if (val.endsWith('000')) {
      return {
        value: val.slice(0, -4),
        unit: '亿',
      };
    }

    return {
      value: val,
      unit: '亿',
    };
  }

  const val = (cash / 10000).toFixed(parseFloat ? 3 : 0);

  // 小数点后两位是00，则不显示小数点
  if (val.endsWith('00')) {
    return {
      value: val.slice(0, -4),
      unit: '万',
    };
  }

  return {
    value: val,
    unit: '万',
  };
}

/**
 * 深度比较两个对象，忽略指定键
 * @param obj1 对象1
 * @param obj2 对象2
 * @param excludeKeys 需要忽略的键
 * @returns 是否相等
 *
 * 使用示例
 * const obj1 = { a: 1, b: 2, c: { d: 3 }};
 * const obj2 = { a: 1, c: { d: 3 }};
 * 忽略 "b" 字段
 * console.log(deepEqual(obj1, obj2, ['b'])); // true（自动过滤b字段差异）
 */
export function deepEqualField(field1, field2, excludeKeys = []) {
  if (field1 === field2) return true;

  if (typeof field1 !== 'object' || field1 === null ||
    typeof field2 !== 'object' || field2 === null) return false;

  // 数组处理（不应用 excludeKeys）
  if (Array.isArray(field1)) {
    if (!Array.isArray(field2) || field1.length !== field2.length) return false;
    for (let i = 0; i < field1.length; i++) {
      if (!deepEqualField(field1[i], field2[i], excludeKeys)) return false;
    }
    return true;
  }

  // 对象处理：过滤需忽略的键
  const filteredKeys = (key) => !excludeKeys.includes(key);
  const field1Keys = Object.keys(field1).filter(filteredKeys);
  const field2Keys = Object.keys(field2).filter(filteredKeys);

  if (field1Keys.length !== field2Keys.length) return false;

  for (const key of field1Keys) {
    if (!field2.hasOwnProperty(key)) return false;
    if (!deepEqualField(field1[key], field2[key], excludeKeys)) return false;
  }

  return true;
}

/**
 * 移除字符串中的关键字
 * @param {string} input 输入的字符串
 * @param {string|string[]} keywords 要移除的关键字，可以是单个字符串或字符串数组
 * @param {boolean} caseSensitive 是否区分大小写，默认为 true
 * @param {number} maxLength 最大字符长度，默认为 15
 * @returns {string} 移除关键字后的字符串
 */
export function removeKeywords(input: string, keywords: string | string[], caseSensitive: boolean = true, maxLength: number = 15) {
  // 参数验证
  if (!input || typeof input !== 'string') {
    return '';
  }

  if (!keywords) {
    return input.length > maxLength ? input.slice(0, maxLength) : input;
  }

  // 将单个关键字转换为数组
  const keywordArray = Array.isArray(keywords) ? keywords : [keywords];

  // 过滤空关键字
  const validKeywords = keywordArray.filter((k) => k && typeof k === 'string');

  if (validKeywords.length === 0) {
    return input.length > maxLength ? input.slice(0, maxLength) : input;
  }

  // 构建正则表达式
  const escapedKeywords = validKeywords.map((k) =>
    k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), // 转义特殊字符
  );

  const pattern = escapedKeywords.join('|');
  const flags = caseSensitive ? 'g' : 'gi';
  const regex = new RegExp(pattern, flags);

  // 移除关键字
  const result = input.replace(regex, '');

  // 根据长度限制返回结果
  return result.length > maxLength ? result.slice(0, maxLength) : result;
}

/**
 * 获取当前年月日的 并且以20250208这样的格式
 * @returns 当前年月日的 并且以20250208这样的格式
 */
export function getCurrentDate() {
  return dayjs().format('YYYYMMDD');
}

export function getHighlightHtml(searchText: string, content: string) {
  const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedText})`, 'gi');

  const matches = content.match(regex);

  if (matches) {
    return content.replace(regex, '<span class="sys-highlight">$1</span>');
  }

  return null;
}

export function processCardNumber(cardNumber: string) {
  const parts = cardNumber.match(/.{1,4}/g); // 分割成每4位一组
  const formattedCardNumber = parts.join(' '); // 使用空格或其他分隔符连接起来

  return formattedCardNumber;
}

export function getH5BaseUrl() {
  switch (getHostbaseUrl()) {
    /** 测试 */
    case 'https://getway.upfreework.com':
      return 'https://acc-h5.upfreework.com';
    /** UAT */
    case 'https://gateway-uat.upfreework.com':
      return 'https://acc-uat-h5.upfreework.com';
    /** 101 */
    case 'http://218.94.156.194:5001':
      return 'http://192.168.2.101:5002';
    case 'http://192.168.2.101:5001':
      return 'http://192.168.2.101:5002';
    /** 生产 */
    case 'https://getway.ninghuoban.com':
      return 'https://h5.ninghuoban.com';
    /** 其他*/
    default:
      return 'https://acc-h5.upfreework.com';
  }
}

/**
 * 长期时间格式
 * @description 这边顺序不要改
 * @default 2999-12-31
 */
export const longTimeValues = [
  '9999-12-31',
  '99991231',
  '2999-12-31',
  '29991231',
];
