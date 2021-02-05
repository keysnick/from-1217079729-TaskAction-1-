/*
github：https://github.com/ZhiYi-N/script
boxjs：https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/ZhiYi-N.boxjs.json
转载留个名字，谢谢
邀请码：1980436898
我的--输入邀请码，立得一元，直接提现，谢谢
作者：执意ZhiYi-N
目前包含：
签到
开首页宝箱
读文章30篇（具体效果自测）
开农场宝箱
农场浇水
done 农场离线奖励(农场宝箱开完后，需要进农场再运行脚本才能开，有点问题)
##通过农场浇水激活上线，达到获取理想奖励目的，目前测试每天的离线奖励足够开启农场5个宝箱，不需要做其他任务，具体情况看后期是否需要，再添加除虫，开地，施肥，三餐奖励以及农场签到活动
20点睡觉，获取完全后（3600）或睡觉12小时，自动醒来（防止封号）
done自动收取睡觉金币action异常
##请重新获取signkey，目前已经修复(signkey)都要用Accept-Encoding开头
脚本初成，非专业人士制作，欢迎指正
#右上角签到即可获取签到cookie
#进一次农场即可获取农场cookie
#读文章弹出金币获取读文章cookie

action会出问题依旧，我一个停止睡觉不收金币，一个收金币不停止睡觉
可以在代理工具每天8点cron运行一下，确保万无一失
ACTION YML
JRTTSIGNURL-signurl
JRTTSIGNKEY-signkey（以x-tt-trace-id开头）
JRTTFARMURL-farmurl
JRTTFARMKEY-farmkey
JRTTREADURL-readurl
JRTTREADKEY-readkey
JRTTCOLLECT-signkey（以Accepting-Encoding开头）


[mitm]
hostname = api3-normal-c-*.snssdk.com
#圈x
[rewrite local]
^https:\/\/api3-normal-c-\w+\.snssdk\.com\/score_task\/v1\/task\/(sign_in|get_read_bonus) url script-request-header https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js
^https:\/\/api3-normal-c-\w+\.snssdk\.com\/ttgame\/game_farm\/home_info url script-request-header https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js
[task]
5,35 8-23 * * * https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js, tag=今日头条极速版, enabled=true
#loon
http-request ^https:\/\/api3-normal-c-\w+\.snssdk\.com\/score_task\/v1\/task\/(sign_in|get_read_bonus) script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js, requires-body=true, timeout=10, tag=今日头条极速版sign
http-request ^https:\/\/api3-normal-c-\w+\.snssdk\.com\/ttgame\/game_farm\/home_info script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js, requires-body=true, timeout=10, tag=今日头条极速版farm
cron "5,35 8-23 * * *" script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js, tag=今日头条极速版
#surge
jrttsign = type=http-request,pattern=^https:\/\/api3-normal-c-\w+\.snssdk\.com\/score_task\/v1\/task\/(sign_in|get_read_bonus),requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js,script-update-interval=0
jrttfarm = type=http-request,pattern=^https:\/\/api3-normal-c-\w+\.snssdk\.com\/ttgame\/game_farm\/home_info,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js,script-update-interval=0
jrtt = type=cron,cronexp="5,35 8-23 * * *",wake-system=1,script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js,script-update-interval=0
*/
const jsname='今日头条极速版'
const $ = Env(jsname)
const notify = $.isNode() ?require('./sendNotify') : '';
const signurlArr = [],signkeyArr=[]
const farmurlArr = [],farmkeyArr=[]
const readurlArr = [],readkeyArr=[]
let signurl = $.getdata('signurl')
let signkey = $.getdata('signkey')

let farmurl = $.getdata('farmurl')
let farmkey = $.getdata('farmkey')

let readurl = $.getdata('readurl')
let readkey = $.getdata('readkey')
//var articles =''
let tz = ($.getval('tz') || '1');//0关闭通知，1默认开启
const invit=1;//新用户自动邀请，0关闭，1默认开启
const logs =0;//0为关闭日志，1为开启
var coins=''
var article =''
var collect = ''
var invited =''
var hour=''
var minute=''
if ($.isNode()) {
   hour = new Date( new Date().getTime() + 8 * 60 * 60 * 1000 ).getHours();
   minute = new Date( new Date().getTime() + 8 * 60 * 60 * 1000 ).getMinutes();
}else{
   hour = (new Date()).getHours();
   minute = (new Date()).getMinutes();
}
//CK运行

