chrome.bookmarks.search("TempCollects",
    function (obj) {
        if (obj[0] !== undefined) {
            var id = obj[0].id
            //列出所有的已保存书签
            chrome.bookmarks.getChildren(id,
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
                function () {
                });
        }
    })

$(document).on('click',
    'a',
    function () {
        chrome.tabs.create({"url": $(this).attr('href'), "selected": false})
        $(this).parent().remove();
        chrome.bookmarks.remove($(this).data('id').toString())
    })