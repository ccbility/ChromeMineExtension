$(document).on('click',
    'a.item',
    function () {
        chrome.tabs.create({"url": $(this).attr('href'), "selected": false});
        $(this).parent().remove();
        chrome.bookmarks.remove($(this).data('id').toString())
    });

$(document).on('click',
    'a.clear',
    function () {
        var that = $(this);
        chrome.bookmarks.remove(that.prev().attr('data-id').toString());

        chrome.storage.local.get({recover_id: '-1'},
            function (items) {
                chrome.bookmarks.update(
                    items.recover_id,
                    {
                        "title": "recover://" + that.prev().html(),
                        "url": that.prev().attr('href')
                    });
                //todo暂时未处理recover_id寻找错误的情况
            });

        updateAllBookMarks(0);
        $('#recover_btn').data('is_allow',
            1);
    });

//恢复功能
//todo 也许能改进下写法，避免火箭筒
$('#recover_btn').click(function () {
    if ($(this).data('is_allow') == 1) {
        //防止恢复同一个标签多次,只有当前删除后才能恢复
        $(this).data('is_allow',
            0);
        chrome.storage.local.get({recover_id: '-1'},
            function (items) {
                chrome.bookmarks.get(items.recover_id,
                    function (obj) {
                        chrome.storage.local.get({fid: '-1'},
                            function (items) {
                                chrome.bookmarks.create(
                                    {
                                        "index": 0,
                                        "title": obj[0].title.replace('recover://',
                                            ''),
                                        "url": obj[0].url,
                                        "parentId": items.fid
                                    });
                            });
                        //重新渲染页面
                        updateAllBookMarks(0);
                    });
            });
    }
});

updateAllBookMarks(1);

function updateAllBookMarks(is_new) {
    chrome.storage.local.get({fid: '-1'},
        function (items) {
            if (items.fid !== -1) {
                //列出所有的已保存书签
                chrome.bookmarks.getChildren(items.fid,
                    function (obj) {
                        if (is_new == 1) {
                            window.app = new Vue({
                                el: '#item_list',
                                data: {
                                    items: obj
                                },
                                methods: {
                                    no_recover: function (obj) {
                                        if (obj.title.indexOf("recover://") === 0) {
                                            return false;
                                        }
                                        return true;
                                    }
                                }
                            });
                        } else {
                            window.app.items = obj;
                        }

                    })
            } else {
                //创建书签文件夹
                chrome.bookmarks.create({'title': 'TempCollects'},
                    function (obj) {
                        chrome.storage.local.set({fid: obj.id});

                        //待恢复书签
                        chrome.bookmarks.create(
                            {
                                'title': 'recover://',
                                'url': 'http://123',
                                "parentId": obj.id
                            },
                            function (obj) {
                                chrome.storage.local.set({recover_id: obj.id});
                            });
                    });
            }
        });
}
