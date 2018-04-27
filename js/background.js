chrome.bookmarks.onCreated.addListener(function (tid, obj) {
    updateNum(tid,
        obj);
});
chrome.bookmarks.onMoved.addListener(function (tid, obj) {
    updateNum(tid,
        obj);
});
chrome.bookmarks.onRemoved.addListener(function (tid, obj) {
    updateNum(tid,
        obj);
});
chrome.bookmarks.onChanged.addListener(function (tid, obj) {
    updateNum(tid,
        obj);
});

function updateNum() {

    chrome.bookmarks.search("TempCollects",
        function (obj) {
            if (obj[0] !== undefined) {
                var id = obj[0].id
                //列出所有的已保存书签
                chrome.bookmarks.getChildren(id,
                    function (obj) {
                        chrome.browserAction.setBadgeText({"text": obj.length.toString()})
                    })
            }
        })
}

updateNum();

chrome.commands.onCommand.addListener(function (command) {
    if (command == "collect-page") {
        chrome.tabs.query({active: true, currentWindow: true},
            function (tabs) {
                var current = tabs[0];

                chrome.bookmarks.search("TempCollects",
                    function (obj) {
                        if (obj[0] !== undefined) {
                            var id = obj[0].id
                            debugger;
                            if (!/chrome:.*/.test(current.url)) {
                                chrome.bookmarks.create({
                                    "index": 0,
                                    "parentId": id.toString(),
                                    "title": current.title,
                                    "url": current.url
                                });

                                //防止最后一个标签关闭窗口
                                chrome.tabs.getAllInWindow(function (windows) {
                                    if (windows.length == 1) {
                                        chrome.tabs.create({});
                                    }
                                });
                                chrome.tabs.remove(current.id);
                            }
                        }
                    })
            });
    }
});