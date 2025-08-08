import { getHostbaseUrl, ISidebarMenu } from '../index';
import { Http } from '../axios-request/Axios';
import { EAxiosResponseCode, getHttpErrorMessage } from '../axios-request/IAxiosRequest';

const hostUrl = getHostbaseUrl();

/**
 * 获取侧边栏菜单列表
 */
export async function querySidebarMenus() {
  let menus: ISidebarMenu[] = [];
  let permissions: string[] = [];

  try {
    const { code, context, message } = await Http.get<{
      menuData: ISidebarMenu[];
      permissions: string[];
    }>(`${hostUrl}/iam/menu/build`, {});

    if (code === EAxiosResponseCode.Succeed) {
      const res = context || {} as {
        menuData: ISidebarMenu[];
        permissions: string[];
      };

      menus = res.menuData || [];
      permissions = res.permissions || [];
    } else if (message) {
      throw new Error(message);
    }
  } catch (error) {
    throw new Error(getHttpErrorMessage(error));
  }

  return {
    menus,
    permissions,
  };
}

/**
 * 获取登录验证码图片
 */
export async function queryIconNames(keyword: string) {
  let rs = [] as string[];

  try {
    const res = await fetch(
      `https://api.iconify.design/search?query=${keyword}&limit=300`, {},
    ).then((r) => r.json());

    rs = res.icons || [];
  } catch (error) {
    throw new Error(getHttpErrorMessage(error));
  }

  return rs;
}

/** 获取行业类别级联树 */
export async function queryIndustryTree() {
  let rs = [] as any[];

  try {
    const { code, context, message } = await Http.post<any[]>(`${hostUrl}/side/sysMcc/listTree`, {});

    if (code === EAxiosResponseCode.Succeed) {
      rs = context || [];
    } else if (message) {
      throw new Error(message);
    }
  } catch (error) {
    throw new Error(getHttpErrorMessage(error));
  }

  return rs;
}

/**
 * 下载文件
 * @param fileUrls 文件url列表，用逗号分隔
 * @param zipName 压缩包名称
 */
export async function downloadFilesByZip(fileUrls: string, zipName: string) {
  let buffer = null as Blob | null;

  try {
    const { code, context, message } = await Http.get<Blob>(
      `${hostUrl}/base/download/zip`,
      {
        fileUrls,
        fileName: zipName,
      },
      { responseType: 'blob' },
    );

    if (code === EAxiosResponseCode.Succeed) {
      buffer = context;
    } else {
      throw new Error(message || '服务器异常，请稍后再试~');
    }
  } catch (error) {
    throw new Error(getHttpErrorMessage(error));
  }

  return buffer;
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

export const ethnicGroups = [
  '汉族',
  '蒙古族',
  '回族',
  '藏族',
  '维吾尔族',
  '苗族',
  '彝族',
  '壮族',
  '布依族',
  '朝鲜族',
  '满族',
  '侗族',
  '瑶族',
  '白族',
  '土家族',
  '哈尼族',
  '哈萨克族',
  '傣族',
  '黎族',
  '傈僳族',
  '佤族',
  '畲族',
  '高山族',
  '拉祜族',
  '水族',
  '东乡族',
  '纳西族',
  '景颇族',
  '柯尔克孜族',
  '土族',
  '达斡尔族',
  '仫佬族',
  '羌族',
  '布朗族',
  '撒拉族',
  '毛南族',
  '仡佬族',
  '锡伯族',
  '阿昌族',
  '普米族',
  '塔吉克族',
  '怒族',
  '乌孜别克族',
  '俄罗斯族',
  '鄂温克族',
  '德昂族',
  '保安族',
  '裕固族',
  '京族',
  '塔塔尔族',
  '独龙族',
  '鄂伦春族',
  '赫哲族',
  '门巴族',
  '珞巴族',
  '基诺族',
] as const;

export type IEthnicGroup = typeof ethnicGroups[number];