let isGetCookie = typeof $request !== 'undefined'
if (isGetCookie) {
   GetCookie();
   $.done()
} 
if ($.isNode()) {


//sign
// if (process.env.JRTTSIGNURL && process.env.JRTTSIGNURL.indexOf('#') > -1) {
//  signurl = process.env.JRTTSIGNURL.split('#');
//  console.log(`您选择的是用"#"隔开\n`)
// }
// else if (process.env.JRTTSIGNURL && process.env.JRTTSIGNURL.indexOf('\n') > -1) {
//  signurl = process.env.JRTTSIGNURL.split('\n');
//  console.log(`您选择的是用换行隔开\n`)
// } else {
//  signurl = process.env.JRTTSIGNURL.split()
// };
// if (process.env. JRTTSIGNKEY&& process.env.JRTTSIGNKEY.indexOf('#') > -1) {
//  signkey = process.env.JRTTSIGNKEY.split('#');
// }
// else if (process.env.JRTTSIGNKEY && process.env.JRTTSIGNKEY.split('\n').length > 0) {
//  signkey = process.env.JRTTSIGNKEY.split('\n');
// } else  {
//  signkey = process.env.JRTTSIGNKEY.split()
// };
////farm
//if (process.env.JRTTFARMURL && process.env.JRTTFARMURL.indexOf('#') > -1) {
//  farmurl = process.env.JRTTFARMURL.split('#');
//  console.log(`您选择的是用"#"隔开\n`)
// }
// else if (process.env.JRTTFARMURL && process.env.JRTTFARMURL.indexOf('\n') > -1) {
//  farmurl = process.env.JRTTFARMURL.split('\n');
//  console.log(`您选择的是用换行隔开\n`)
// } else {
//  farmurl = process.env.JRTTFARMURL.split()
// };
// if (process.env. JRTTFARMKEY&& process.env.JRTTFARMKEY.indexOf('#') > -1) {
//  farmkey = process.env.JRTTFARMKEY.split('#');
// }
// else if (process.env.JRTTFARMKEY && process.env.JRTTFARMKEY.split('\n').length > 0) {
//  farmkey = process.env.JRTTFARMKEY.split('\n');
// } else  {
//  farmkey = process.env.JRTTFARMKEY.split()
// };
////read
//if (process.env.JRTTREADURL && process.env.JRTTREADURL.indexOf('#') > -1) {
//  readurl = process.env.JRTTREADURL.split('#');
//  console.log(`您选择的是用"#"隔开\n`)
// }
// else if (process.env.JRTTREADURL && process.env.JRTTREADURL.indexOf('\n') > -1) {
//  readurl = process.env.JRTTREADURL.split('\n');
//  console.log(`您选择的是用换行隔开\n`)
// } else {
//  readurl = process.env.JRTTREADURL.split()
// };
// if (process.env. JRTTREADKEY&& process.env.JRTTREADKEY.indexOf('#') > -1) {
//  readkey = process.env.JRTTREADKEY.split('#');
// }
// else if (process.env.JRTTREADKEY && process.env.JRTTREADKEY.split('\n').length > 0) {
//  readkey = process.env.JRTTREADKEY.split('\n');
// } else  {
//  readkey = process.env.JRTTREADKEY.split()
// };
////sign
// Object.keys(signurl).forEach((item) => {
//       if (signurl[item]) {
//         signurlArr.push(signurl[item])
//       }
//   });
//   Object.keys(signkey).forEach((item) => {
//       if (signkey[item]) {
//         signkeyArr.push(signkey[item])
//       }
//   });
////farm
//Object.keys(farmurl).forEach((item) => {
//       if (farmurl[item]) {
//         farmurlArr.push(farmurl[item])
//       }
//   });
//   Object.keys(farmkey).forEach((item) => {
//       if (farmkey[item]) {
//         farmkeyArr.push(signkey[item])
//       }
//   });
////read
//Object.keys(readurl).forEach((item) => {
//       if (readurl[item]) {
//         readurlArr.push(readurl[item])
//       }
//   });
//   Object.keys(readkey).forEach((item) => {
//       if (readkey[item]) {
//         readkeyArr.push(readkey[item])
//       }
//   });

    signurlArr.push('version_code=8.0.5&tma_jssdk_version=1.93.0.11&app_name=news_article_lite&vid=6B41C499-1460-4545-9D9B-EA759B77A6CE&device_id=59870356682&channel=App%20Store&resolution=828*1792&aid=35&ab_version=668904,668907,2334170,668905,1859937,668906,668908,668903,2299620,2297067&ab_feature=2183629,794528&review_flag=0&ab_group=2183629,794528&update_version_code=80509&openudid=bc38270789522ddc4987236aed663ec0d005b918&pos=5pe9vb/88Pzt3vTp5L+9p72/eSUXeygqv7GXvb2//vTp5L+9p72/eSUXeygqv7GXvb2/8fLz+vTp6Pn4v72nvayvrLOrrq2vqq+uqK+prq2oqLGXvb2/8fzp9Ono+fi/vae9rqyzrqyorq+qq6StpKqvr6+vsZe9vb/88Pzt0fzp9Ono+fi/vae9rqyzrqyorq+qq6StpKqvr6+vsZe9vb/88Pzt0fLz+vTp6Pn4v72nvayvrLOrrq2vqq+uqK+prq2oqLGXvb2/8fL+/PHC8fzp+O7pwu3y7r+9p73ml729vb2/6fTw+O7p/PDtv72nvayrrK2tqK2lqKizr6WuqK+opLGXvb29vb/t7/Lr9PP++L+9p72/eSUXeygqv7GXvb29vb/+9Onkv72nvb95JRd7KCq/sZe9vb29v/7y8u/59PP86fjL/PHo+O6/vae95pe9vb29vb2/8fLz+vTp6Pn4v72nvayvrLOrrq2vqq+uqK+prq2oqLGXvb29vb29v/H86fTp6Pn4v72nva6ss66sqK6vqqukraSqr6+vr5e9vb294LGXvb29vb/8+fnv+O7uv72nvb95JRd7KCp4JR95JRd7KCp4JR97KDt5JQF7Cy14ESe/l7294Jfg&cdid=4757A7A0-0902-4230-B9F4-50716263509F&idfv=6B41C499-1460-4545-9D9B-EA759B77A6CE&ac=WIFI&os_version=14.3&ssmix=a&device_platform=iphone&device_type=iPhone%20XR&ab_client=a1,f2,f7,e1&idfa=00000000-0000-0000-0000-000000000000')
    signkeyArr.push('{"Content-Type":"application/json; encoding=utf-8","x-Tt-Token":"002d3dee503c0b2ab5ef82d39947bba3c2017e11b164665a17c3de8858f67aafe1be5ededda9d01b621579c8c2fa3a1b7db137c505e4fecef1400e9441dfd3d16b0d84910acff96016dde781801834f848526-1.0.0","x-tt-trace-id":"00-de86133709df08d24cadc449dca20023-de86133709df08d2-01","Accept":"application/json","X-Tyhon":"gkPDQ3fEx2lCn+NgTJLDQUKwyWpJhMlRQoO6t1U=","sdk-version":"2","X-SS-STUB":"D41D8CD98F00B204E9800998ECF8427E","X-SS-DP":"35","Host":"api3-normal-c-hl.snssdk.com","Accept-Encoding":"gzip, deflate","X-Gorgon":"840400a8000051254d9c1b3e4d52aefd4c8bbcc36ac40a654546","X-Khronos":"1610051097","X-SS-Cookie":"excgd=0108; FRM=new; PIXIEL_RATIO=2; WIN_WH=414_795; d_ticket=85275c08c05004c693305fd6935be9bcc85fb; n_mh=tHU9IKvHFaiSsjfvw6xnIy4GFdtrO_DoNDiZiZKbCMw; sessionid=2d3dee503c0b2ab5ef82d39947bba3c2; sessionid_ss=2d3dee503c0b2ab5ef82d39947bba3c2; sid_guard=2d3dee503c0b2ab5ef82d39947bba3c2%7C1609975941%7C5184000%7CSun%2C+07-Mar-2021+23%3A32%3A21+GMT; sid_tt=2d3dee503c0b2ab5ef82d39947bba3c2; uid_tt=6e3967abbc6e300d1864fd7a01506b44; uid_tt_ss=6e3967abbc6e300d1864fd7a01506b44; passport_csrf_token=92444b411a9d2ec808e09bf7dbac159b; passport_csrf_token_default=92444b411a9d2ec808e09bf7dbac159b; odin_tt=0c21fba7b9c77981268a718d26fe864b5bdd190e4316baaba891e9682ab3111ce58c5018a585bcc582043231d098714e","tt-request-time":"1610051097025","User-Agent":"NewsLite 8.0.5 rv:8.0.5.09 (iPhone; iOS 14.3; zh_CN) Cronet","Content-Length":"0","Connection":"keep-alive","passport-sdk-version":"5.12.1","Cookie":"excgd=0108; odin_tt=0c21fba7b9c77981268a718d26fe864b5bdd190e4316baaba891e9682ab3111ce58c5018a585bcc582043231d098714e; passport_csrf_token=92444b411a9d2ec808e09bf7dbac159b; passport_csrf_token_default=92444b411a9d2ec808e09bf7dbac159b; d_ticket=85275c08c05004c693305fd6935be9bcc85fb; n_mh=tHU9IKvHFaiSsjfvw6xnIy4GFdtrO_DoNDiZiZKbCMw; sessionid=2d3dee503c0b2ab5ef82d39947bba3c2; sessionid_ss=2d3dee503c0b2ab5ef82d39947bba3c2; sid_guard=2d3dee503c0b2ab5ef82d39947bba3c2%7C1609975941%7C5184000%7CSun%2C+07-Mar-2021+23%3A32%3A21+GMT; sid_tt=2d3dee503c0b2ab5ef82d39947bba3c2; uid_tt=6e3967abbc6e300d1864fd7a01506b44; uid_tt_ss=6e3967abbc6e300d1864fd7a01506b44; FRM=new; PIXIEL_RATIO=2; WIN_WH=414_795; i18next=score_task; MONITOR_WEB_ID=eab8e67d-4a62-47a4-84b4-6ac53b2086f5"}')
    farmurlArr.push('device_id=59870356682&device_platform=iphone&aid=35&os_version=14.3&update_version_code=80110&tma_jssdk_version=1.91.0.10&sid=&version_code=8.0.1&install_id=undefined&app_name=news_article_lite&device_type=iPhone%20XR&channel=App%20Store&host_app_name=undefined&activity_id=&credit_type=')
    farmkeyArr.push('{"Content-Type":"application/json","x-Tt-Token":"00271b16e328a9c800201c783f5d69f0de056d148dba1d8ee579a61fc576a7556bd60795bdc98e4715c51b408bd6536017e959e5ab8ee19e6cbfa35c67a671477cc1f61aff7f359196d34f311fe0a8c43904f-1.0.0","x-tt-trace-id":"00-80a3f80b09df08d24ca5d5e0abea0023-80a3f80b09df08d2-01","Referer":"https://tmaservice.developer.toutiao.com/?appid=tta539d3843a134f3d&version=1.1.95","sdk-version":"2","X-SS-DP":"35","Host":"api3-normal-c-hl.snssdk.com","Accept-Encoding":"gzip, deflate","X-Gorgon":"840400250000acdcdaff28c5649cdc5512409ce522822aa543d3","X-Khronos":"1608475997","X-SS-Cookie":"d_ticket=37b7f819eae0f250e05c1c1673e6a83cc85fb; MONITOR_WEB_ID=e94f1b22-3b17-4c23-9e42-b6b841f1b254; n_mh=tHU9IKvHFaiSsjfvw6xnIy4GFdtrO_DoNDiZiZKbCMw; sessionid=271b16e328a9c800201c783f5d69f0de; sessionid_ss=271b16e328a9c800201c783f5d69f0de; sid_guard=271b16e328a9c800201c783f5d69f0de%7C1608456929%7C5184000%7CThu%2C+18-Feb-2021+09%3A35%3A29+GMT; sid_tt=271b16e328a9c800201c783f5d69f0de; uid_tt=8a2f7b6e1ede033c64b6c4dd24e6b3c0; uid_tt_ss=8a2f7b6e1ede033c64b6c4dd24e6b3c0; passport_csrf_token=02dd995a5e0cf0e6712ad322f905efa1; odin_tt=d3d2c4b21de468d13cb6cef92f6f7ee4ac31bf6fb43e5d4e7651389f16a0564ae5f98ffa9c449f1438700660bae5716d","passport-sdk-version":"5.12.1","tt-request-time":"1608475997844","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 NewsArticle/8.0.1.10 JsSdk/2.0 NetType/WIFI (NewsLite 8.0.1 14.300000) NewsLite/8.0.1 Mobile ToutiaoMicroApp/1.91.0.10","x-tt-dt":"","Connection":"keep-alive","Cookie":"d_ticket=37b7f819eae0f250e05c1c1673e6a83cc85fb;n_mh=tHU9IKvHFaiSsjfvw6xnIy4GFdtrO_DoNDiZiZKbCMw;sessionid=271b16e328a9c800201c783f5d69f0de;sessionid_ss=271b16e328a9c800201c783f5d69f0de;sid_guard=271b16e328a9c800201c783f5d69f0de%7C1608456929%7C5184000%7CThu%2C+18-Feb-2021+09%3A35%3A29+GMT;sid_tt=271b16e328a9c800201c783f5d69f0de;uid_tt=8a2f7b6e1ede033c64b6c4dd24e6b3c0;uid_tt_ss=8a2f7b6e1ede033c64b6c4dd24e6b3c0;passport_csrf_token=02dd995a5e0cf0e6712ad322f905efa1;odin_tt=d3d2c4b21de468d13cb6cef92f6f7ee4ac31bf6fb43e5d4e7651389f16a0564ae5f98ffa9c449f1438700660bae5716d;MONITOR_WEB_ID=e94f1b22-3b17-4c23-9e42-b6b841f1b254"}')
    readurlArr.push('version_code=8.0.5&tma_jssdk_version=1.93.0.11&app_name=news_article_lite&vid=6B41C499-1460-4545-9D9B-EA759B77A6CE&device_id=59870356682&channel=App%20Store&resolution=828*1792&aid=35&ab_version=668905,1859937,668906,668908,668903,668904,2334170,668907,2297067,2299620&ab_feature=2183629,794528&review_flag=0&ab_group=2183629,794528&update_version_code=80509&openudid=bc38270789522ddc4987236aed663ec0d005b918&pos=5pe9vb/88Pzt3vTp5L+9p72/eSUXeygqv7GXvb2//vTp5L+9p72/eSUXeygqv7GXvb2/8fLz+vTp6Pn4v72nvayvrLOppa+lqa+rrK2rqqqtpbGXvb2/8fzp9Ono+fi/vae9rqyzrqyqrq6uqqyurK2qq6mxl729v/zw/O3R/On06ej5+L+9p72urLOurKqurq6qrK6sraqrqbGXvb2//PD87dHy8/r06ej5+L+9p72sr6yzqaWvpamvq6ytq6qqraWxl729v/Hy/vzxwvH86fju6cLt8u6/vae95pe9vb29v+n08Pju6fzw7b+9p72sq6ytraqqrqiss6yqqqSqqbGXvb29vb/t7/Lr9PP++L+9p72/eSUXeygqv7GXvb29vb/+9Onkv72nvb95JRd7KCq/sZe9vb29v/7y8u/59PP86fjL/PHo+O6/vae95pe9vb29vb2/8fLz+vTp6Pn4v72nvayvrLOppa+lqa+rrK2rqqqtpbGXvb29vb29v/H86fTp6Pn4v72nva6ss66sqq6urqqsrqytqqupl729vb3gsZe9vb29v/z5+e/47u6/vae9v3klF3soKnglH3klF3soKnglH3gzAHgsLHgRJ7+Xvb3gl+A=&cdid=4757A7A0-0902-4230-B9F4-50716263509F&idfv=6B41C499-1460-4545-9D9B-EA759B77A6CE&ac=WIFI&os_version=14.3&ssmix=a&device_platform=iphone&device_type=iPhone%20XR&ab_client=a1,f2,f7,e1&idfa=00000000-0000-0000-0000-000000000000&impression_type=push&group_id=6914980610779906568')
    readkeyArr.push('{"x-Tt-Token":"002d3dee503c0b2ab5ef82d39947bba3c2017e11b164665a17c3de8858f67aafe1be5ededda9d01b621579c8c2fa3a1b7db137c505e4fecef1400e9441dfd3d16b0d84910acff96016dde781801834f848526-1.0.0","x-tt-trace-id":"00-e017c2f409df08d24ca1b335cca30023-e017c2f409df08d2-01","X-Tyhon":"YjCm6v9gtM3map7DgTaRycpOnsjfQZPT7XrfUMg=","sdk-version":"2","X-SS-DP":"35","Host":"api3-normal-c-hl.snssdk.com","Accept-Encoding":"gzip, deflate","X-Gorgon":"8404209200000ef9be3f5059bce682059f2cbd8e2d49be431198","X-SS-Cookie":"excgd=0108; UM_distinctid=176de97d587121b-0daf7315b6ebb6-7a617c75-5a900-176de97d588116d; CNZZDATA1264530760=430493364-1610048056-%7C1610048056; FRM=new; PIXIEL_RATIO=2; WIN_WH=414_795; d_ticket=85275c08c05004c693305fd6935be9bcc85fb; n_mh=tHU9IKvHFaiSsjfvw6xnIy4GFdtrO_DoNDiZiZKbCMw; sessionid=2d3dee503c0b2ab5ef82d39947bba3c2; sessionid_ss=2d3dee503c0b2ab5ef82d39947bba3c2; sid_guard=2d3dee503c0b2ab5ef82d39947bba3c2%7C1609975941%7C5184000%7CSun%2C+07-Mar-2021+23%3A32%3A21+GMT; sid_tt=2d3dee503c0b2ab5ef82d39947bba3c2; uid_tt=6e3967abbc6e300d1864fd7a01506b44; uid_tt_ss=6e3967abbc6e300d1864fd7a01506b44; passport_csrf_token=92444b411a9d2ec808e09bf7dbac159b; passport_csrf_token_default=92444b411a9d2ec808e09bf7dbac159b; odin_tt=0c21fba7b9c77981268a718d26fe864b5bdd190e4316baaba891e9682ab3111ce58c5018a585bcc582043231d098714e","passport-sdk-version":"5.12.1","tt-request-time":"1610077421948","User-Agent":"NewsLite 8.0.5 rv:8.0.5.09 (iPhone; iOS 14.3; zh_CN) Cronet","Connection":"keep-alive","X-Khronos":"1610077421","Cookie":"excgd=0108; odin_tt=0c21fba7b9c77981268a718d26fe864b5bdd190e4316baaba891e9682ab3111ce58c5018a585bcc582043231d098714e; passport_csrf_token=92444b411a9d2ec808e09bf7dbac159b; passport_csrf_token_default=92444b411a9d2ec808e09bf7dbac159b; d_ticket=85275c08c05004c693305fd6935be9bcc85fb; n_mh=tHU9IKvHFaiSsjfvw6xnIy4GFdtrO_DoNDiZiZKbCMw; sessionid=2d3dee503c0b2ab5ef82d39947bba3c2; sessionid_ss=2d3dee503c0b2ab5ef82d39947bba3c2; sid_guard=2d3dee503c0b2ab5ef82d39947bba3c2%7C1609975941%7C5184000%7CSun%2C+07-Mar-2021+23%3A32%3A21+GMT; sid_tt=2d3dee503c0b2ab5ef82d39947bba3c2; uid_tt=6e3967abbc6e300d1864fd7a01506b44; uid_tt_ss=6e3967abbc6e300d1864fd7a01506b44; FRM=new; PIXIEL_RATIO=2; WIN_WH=414_795; i18next=score_task; UM_distinctid=176de97d587121b-0daf7315b6ebb6-7a617c75-5a900-176de97d588116d; MONITOR_WEB_ID=eab8e67d-4a62-47a4-84b4-6ac53b2086f5"}')

    console.log(`============ 脚本执行-国际标准时间(UTC)：${new Date().toLocaleString()}  =============\n`)
    console.log(`============ 脚本执行-北京时间(UTC+8)：${new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString()}  =============\n`)
 } else {
    signurlArr.push($.getdata('signurl'))
    signkeyArr.push($.getdata('signkey'))
    farmurlArr.push($.getdata('farmurl'))
    farmkeyArr.push($.getdata('farmkey'))
    readurlArr.push($.getdata('readurl'))
    readkeyArr.push($.getdata('readkey'))
    let jrttcount = ($.getval('jrttcount') || '1');
  for (let i = 2; i <= jrttcount; i++) {
    signurlArr.push($.getdata(`signurl${i}`))
    signkeyArr.push($.getdata(`signkey${i}`))
    farmurlArr.push($.getdata(`farmurl${i}`))
    farmkeyArr.push($.getdata(`farmkey${i}`))
    readurlArr.push($.getdata(`readurl${i}`))
    readkeyArr.push($.getdata(`readkey${i}`))
  }
}
!(async () => {
if (!signurlArr[0]) {
    $.msg($.name, '【提示】请先获取今日头条极速版一cookie')
    return;
  }


       console.log(`------------- 共${signurlArr.length}个账号----------------\n`)
        for (let i = 0; i < signurlArr.length; i++) {
          if (signurlArr[i]) {
            other = ''
            signurl = signurlArr[i];
            signkey = signkeyArr[i];
            farmurl = farmurlArr[i];
            farmkey = farmkeyArr[i];
            readurl = readurlArr[i];
            readkey = readkeyArr[i];
            $.index = i + 1;
            console.log(`\n开始【今日头条极速版${$.index}】`)
            await invite()
            await userinfo()
            await profit()
            await sign_in()
            await openbox()
            await reading()
            await farm_sign_in()
            await openfarmbox()
            await landwarer()
            await double_reward()
            await sleepstatus()
            await control()
            //await sleepstart()
            //await sleepstop()
            //await collectcoins(coins)
            await showmsg()
        }
       }


})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
function GetCookie() {
 if($request&&$request.url.indexOf("info")>=0) {
  const farmurlVal = $request.url.split(`?`)[1]
    if (farmurlVal) $.setdata(farmurlVal,
'farmurl')
    $.log(`[${jsname}] 获取farm请求: 成功,farmirlVal: ${farmurl}`)
    $.msg(`获取farmurl: 成功🎉`, ``)
   const jrttfarmKey = JSON.stringify($request.headers)
$.log(jrttfarmKey)
  if(jrttfarmKey)        $.setdata(jrttfarmKey,'farmkey')
    $.log(`[${jsname}] 获取farm请求: 成功,jrttfarmKey: ${farmkey}`)
    $.msg(`获取farmkey: 成功🎉`, ``)
}
  if($request&&$request.url.indexOf("sign_in")>=0) {
  const signurlVal = $request.url.split(`?`)[1]
    if (signurlVal) $.setdata(signurlVal,
'signurl')
    $.log(`[${jsname}] 获取sign请求: 成功,signurlVal: ${signurl}`)
    $.msg(`获取signurl: 成功🎉`, ``)
   const jrttsignKey = JSON.stringify($request.headers)
//$.log(jrttsignKey)
  if(jrttsignKey.indexOf("STUB")>=0)
    $.setdata(jrttsignKey,'signkey')
    $.log(`[${jsname}] 获取sign请求: 成功,jrttsignKey: ${signkey}`)
    $.msg(`获取signkey: 成功🎉`, ``)
}

if($request&&$request.url.indexOf("get_read_bonus")>=0) {
  const readurlVal = $request.url.split(`?`)[1]

  //const article = readurlVal.replace(/\d{3}$/,Math.floor(Math.random()*1000));
//article = article.replace(/\d{3}$/, (Math.random()*1e3).toFixed(0).padStart(3,"0"));

    if(article) $.setdata(article,
'article')
    if (readurlVal) $.setdata(readurlVal,
'readurl')
    $.log(`[${jsname}] 获取read请求: 成功,readurlVal: ${readurl}`)
    $.msg(`获取readurl: 成功🎉`, ``)
   const jrttreadKey = JSON.stringify($request.headers)
$.log(jrttreadKey)
  if(jrttreadKey)        $.setdata(jrttreadKey,'readkey')
    $.log(`[${jsname}] 获取read请求: 成功,jrttreadKey: ${readkey}`)
    $.msg(`获取readkey: 成功🎉`, ``)
    }
  }
