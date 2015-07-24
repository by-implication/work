
// TODO: refactor -- remove reliance on IDs, zepto/jq

function randomDraw (elements, GID, initialDelay, propagationDelay) {

	var things = $(elements);

	// init

	// temporarily disable transitions -- http://stackoverflow.com/questions/11131875/what-is-the-cleanest-way-to-disable-css-transition-effects-temporarily
	// deal with SVG class manipulation -- http://stackoverflow.com/questions/8638621/jquery-svg-why-cant-i-addclass

	$(elements).attr('class', function(index, classNames) {
	    return classNames + ' killtransition';
	});

	// triggers DOM reflow (hack for transition disabling -- see link above)

	$(elements).each(function(){
		this.getBBox();
	});

	// eh

	things.forEach(function(element, index){
		element.id = GID + index;
	})

	var totalThings = things.length;

	var path = new Array();
	var length = new Array();

	// compute the actual length of line per path
	// use that as the stroke-dash length

	for(var i=0; i<totalThings;i++){
		path[i] = document.getElementById(GID+i);
		l = path[i].getTotalLength();
		length[i] = l;
		path[i].style.strokeDasharray = l + ' ' + l; 
		path[i].style.strokeDashoffset = l;
	}

	$(elements).each(function(){
		this.getBBox();
	});

	// restore transitions (verbose because SVG)

	$(elements).attr('class', function(index, classNames) {
	    return classNames.replace('killtransition', '');
	});

	// randomize order

	function doTheShuffle(array) {
	    for (var i = array.length - 1; i > 0; i--) {
	        var r = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[r];
	        array[r] = temp;
	    }
	    return array;
	}

	doTheShuffle(path);

	// draw!
	// this merely sets the dash offset
	// relies on CSS transitions for "animation"

	var j = -1;

	function drawNext() {
	  if (j++ < path.length -1 ) {

	  	if(Math.random() > 0.5) {

  			// resetting offset to 0 "draws" the line

			path[j].style.strokeDashoffset = "0";

	  	} else {

	  		// reverse direction
	  		// (twice the dash-length)

	  		path[j].style.strokeDashoffset = path[j].style
	  		.strokeDasharray
	  		.substr(0, path[j]
	  			.style
	  			.strokeDasharray
	  			.indexOf('p')) * 2;

	  	}

	  	// delay drawing the next line in the series

	    setTimeout(drawNext, propagationDelay);
	  }
	}

	// delay before drawing the first line
	// yeah it's called drawNext, deal with it

	setTimeout(drawNext, initialDelay);

}

// the main logo

randomDraw(".semicircle", "c", 150, 10)
randomDraw(".outline, .shading path, .logo .edges", "i", 450, 20);


// hide lineart off-screen (pre-scroll)

$(".lineart").attr("visibility", "hidden");


// scrolling things

var timer;
var done = false; 


$(window).scroll(function(){

	// timer so this isn't fired every single pixel we scroll
	// (for slower computers)

    if ( timer ) clearTimeout(timer);

    timer = setTimeout(function(){

		var $myEl        = $('.lineart');
		var $window      = $(window); 
		var myTop        = $myEl.offset().top;
		var windowTop    = $window.scrollTop();
		var windowBottom = windowTop + $window.height();

		// console.log($myEl);
		// console.log($window);
		// console.log("myTop:        " + myTop);
		// console.log("windowTop:    " + windowTop);
		// console.log("windowBottom: " + windowBottom);

		// play only once while we're on-screen.
		// reset state when off. (maybe too much?)


		if (myTop > windowTop && myTop < windowBottom && !done) {
			$(".lineart").attr("visibility", "visible");
    		console.log("redraw fired")
			randomDraw(".lineart path", "x", 100 , 150);
			done = true;
		} else {
			if (!(myTop > windowTop && myTop < windowBottom)) {
				done = false;
				$(".lineart").attr("visibility", "hidden");
			}
		}

    }, 400);
});

// thanks http://stackoverflow.com/questions/8114611/check-if-div-is-viewable-in-window


