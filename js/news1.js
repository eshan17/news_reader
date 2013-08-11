//http://hkr.me:8001/?jsonp=fshdsk&url=http://www.yahoo.com&format=text(Brandon's html thign)

/*
    Eshan Chordia       (echordia)
    Akash Kulkarni      (aakulkar)
    Anish Phophaliya    (aphophal)
*/



/*
 * This method is used to get the article on the page.
 */

var newsSelected = false;
$('#articleContainer').click(function(){ 
        newsSelected = true; 
});

$(window).keydown(function(e){
    if(newsSelected){
        //ENTER KEY
        if(e.keyCode === 13) {
            var select = window.getSelection();
            if(select !== null && select !== "") {
               addIframe(select);
            }
            newsSelected = false;
        }
        //ESCAPE KEY
        if(e.keyCode === 27){
            close();
            newsSelected = false;
        }
    }
 });

function addIframe(text) {
    var container = document.getElementById('info');
    container.innerHTML = "";
    var iframe = document.createElement('iframe');
    iframe.setAttribute('id', "myIframe");
    var source = "http://en.wikipedia.org/wiki/" + text;
    iframe.setAttribute('src', source);
    container.appendChild(iframe);
}



function openArticle(url) {
	// alert("in func openArticle!");
	var container = document.getElementById('info');
    var uri = "http://hkr.me:8001/?jsonp=?&url=" + url + "&format=text";
    $.ajax({
        url : uri,
        dataType: 'json',
        success: createArticle 
    }); 
	/*var iframe = document.createElement('iframe');
	iframe.setAttribute('id', "frame");
	iframe.setAttribute('src', url);*/
	console.log("URL: " + url);
	//container.appendChild(iframe);
}


/*
 * This method is the callback which is supposed to open the article window.
 */
function createArticle(data){

    var html = data;
    var articleContainer = $('#articleContainer');
    var closeButton = document.createElement('button');

    $('#articlePage').css('width','100%');
    articleContainer.empty();
    articleContainer.append(html);
    var content = articleContainer.find('#article');
    alert(content);
    articleContainer.empty();
    console.log(content);
    articleContainer.append(content);

}

/*
 * This method is called when a keyword is searched.
 */
function getNewsFromSearch(){

	
	var query = document.getElementById('searchBox').value;
	document.getElementById('searchBox').value = "";
    if(query.length === 0) {
        return;
    }
    getNews(query);
}


/*
 * This method is called to get the news for the 'query'.
 */
function getNews(query){
	var oldNews = $("#headlines").children().remove();
    console.log(query);
	var uri = "http://query.yahooapis.com/v1/public/yql?format=json&callback=?&q=select%20*%20from%20json%20where%20url=%22http%3A//api.nytimes.com/svc/search/v1/article?query%3D" + query + "%26rank%3Dnewest%26api-key%3D5f9d6dce257fee0116b6ef25cea9c1cc%3A10%3A66738391%22";
	$.ajax({
		url : uri,
		dataType: 'json',
		success: parseNews 
	});		

}


/*
 * This method is a callback that parses the data and updates the page.
 */
function parseNews(data){
	if(!data || !data.query || !data.query.results || !data.query.results.json || !data.query.results.json.results) {
		var newNode = $("<div></div>");
    	newNode.append("<p id='title'>" + "Your search did not match any documents." + "</p>" );
    	$("#headlines").append(newNode);
    	return;	
	}
	var results = data.query.results.json.results;
    console.log(results);
    for(var i = 0; i < results.length; i++){
    	var title = results[i].title;
    	var byline = results[i].byline;
    	var date = parseDate(results[i].date);
        //error checking
        if(title === null || 
            byline === null ||
            date === null) 
            continue;
    	var url = results[i].url;
    	var body = results[i].body;
    
        //NEED TO FIND WAY AROUND THIS!
    	var link = $("<a href='#' class='linkref' id='" + url + "'> More<a><br>");
    	link.url = url;
    
    	link.click (function(event) {
  			var linkobj = event.target;
  			console.log(linkobj);
  			openArticle(linkobj.id);
  			return false;
		});	 
    	var newNode = $("<div class='headline'></div>");
    	newNode.append("<p class='title'>" + title + "</p>" );
    	newNode.append("<p class='author'>" + byline + " Published: " + date + "</p>" );
    	newNode.append("<p class='description'>" + body + "...</p>");
    	newNode.append(link );
        $("#headlines").append(newNode);
    }
}



/*
 * This method is used to parse the date.
 */
function parseDate(date) {
    if(date === null || date.length === 0)
        return null;
    var d = parseInt(date);
    if(d === NaN) {
        return null;
    }
    var dateObj = new Date();

    var day = date%100;
    dateObj.setDate(day);
    date = Math.floor(date/100);
    var month = date%100;
    dateObj.setMonth((month-1));
    var year = Math.floor(date/100);
    dateObj.setFullYear(year);
    return (dateObj.getMonth()+1) + "/" + dateObj.getDate() + "/" + dateObj.getFullYear();
}

/*
* This method closes the articlePage
*/
function close(){
    $('#articleContainer').empty();
    $('#info').empty();
    $('#articlePage').css('width','0%');


}