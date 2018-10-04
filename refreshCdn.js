const qcloudSDK = require('qcloud-cdn-node-sdk');
qcloudSDK.config({
    secretId: process.env.SECRET_ID,
    secretKey: process.env.SECRET_KEY
})
qcloudSDK.request('RefreshCdnDir', {
    'dirs.0': 'https://blog.trim21.cn/'
}, res => {
    console.log(res)
})