$(function() {
    var layer = layui.layer
    var form = layui.form

    initCate()

    // 初始化富文本编辑器
    initEditor()

    // 调用函数渲染

    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            type: 'get',
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-cate', res)
                $('#cate_id').append(htmlStr)
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 点击选择封面按钮触发file点击事件
    $('#btnChooseImage').on('click', function() {
        $("#file").click()

    })

    // 当上传发生变化时，可以获取到选择的新的图片，并更改需要裁剪的图片

    $('#file').on('change', function(e) {


        var filelist = e.target.files
        if (filelist.lengtn === 0) {
            return layui.layer.msg('请选择图片')
        }
        // 拿到用户选择的文件
        var file = e.target.files[0]

        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)

        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 默认认为发布文章状态为已发布
    var art_state = '已发布'

    // 点击草稿按钮，状态则为草稿
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    // 表单添加提交事件，并在里面动态获取FormData
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()

        // 动态获取FormData
        var fd = new FormData($(this)[0])

        // 将文章状态存入
        fd.append('state', art_state)

        // 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                // 将图片存入
                fd.append('cover_img', blob)

                //发起请求
                $.ajax({
                    url: '/my/article/add',
                    type: 'post',
                    data: fd,
                    contentType: false,
                    processData: false,
                    success: function(res) {
                        console.log(res);
                        if (res.status !== 0) {
                            return layer.msg(res.message)
                        }
                        layer.msg(res.message)
                        location.href = './art_list.html'
                    }
                })
            })
    })
})