function sign_in() {
return new Promise((resolve, reject) => {
  let sign_inurl ={
    url: `https://api3-normal-c-lq.snssdk.com/score_task/v1/task/sign_in/?${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.post(sign_inurl,(error, response, data) =>{
     const result = JSON.parse(data)
       if(logs) $.log(data)
      if(result.err_no == 0) {
          other +='📣首页签到\n'
          other +='签到完成\n'
          other +='获得'+result.data.score_amount+'金币\n'
          other +='连续签到'+result.data.sign_times+'天\n'
  
}else{
          other +='📣首页签到\n'
          other +='今日已完成签到\n'
           }
          resolve()
    })
   })
  } 

async function control(){
   if(collect == 0){
      await sleepstart();
   }
   if(collect == 1){
      await sleepstop();
      await collectcoins(coins);
   }
   if(collect == 2){
      //$.log('no opreation')
      other +='\n\n生前何必久睡，死后自会长眠\n'
   }
   if(collect == 3){
      await collectcoins(coins);
   }
   if(invited == 4 && invit== 1){
      await invitation();
   }
}
function invite() {
return new Promise((resolve, reject) => {
  let inviteurl ={
    url: `https://api3-normal-c-lq.snssdk.com/score_task/v1/user/new_tabs/?${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.get(inviteurl,(error, response, data) =>{
     const result = JSON.parse(data)
      if(logs)$.log(data)
      if(result.data.section[10].key=='mine_input_code') {
          invited=4;
           }else{
          invited=5;
}
          resolve()
    })
   })
  } 
