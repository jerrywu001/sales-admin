/**
* 异步加载 Css
* @param styleUrl
* resolve(true) 加载成功
* reject(error) 加载失败(error 需要用try/catch去捕获)
*/
export default function loadStyle(styleUrl: string, id: string) {
  return new Promise<boolean>((resolve, reject) => {
    console.log(`[system] loadStyle: 准备加载 "${styleUrl}"`);
    if (document.getElementById(id)) {
      resolve(true);
    } else {
      const styleElement = document.createElement('link');

      styleElement.id = id;
      styleElement.rel = 'stylesheet';
      styleElement.href = styleUrl;
      styleElement.onload = () => {
        console.log(`[system] loadStyle: "${styleUrl}" 加载成功`);
        resolve(true);
      };
      styleElement.onerror = (error) => {
        console.error(`[system] loadStyle: "${styleUrl}" 加载失败`);
        reject(error);
      };
      document.head.appendChild(styleElement);
    }
  });
}
