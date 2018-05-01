chrome.storage.local.get({fid: '-1'},
    function (items) {
        if (items.fid !== -1) {
            //列出所有的已保存书签
            chrome.bookmarks.getChildren(items.fid,
                function (obj) {
                    var app = new Vue({
                        el: '#item_list',
                        data: {
                            items: obj
                        }
                    })

                })
        } else {
            //创建书签文件夹
            chrome.bookmarks.create({'title': 'TempCollects'},
                function (obj) {
                    chrome.storage.local.set({fid: obj.id});
                });
        }
    });

$(document).on('click',
    'a',
    function () {
        chrome.tabs.create({"url": $(this).attr('href'), "selected": false})
        $(this).parent().remove();
        chrome.bookmarks.remove($(this).data('id').toString())
    })