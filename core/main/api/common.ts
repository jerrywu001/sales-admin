import { getHostbaseUrl } from '@core/tools';

export const UploadImageUrls = {
  license: getHostbaseUrl() + '/base/upload/business/license/pic',
  idNoFront: getHostbaseUrl() + '/base/upload/idNo/front/pic',
  idNoBack: getHostbaseUrl() + '/base/upload/idNo/back/pic',
  bankCard: getHostbaseUrl() + '/base/upload/bank-card',
  normal: getHostbaseUrl() + '/base/upload/pic',
};

export const UploadFileUrls = {
  normal: getHostbaseUrl() + '/base/upload/uploadFile',
  batch: getHostbaseUrl() + '/base/upload/batch-upload',
};
