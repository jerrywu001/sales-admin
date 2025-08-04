function initFaviconIcon() {
  let data = JSON.parse(localStorage.getItem('OEM-KEY'));
  const link = document.querySelector('link[rel="icon"]');
  const hasLogo = data && data.oemBrandDTO && data.oemBrandDTO.urlLogo;

  link.href = hasLogo ? data.oemBrandDTO.urlLogo : 'https://lg-test-1314932667.cos.ap-nanjing.myqcloud.com/pic/2/6008c81aef6548849d3ee15f4337ff89/Maskgroup@2x.png';
}

initFaviconIcon();
