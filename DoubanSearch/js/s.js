$('input[type=submit]').click(function () {
    var search_item = $('input[name=search_item]').val();
    var is_book = $('input[name=is_book]:checked').val();

    if (search_item) {
        if (is_book == undefined) {
            chrome.tabs.create({"url": 'https://movie.douban.com/subject_search?search_text=' + search_item});
        } else {
            chrome.tabs.create({"url": 'https://book.douban.com/subject_search?search_text=' + search_item});
        }
    }
});