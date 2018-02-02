/**
 * @file 创建压缩包
 * @author ltaoo<litaowork@aliyun.com>
 */

import JSZip from 'jszip';
import FileSaver from 'file-saver';

import getIndexPageCode from './create-page';
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

export default function createZip(components, code) {
    const zip = new JSZip();
    const source = getIndexPageCode(components, code);
    // / folder
    const rootDir = '/template';
    const webpackConfigJs = 'webpack.config.js';
    zip.file(webpackConfigJs, urlToPromise(`${rootDir}/${webpackConfigJs}`), {
      binary: true,
    });
    const babelrcFile = 'babelrc';
    zip.file(`.${babelrcFile}`, urlToPromise(`${rootDir}/${babelrcFile}`), {
      binary: true,
    });
    const packageFile = 'package.json';
    zip.file(packageFile, urlToPromise(`${rootDir}/${packageFile}`), {
      binary: true,
    });
    const gitignoreFile = 'gitignore';
    zip.file(`.${gitignoreFile}`, urlToPromise(`${rootDir}/${gitignoreFile}`), {
      binary: true,
    });
    // src folder
    const srcDir = '/template/src';
    zip.folder('src');
    const srcFolder = zip.folder('src');
    srcFolder.file('index.js', urlToPromise(`${srcDir}/index.js`), {
      binary: true,
    });
    srcFolder.file('index.html', urlToPromise(`${srcDir}/index.html`), {
      binary: true,
    });
    // src/routes
    const routesFolder = srcFolder.folder('routes');
    routesFolder.file('IndexPage.js', source);
    routesFolder.file(
      'IndexPage.css',
      urlToPromise(`${srcDir}/routes/IndexPage.css`),
      { binary: true },
    );
    zip.generateAsync({ type: 'blob' }).then(function(content) {
      // see FileSaver.js
      FileSaver.saveAs(content, 'example.zip');
    });
}