function invitation() {
return new Promise((resolve, reject) => {
  let invitatonurl ={
    url: `https://api3-normal-c-lq.snssdk.com/luckycat/lite/v1/invite/post_invite_code/?_request_from=web&device_platform=ios&ac=4G&${signurl}`,
    headers :JSON.parse(farmkey),
      timeout: 60000,
    body: JSON.stringify({"invitecode" : "1980436898"})
}

   $.post(invitatonurl,(error, response, data) =>{
     const result = JSON.parse(data)
       if(logs)$.log(data)
          resolve()
    })
   })
  } 

function userinfo() {
return new Promise((resolve, reject) => {
  let userinfourl ={
    url: `https://api3-normal-c-hl.snssdk.com/passport/account/info/v2/?${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.get(userinfourl,(error, response, data) =>{
     const result = JSON.parse(data)
      //$.log(signurl+'\n'+signkey+'\n'+farmurl+'\n'+farmkey+'\n'+readurl+'\n'+readkey)
       if(logs) $.log(data)
      if(result.message == 'success') {
          other +='🎉'+result.data.name+'\n'
  
}     else if(result.message == 'error'){
          other += '⚠️异常:'+result.data.description+'\n'
           }else{
          other += '⚠️异常'
}
          resolve()
    })
   })
  } 

function profit() {
return new Promise((resolve, reject) => {
  let profiturl ={
    url: `https://api3-normal-c-lq.snssdk.com/score_task/v1/user/info/?${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.get(profiturl,(error, response, data) =>{
     const result = JSON.parse(data)
        if(logs)$.log(data)
      if(result.err_no == 0) {
          other +='🎉金币收益:'+result.data.score.amount+'\n🎉估计兑换现金:'+(result.data.score.amount/30000).toFixed(2)+'\n🎉'+'现金收益:'+result.data.cash.amount+'\n'      
}else{
          other += '⚠️异常\n'
           }
          resolve()
    })
   })
  } 

