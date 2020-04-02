import XHR from "./xhr";
import createUrl from './createUrl';
import config from '../config';

export default function upload(fileOrFileList, editor) {
  if (!(fileOrFileList instanceof File) && !(fileOrFileList instanceof FileList)) {
    throw new Error('请提供File或者FileList的实例进行上传');
  }
  let xhr = new XHR();
  let formData = new FormData();
  let uploadPath = config.uploadPath; // 用户自定义的完整上传路径
  let query = config.uploadQuery; // 用户自定义查询参数
  let promise = new Promise((resolve, reject) => {
    xhr.onSuccess((res) => {
      editor.message('success', '上传成功');
      resolve(res);
    });
    xhr.onFail((res) => {
      editor.message('error', '上传失败');
      reject(res);
    });
    xhr.onTimeout((res) => {
      editor.message('error', '上传超时...');
    });
  }).catch((reason) => {
    console.error('catch in promise: ', reason);
  });
  
  // 将文件添加到formData
  if (fileOrFileList instanceof File) {
    formData.append(fileOrFileList.name, fileOrFileList);
  } else {
    Array.prototype.slice.call(fileOrFileList, 0).forEach(file => {
      formData.append(file.name, file);
    });
  }
  // 创建请求的url
  uploadPath = createUrl(uploadPath, query);
  
  xhr.open('POST', uploadPath);
  xhr.send(formData);
  
  return promise;
};
