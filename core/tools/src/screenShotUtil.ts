import { loadScript } from './loadScript';

type html2canvasFunc = (dom: HTMLElement, param: any) => Promise<HTMLCanvasElement>;

declare const html2canvas: html2canvasFunc;

export class ScreenShot {
  dom: HTMLElement;

  constructor(dom: HTMLElement = document.body) {
    this.dom = dom; // 需要截图的DOM，默认是body
  }

  getBase64String(param: any = {}, type = 'png'): Promise<string> {
    return new Promise<string>((resolve) => {
      html2canvas(this.dom, param).then((canvas: HTMLCanvasElement) => {
        resolve(canvas.toDataURL(`image/${type}`));
      });
    });
  }

  async getImage(param: any = {}, type = 'png') {
    await loadScript('https://cdn.bootcdn.net/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.js', 'screenShot');
    const image = await this.getBase64String(param, type);

    return image;
  }
}