//文章阅读30篇每天
function reading() {
const articles = readurl.replace(/\d{3}$/,Math.floor(Math.random()*1000));
return new Promise((resolve, reject) => {
  let readurl ={
    url: `https://api3-normal-c-lq.snssdk.com/score_task/v1/task/get_read_bonus/?${articles}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.post(readurl,(error, response, data) =>{
   try{
     const result = JSON.parse(data)
      if(logs)  $.log(data)
      other +='📣文章阅读\n'
      if(result.err_no == 0) {
          other +='阅读完成'
          other +='获得'+result.data.score_amount+'金币\n'
          other +='阅读进度'+result.data.icon_data.done_times+'/'+result.data.icon_data.read_limit+'\n'
      }
       if(result.err_no == 4){
          other +='文章阅读已达上限\n'
        }
       if(result.err_no == 1028){
          other +='这篇文章已经读过了\n'
        }
       }catch(e){}
          resolve()
    })
   })
  } 
//农场签到
function farm_sign_in() {
return new Promise((resolve, reject) => {
  let farm_sign_inurl ={
    url: `https://api3-normal-c-lq.snssdk.com/ttgame/game_farm/reward/sign_in?watch_ad=1&${signurl}`,
    headers :JSON.parse(farmkey),
      timeout: 60000,
}

   $.get(farm_sign_inurl,(error, response, data) =>{
     const result = JSON.parse(data)
       if(logs) $.log(data)
       other +='📣农场签到\n'
      if(result.status_code == 0) {
          other +='签到完成\n'
         
}else{
          other +=result.message+'\n'
           }
          resolve()
    })
   })
  } 

