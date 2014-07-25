var player;
function onYouTubePlayerAPIReady() {
	player = new YT.Player('player', {
		height: '300',
		width: '100%',
		playerVars: {'autohide': 1,
		'controls': 2,
		'enablejsapi': 1,
		'fs': 0,
		'iv_load_policy': 3,
		'modestbranding': 1,
		'rel': 0,
		'showinfo': 0,
		'autoplay': 0},
		'events': {
			'onReady': onReady,
			'onStateChange': onPlayerStateChange
		}
		});
}

function onReady(event){
	searchYoutube(next, 1, "", function(id){
			player.loadVideoById(id);
			var cur = $('#imp').val();
			var a = cur.substring(cur.indexOf('\n') + 1);
			$('#imp').val(a);
			});
}

// when video ends
function onPlayerStateChange(event) {        
	if(event.data === 0) {          
		searchYoutube(next, 1, "", function(id){
			player.loadVideoById(id);
			var cur = $('#imp').val();
			var a = cur.substring(cur.indexOf('\n') + 1);
			$('#imp').val(a);
			});
	}
}

var next;


function searchYoutube(query, limit, tab, callback) {
	$.ajax({
		url : "https://gdata.youtube.com/feeds/api/videos?q=" + query + " " + tab + "&max-results=" + limit + "&format=5&v=2",
		dataType : 'xml',
	}).done(function(xml) {
		$('#' + tab).html("");
		$(xml).find('entry').each(function() {
			var title = $(this).children('title').text();
			var artist = $(this).children('author').children('name').text();
			var imageSource = $(this).find("media\\:thumbnail, thumbnail").first().attr('url');
			var link = $(this).find("id").text();
			var videoID = link.substr(link.search('video:') + 6);
			callback(videoID);
		});
	}).fail(function(data) {
		$('#' + tab).html("Could not get your videos. Please check your internet connection.");
	});
}

$(window).on('load', function(){
	next = $('#imp').val().split('\n')[0];
	})
$('#imp').on('input propertychange', function() {
	next = $(this).val().split('\n')[0];
});

