import { HttpHandler, StrictRequest } from 'msw';
import { setupWorker } from 'msw/browser';
import * as XLSX from 'xlsx';

const handlers: HttpHandler[] = [];

if (__BUILD_BY_VITE__) {
  const modules: Record<string, any> = import.meta.glob('./modules/**/index.ts', { eager: true });

  for (const v of Object.values(modules)) {
    const mockHandlers = v.default as HttpHandler[];

    handlers.push(...mockHandlers);
  }
} else {
  // @ts-ignore
  const context = require.context('./modules', true, /\.ts$/);

  context.keys().forEach((url) => {
    const res = context(url);
    const mockHandlers = res?.['default'] as HttpHandler[] || [];

    handlers.push(...mockHandlers);
  });
}

const worker = setupWorker(...handlers);

export default worker;

export { handlers };

export function jsonToExcel(jsonData) {
  // 将 JSON 转换为工作表
  const worksheet = XLSX.utils.json_to_sheet(jsonData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // 生成 Excel 文件的 Blob
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'buffer',
  }) as Uint8Array;

  // XLSX.writeFile(workbook, `${parseTime(new Date())}.xlsx`, { compression: true });

  return excelBuffer;
}

export async function resolveUpload<T extends any>(req: StrictRequest<T>) {
  const formData = await req.formData();

  let file: File = null;
  let base64 = '';

  file = formData.get('file') as File;

  if (file) {
    base64 = await getImageBase64(file);
  } else {
    base64 = 'https://picx.zhimg.com/v2-1e843c3ffe61510b3137cbe65c8843be_1440w.jpg';
  }

  return {
    file,
    base64,
  };
}

export function getImageBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      resolve(reader.result as string);
    };

    reader.onerror = () => {
      resolve('');
    };
  });
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log('mock file reloaded');
  });
}