function openbox() {
return new Promise((resolve, reject) => {
  let openboxurl ={
    url: `https://it-lq.snssdk.com/score_task/v1/task/open_treasure_box/?${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.post(openboxurl,(error, response, data) =>{
     const result = JSON.parse(data)
       if(logs) $.log(data)
       other +='📣首页宝箱\n'
      if(result.err_no == 0) {
        other += '开启成功'
        other += '获得金币'+result.data.score_amount+'个\n'
        }
      else{
         if(result.err_no == 9){
        other += result.err_tips+'\n'
        }else{
        other +="不在开宝箱时间\n"
           }
    }
          resolve()
    })
   })
  }  


function openfarmbox() {
return new Promise((resolve, reject) => {
  let openfarmboxurl ={
    url: `https://api3-normal-c-lq.snssdk.com/ttgame/game_farm/box/open?${farmurl}`,
    headers :JSON.parse(farmkey),
      timeout: 60000,
}

   $.get(openfarmboxurl,(error, response, data) =>{
     const result = JSON.parse(data)
       if(logs) $.log(data)
       other +='📣农场宝箱\n'
      if(result.status_code == 0) {
        other += "第"+(5-result.data.box_num)+"开启成功"
        other += "还可以开启"+result.data.box_num+"个\n"
        }
      else if(result.status_code == 5003){
        other +="已全部开启\n"
        }
          resolve()
    })
   })
  }  
