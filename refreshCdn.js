const qcloudSDK = require('qcloud-cdn-node-sdk');

qcloudSDK.config({
  secretId: process.env.COS_SECRET_ID,
  secretKey: process.env.COS_SECRET_KEY
});

qcloudSDK.request('RefreshCdnUrl', {
  'urls.0': 'https://blog.trim21.cn/'
}, res => {
  console.log(res);
  console.log('refresh cdn index')
});
