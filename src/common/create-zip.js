/**
 * @file 创建压缩包
 * @author wuya
 */

import JSZip from 'jszip';
import FileSaver from 'file-saver';

import JSZipUtils from './jszip-utils';
/**
 * 下载文件脚手架文件
 * @param {string} url - 文件路径
 */
function urlToPromise(url) {
  return new Promise(function(resolve, reject) {
    JSZipUtils.getBinaryContent(url, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * 生成 Zip 并下载
 * @param {Array} components 
 * @param {string} code 
 * @param {strin} name 
 */
export default function createZip(code) {
  const zipUrl = './lib/example.zip';
  urlToPromise(zipUrl)
    .then((data) => {
      return JSZip.loadAsync(data);
    })
    .then((file) => {
      console.log(file);
      file.folder('src').folder('routes').file('Index.js', code);
      // 生成 zip 包
      file.generateAsync({ type: 'blob' }).then(function(content) {
        // see FileSaver.js
        FileSaver.saveAs(content, 'example.zip');
      });
    });
}
