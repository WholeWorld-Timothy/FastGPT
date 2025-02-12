import { postUploadImg, postUploadFiles } from '@/web/common/file/api';
import { UploadImgProps } from '@fastgpt/global/common/file/api';
import { BucketNameEnum } from '@fastgpt/global/common/file/constants';
import { preUploadImgProps } from '@fastgpt/global/common/file/api';
import { compressBase64Img, type CompressImgProps } from '@fastgpt/web/common/file/img';

/**
 * upload file to mongo gridfs
 */
export const uploadFiles = ({
  files,
  bucketName,
  metadata = {},
  percentListen
}: {
  files: File[];
  bucketName: `${BucketNameEnum}`;
  metadata?: Record<string, any>;
  percentListen?: (percent: number) => void;
}) => {
  const form = new FormData();
  form.append('metadata', JSON.stringify(metadata));
  form.append('bucketName', bucketName);
  files.forEach((file) => {
    form.append('file', file, encodeURIComponent(file.name));
  });
  return postUploadFiles(form, (e) => {
    if (!e.total) return;

    const percent = Math.round((e.loaded / e.total) * 100);
    percentListen && percentListen(percent);
  });
};

export const getUploadBase64ImgController = (props: CompressImgProps & UploadImgProps) =>
  compressBase64ImgAndUpload({
    maxW: 4000,
    maxH: 4000,
    maxSize: 1024 * 1024 * 5,
    ...props
  });

/**
 * compress image. response base64
 * @param maxSize The max size of the compressed image
 */
export const compressBase64ImgAndUpload = async ({
  base64Img,
  maxW,
  maxH,
  maxSize,
  ...props
}: UploadImgProps & CompressImgProps) => {
  const compressUrl = await compressBase64Img({
    base64Img,
    maxW,
    maxH,
    maxSize
  });

  return postUploadImg({
    ...props,
    base64Img: compressUrl
  });
};

export const compressImgFileAndUpload = async ({
  file,
  ...props
}: preUploadImgProps &
  CompressImgProps & {
    file: File;
  }) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  const base64Img = await new Promise<string>((resolve, reject) => {
    reader.onload = async () => {
      resolve(reader.result as string);
    };
    reader.onerror = (err) => {
      console.log(err);
      reject('Load image error');
    };
  });

  return compressBase64ImgAndUpload({
    base64Img,
    ...props
  });
};
