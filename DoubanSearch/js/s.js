$('input[type=submit]').click(function () {
    startSearch();
});
$(document).keyup(function(event){  
  if(event.keyCode ==13){  
     startSearch();
  }  
});

function startSearch() {
	var search_item = $('input[name=search_item]').val();
	    var is_movie = $('input[name=is_movie]:checked').val();

	    if (search_item) {
	        if (is_movie == undefined) {
	            chrome.tabs.create({"url": 'https://book.douban.com/subject_search?search_text=' + search_item});
	        } else {
	            chrome.tabs.create({"url": 'https://movie.douban.com/subject_search?search_text=' + search_item});
	        }
	    }
}