function landwarer() {
return new Promise((resolve, reject) => {
  let landwaterurl ={
    url: `https://api3-normal-c-lq.snssdk.com/ttgame/game_farm/land_water?tentimes=0${farmurl}`,
    headers :JSON.parse(farmkey),
      timeout: 60000,
}

   $.get(landwaterurl,(error, response, data) =>{
     const result = JSON.parse(data)
        if(logs)$.log(data)
       other +='📣农场浇水\n'
      if(result.status_code == '0') {
        other += result.message+'\n'
        other += '💧水滴剩余'+result.data.water+'\n'
        }
      else{
        other +=result.message+'\n'
           }
          resolve()
    })
   })
  } 
//done 这个离线奖励当宝箱全部开完后，需要进入农场再运行脚本，才能获取离线奖励，应该有一个判定，目前没有找到
//利用浇水激活进农场状态获取离线奖励，目前测试每天离线奖励足够开启农场5个宝箱，不需要做游戏加快生产，具体情况看后期是否需要，再考虑加做除虫，开地，三餐奖励
function double_reward() {
return new Promise((resolve, reject) => {
  let double_rewardurl ={
    url: `https://api3-normal-c-lq.snssdk.com/ttgame/game_farm/double_reward?watch_ad=1&${farmurl}`,
    headers :JSON.parse(farmkey),
      timeout: 60000,
}

   $.get(double_rewardurl,(error, response, data) =>{
     const result = JSON.parse(data)
       if(logs) $.log(data)
        other +='📣农场视频双倍离线奖励\n'
      if(result.status_code == 0) {
        other += '获得成功\n'
        }else if(result.status_code==5033){
            other += result.message+'\n'
          }
        else{
        other +='📣农场视频双倍离线奖励\n'
        other +="无离线产量可领取\n"
           }
          resolve()
    })
   })
  }  


