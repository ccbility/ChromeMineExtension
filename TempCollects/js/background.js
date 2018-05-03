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

chrome.runtime.onInstalled.addListener(function () {
    updateNum();
});

chrome.bookmarks.search("TempCollects",
    function (obj) {
        if (obj[0] === undefined) {
            //创建书签文件夹
            chrome.bookmarks.create({'title': 'TempCollects'},
                function (obj) {
                    chrome.storage.local.set({fid: obj.id.toString()});

                    //待恢复书签
                    chrome.bookmarks.create(
                        {
                            'title': 'recover://',
                            'url': 'http://123',
                            "parentId": obj.id
                        },
                        function (obj) {
                            chrome.storage.local.set({recover_id: obj.id.toString()});
                        });
                });

        }
    });

function updateNum() {
    chrome.storage.local.get({fid: -1},
        function (items) {
            chrome.bookmarks.getChildren(items.fid,
                function (obj) {
                    chrome.browserAction.setBadgeText({"text": (obj.length - 1).toString()})
                })
        });
}

chrome.commands.onCommand.addListener(function (command) {
    if (command == "collect-page") {
        chrome.tabs.query({active: true, currentWindow: true},
            function (tabs) {
                var current = tabs[0];

                chrome.storage.local.get({fid: -1},
                    function (items) {
                        if (!/chrome:.*/.test(current.url)) {
                            chrome.bookmarks.create({
                                "index": 0,
                                "parentId": items.fid.toString(),
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
                    });
            });
    }
});