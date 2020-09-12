$.ajaxPrefilter(function(options) {
    //    统一拼接请求根路径

    options.url = 'http://ajax.frontend.itheima.net' + options.url


    // 若是地址需要header请求头
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 不能直接请求需要有验证的页面

    options.complete = function(res) {
        // console.log(res);
        if (res.responseJSON.message === '身份认证失败！' && res.responseJSON.status === 1) {

            location.href = '/login.html';
            localStorage.removeItem('token');
        }
    }






})