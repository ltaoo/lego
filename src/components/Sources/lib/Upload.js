import { Upload } from 'antd';

import getButtonInstance from './Button';
import layout from './fieldLayout';

export default function getUploadInstance(params = {}) {
  const { uuid } = params;

  const buttonUuid = uuid + 1;
  return {
    Component: Upload,
    label: 'Upload',
    import: 'Upload',
    // 表单用字段
    field: {
      label: '上传文件',
      id: 'files',
      rules: [{
        required: true,
        messsage: '请填写活动名称',
      }],
      ...layout,
    },
    children: [
      {
        uuid: buttonUuid,
        ...getButtonInstance({ uuid: buttonUuid, text: 'upload', type: 'default' }),
      },
    ],
    props: {
      name: 'files',
      action: '//jsonplaceholder.typicode.com/posts/',
    },
  };
}