//睡觉状态
function sleepstatus() {
return new Promise((resolve, reject) => {
  let sleepstatusurl ={
    url: `https://api3-normal-c-lq.snssdk.com/luckycat/lite/v1/sleep/status/?_request_from=web&${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.get(sleepstatusurl,(error, response, data) =>{
     const result = JSON.parse(data)
       if(logs)$.log(data)
      if(result.err_no == 0) {
          other +='📣查询睡觉状态\n🎉查询'+result.err_tips+'\n'
           }
      if(result.data.sleeping == false){
          other +='当前状态:清醒着呢\n'
        if(hour >= 20||hour<=2){
           collect=0 //await sleepstart()
           }else{
if(result.data.history_amount!==0){ 
//即使没有满足3600也在睡觉12小时后停止，以防封号
         coins=result.data.history_amount
         collect =3 //collect coins
          }else{
         collect=2
}
}}
          else{
         other  +='当前状态:酣睡中,已睡'+parseInt(result.data.sleep_last_time/3600)+'小时'+parseInt((result.data.sleep_last_time%3600)/60)+'分钟'+parseInt((result.data.sleep_last_time%3600)%60)+'秒\n'
          other +='预计可得金币'+result.data.sleep_unexchanged_score+'\n'
          coins=result.data.sleep_unexchanged_score
         if(result.data.sleep_unexchanged_score == 3600 || parseInt(result.data.sleep_last_time/3600) == 12){ 
//即使没有满足3600也在睡觉12小时后停止，以防封号
         collect =1 //collect coins&sleepstop
          }else{
         collect =2
}
   
     }
          resolve()
    })
   })
  } 
//开始睡觉
function sleepstart() {
return new Promise((resolve, reject) => {
  let sleepstarturl ={
    url: `https://api3-normal-c-lq.snssdk.com/luckycat/lite/v1/sleep/start/?_request_from=web&${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.post(sleepstarturl,(error, response, data) =>{
     const result = JSON.parse(data)
       if(logs) $.log(data)
      if(result.err_no == 0) {
          other +='📣开始睡觉\n该睡觉了，开始睡觉'+result.err_tips+'\n'
  
}     else if(result.err_no == 1052){
          other +='📣开始睡觉\n'+result.err_tips+'\n'
           }else{
          other += '📣开始睡觉:'+'⚠️异常'
}
          resolve()
    })
   })
  } 
//停止睡觉
function sleepstop() {
return new Promise((resolve, reject) => {
  let sleepstopurl ={
    url: `https://api3-normal-c-lq.snssdk.com/luckycat/lite/v1/sleep/stop/?_request_from=web&${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.post(sleepstopurl,(error, response, data) =>{
     const result = JSON.parse(data)
       if(logs) $.log(data)
      if(result.err_no == 0) {
          other +='📣停止睡觉\n'+result.err_tips+'\n'
          
}     else if(result.err_no == 1052){
          other += '📣停止睡觉\n'+'还没开始睡觉\n'
           }else{
          other +='📣停止睡觉:'+'\n⚠️异常'
}
          resolve()
    })
   })
  } 
//收取睡觉金币
function collectcoins(coins) {
return new Promise((resolve, reject) => {
  let collectcoinsurl ={
    url: `https://api3-normal-c-lq.snssdk.com/luckycat/lite/v1/sleep/done_task/?_request_from=web&device_platform=undefined&${signurl}`,
    headers :JSON.parse(farmkey),
      timeout: 60000,
    body :JSON.stringify({score_amount: coins}),

}

   $.post(collectcoinsurl,(error, response, data) =>{
     const result = JSON.parse(data)
       if(logs)$.log(data)
      if(result.err_no == 0) {
          other +='📣收取金币\n'+result.err_tips+'     获得金币:'+coins
          
}     else{
          other +='📣收取金币:'+'\n⚠️异常:'+result.err_tips+''
}
          resolve()
    })
   })
  } 
var Time = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
async function showmsg(){
if(tz==1){
    if ($.isNode()&& (Time.getHours() == 12 && Time.getMinutes() <= 20) || (Time.getHours() == 23 && Time.getMinutes() >= 40)) {
       await notify.sendNotify($.name,other)
     }else{
       $.msg(jsname,'',other)
}
   }else{
      $.log(jsname,'',other)
     }

}
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
