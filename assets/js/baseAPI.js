$.ajaxPrefilter(function(option) {
    //    统一拼接请求根路径

    option.url = 'http://ajax.frontend.itheima.net' + option.url




})