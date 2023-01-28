var site = {
	started : false,
	loaded : false,
	ready : false,
	navSelected : undefined,
	page : undefined,
	wasEntrance : true, //boolean for displaying nav at end of 'about'
	bulkTextFontSize: 0,
	titleTextFontSize: 0
};

var stages = {
	opening : undefined,
	about : undefined,
	offer1 : undefined,
	offer2 : undefined,
	contact : undefined,

	nextStage : function(nextPage,fadePrev) {
		site.page = nextPage;
		nextPage.entrance(fadePrev);
	},
	clear : function() {
		clearAll();
	}
};

var settings = {
	navFadeInTime : 1000,
	textContainerFadeTime : 1500,
	circleSize : 50,
	howFarLeft : 15,
	remainWidth : undefined,
	innerTextRightMargin : 0.3,
	innerTextLeftMargin : 0.2,
	init : function() {
		this.remainWidth = (100 - this.howFarLeft*2) + "%";
		return this;
	}
}.init();


var dynamicSizes = {
	circleDiameter : undefined,
	updateSizes : function() {
		this.circleDiameter = parseInt($('section').height() * settings.circleSize * 0.01);
	}
};


WebFont.load({
	custom: {
		families: ['gloss-bloom','gothic','gothicb']
	},
	active: function() {
		console.log("FONTS RENDERED!\n");

		site.fonts_loaded = true;
		if ( site.fonts_loaded == true && site.ready == true && site.started == false ) {
			site.started = true;
			site.page.entrance();
		}
	}
});

function navResize() {
	var nav = $("nav");
	nav.css({
		"font-size" : "128px",
		"line-height" : nav.height() + "px"
	}).invisible();
	shrinkToFit("both",nav);

	console.log('resizing nav');
}




// CONSTRUCTOR FUNCTION
// the page that first appears on the website
var openingTemplate = function() {
	this.depthCounter = 4;

	//callback
	this.onFullyLoaded = undefined;
};

openingTemplate.prototype.entrance = function() {
	console.log("first page!! running\n");
	var self = this;
	var cd = dynamicSizes.circleDiameter;

	this.depthCounter = 4;

	var franklogo = createElementWithClass('circle','section');
	franklogo.css({
		"background-image" : "url(logo.png)",
		"background-size" : "contain",
		"background-repeat" : "no-repeat",
		"z-index" : this.depthCounter + '',
		"height" : cd + "px",
		"width" : cd + "px",
		// this margin is for centering it .. need it so the  animation shit works, trasnlate 50% dont work
		"margin-left" : '-' + parseInt(cd*0.5) + "px"
	}).addClass("marginCircle");

	setTimeout(
		function () {
			// honest is to be placed behind franklogo
			// franklogo will fade out to reveal honest
			// removes its marginCircle id
			var honest = franklogo.clone().attr("id","honest").appendTo('section');

			self.depthCounter--;
			
			honest.css({
				"background-color" : "white",
				"background-image" : "none",
				"z-index" : self.depthCounter + ''
			});

			var hup = createElementWithClass('white-paint',honest);
			hup.text('"Honest upfront interior design"')
			.css({
				"line-height" : (hup.height()*0.5) + "px",
				"text-align" : "center",
				"color" : "black"
			})
			.css("font-size","64px").invisible();
			shrinkToFit("vertical",hup, {afterShrink: function() {
				// bye bye franklogo
				franklogo.animate({opacity: "0"}, 2000, function () {
					// franklogo has faded out, so remove him!
					franklogo.remove();

					// circle 2 has text in it and moves
					// circle 1 is Frank logo

					// freeze for 2 sec before move
					honest.delay(2000);

					// LEFT LEFT LEFT
					// notice it removes margin-left
					honest.animate({left: settings.howFarLeft + "%",'margin-left':0},1000, function() {
						// prevent the resize from applying negative margin now pls.
						honest.removeClass("marginCircle");
						// when animation to the left has finished
						
						if ( self.onFullyLoaded ) {
							self.onFullyLoaded();
						}
						
					});

				});	
			}});
			// whitepaint.animate({"opacity":"1"},250);
		}
	, 2000); //setTimeout
};

openingTemplate.prototype.onResize = function() {

	var cd = dynamicSizes.circleDiameter;

	// all circles - everything is a circle
	$('.circle').css({
		"height" : cd + "px",
		"width" : cd + "px"
	});

	// console.log("setting margin left from : " + $('#marginCircle').css("margin-left"));
	$('.marginCircle').css("margin-left", '-' + parseInt(cd*0.5) + "px");
	// console.log("to : " + $('#marginCircle').css("margin-left"));
	var hup = $(".white-paint");
	hup.css({
		// "z-index": "2",
		"color" : "black",
		"font-size" : "64px",
		"line-height" : (hup.height()*0.5) + "px",
		"opacity" : "1"
	}).invisible();
	shrinkToFit("vertical",hup);
	// whitepaint.animate({"opacity":"1"},100);
	
}

// this is the contact page atm ...
var basicPageTemplate = function() {
	this.depthCounter = 3;
};

basicPageTemplate.prototype.entrance = function() {
	var self = this;
	this.depthCounter = 3;
	var cd = dynamicSizes.circleDiameter;

	var behindCircle = createElementWithClass('circle','section');
	behindCircle.css({
		"background-color" : "black",
		"z-index" : this.depthCounter + '',
		"height" : cd + "px",
		"width" : cd + "px",
		"left" : settings.howFarLeft + "%"
	});

	var getInTouch = createElementWithClass('contact-touch',behindCircle);
	getInTouch.text("Get in contact");
	getInTouch.css({
		"font-size" : "64px",
		"line-height" : (getInTouch.height()) + "px"
	}).invisible();
	shrinkToFit("vertical",getInTouch);


	// white background thing
	this.depthCounter--;
	var o = self.bgOval = behindCircle.clone().appendTo('section');
	o.empty();
	o.removeClass('circle').attr("id","oval");
	o.css({
		"background-color" : "white",
		"z-index" : self.depthCounter + '',
		"background-image" : "none"
	}).animate({width: settings.remainWidth},2000, function() {	
		// create text container rect div
		var textcontainer = createElementWithClass('text-container',o);
		textcontainer.css({
			"left" : (cd + cd * settings.innerTextLeftMargin) + "px",
			"right" : parseInt(cd*settings.innerTextRightMargin) + "px"
		});
		var midtext = createElementWithClass('contact-mid',textcontainer);
		
		// more content creates small font-size .. so wanna use that as the 'standard'
		// but its controlled by height space in pixels
		// the title is sometimes 2 lines can be problematic
		var oo = "studio@frankinteriordesign.co.uk";
		// var oo = "abcabacacdfsdfs";
		midtext.html(htmlForTextWithEmbeddedNewlines(oo));
		
		midtext.css({
			"font-size" : "64px"
		}).invisible();
		
		shrinkToFit("both",midtext
			,{afterShrink: function() {
			textcontainer.animate({"opacity":"1"},settings.textContainerFadeTime, function() {
				
			});
			
		}}
		);	
		
		// self.writeParaText();
	});
};


// contact us page
basicPageTemplate.prototype.onResize = function() {

	var cd = dynamicSizes.circleDiameter;

	console.log(cd);

	// all circles - everything is a circle
	$('.circle').css({
		"height" : cd + "px",
		"width" : cd + "px"
	});

	// but this is an oval
	$("#oval").css({
		"height" : cd + "px"
	});


	var textcontainer = $('.text-container');
	textcontainer.css({
		"left" : (cd + cd * settings.innerTextLeftMargin) + "px",
		"right" : parseInt(cd*settings.innerTextRightMargin) + "px"
	});

	var midtext = $('.contact-mid');
	midtext.css({
		"font-size" : "64px"
	}).invisible();
	
	shrinkToFit("both",midtext
		// 	,{afterShrink: function() {
		// 	textcontainer.animate({"opacity":"1"},settings.textContainerFadeTime, function() {
				
		// 	});
			
		// }}
	);	

	var getInTouch = $('.contact-touch');
	getInTouch.css({
		"font-size" : "64px",
		"line-height" : (getInTouch.height()) + "px"
	}).invisible();
	shrinkToFit("vertical",getInTouch);
	
};



// common page that most of website is built around
var ballLeftTemplate = function( circleImage) {
	// the image the circle on left will fade into.
	this.circleImage = circleImage;

	// some depth counter that decreases lol
	this.depthCounter = 3;

	// elements stored here -- needed for resize func access
	this.bgOval = undefined;


	// extra options function callbacks
	this.nextPageHandler = undefined;
	this.onFullyLoaded = undefined;

	// What text they want on this one?
	this.textTitle = "";
	this.textBulk = "";
	this.flipText = "";

	this.dende = 'dende';

};

// Start the 'entrance' moves...
ballLeftTemplate.prototype.entrance = function(fadeMeOut) {
	var self = this;
	var cd = dynamicSizes.circleDiameter;

	// some depth counter that decreases lol
	this.depthCounter = 3;

	var behindCircle = undefined;

	this.depthCounter--;
	// it wants to fadeout a currently existed element
	if ( fadeMeOut ) {
		behindCircle = fadeMeOut.clone().appendTo('section');
		// it was cloned so empty it please.
		behindCircle.empty();

		behindCircle.css({
			"background-image" : "url(" + this.circleImage + ")",
			"background-size" : "contain",
			"background-repeat" : "no-repeat",
			"z-index" : this.depthCounter + ''
		});

		// 2 seconds into when ball is the 'stage' there is still previous thing visible for 2 secs
		// don't forget to perform fadeout
		fadeMeOut.animate({opacity:"0"},2000, function () {self.entrance_part2(behindCircle,fadeMeOut)});
	} else {
		// no fadeout so simply create the element and position it
		behindCircle = createElementWithClass('circle','section');
		behindCircle.css({
			"background-image" : "url(" + this.circleImage + ")",
			"background-size" : "contain",
			"background-repeat" : "no-repeat",
			"z-index" : this.depthCounter + '',
			"height" : cd + "px",
			"width" : cd + "px",
			"left" : settings.howFarLeft + "%"
		});
		this.entrance_part2(behindCircle);
	}
};


ballLeftTemplate.prototype.entrance_part2 = function(behindCircle,iFaded) {
	var self = this;
	var cd = dynamicSizes.circleDiameter;
	if ( iFaded ) {
		iFaded.remove();
	}
	
	// white background thing
	this.depthCounter--;
	var o = self.bgOval = behindCircle.clone().appendTo('section');
	o.removeClass('circle').attr("id","oval");
	o.css({
		"background-color" : "white",
		"z-index" : self.depthCounter + '',
		"background-image" : "none"
	}).animate({width: settings.remainWidth},2000, function() {

		
		// create text container rect div
		var textcontainer = createElementWithClass('text-container',o);
		textcontainer.css({
			"left" : cd + "px",
			"right" : parseInt(cd*settings.innerTextRightMargin) + "px"
		});
		textcontainer.css({
			"left" : (cd + cd * settings.innerTextLeftMargin) + "px"
		});
		var texttitle = createElementWithClass('about-title',textcontainer);
		


		// more content creates small font-size .. so wanna use that as the 'standard'
		// but its controlled by height space in pixels
		// the title is sometimes 2 lines can be problematic
		texttitle.html(htmlForTextWithEmbeddedNewlines(self.textTitle));
		
		texttitle.css("font-size","64px").invisible();
		// saving this for some reason
		shrinkToFit("vertical",texttitle, function() {
			site.titleTextFontSize = texttitle.css("font-size");
		});	
		
		self.writeParaText();
	});
};

ballLeftTemplate.prototype.writeParaText = function() {

	var textpara = createElementWithClass('about-para',$('.text-container'));
	textpara.html(htmlForTextWithEmbeddedNewlines(this.textBulk));
	if ( this.bulkLargest ) {
		// this is the object that decides all other's size
		// so allow shrink here

		console.log("largest");
		textpara.css("font-size","64px").invisible();
		shrinkToFit("vertical",textpara,this);
	} else {
		console.log("not largest");
		textpara.css("font-size",site.bulkTextFontSize);
		this.afterShrink();
	}
};

ballLeftTemplate.prototype.afterShrink = function() {
	var self = this;
	var cd = dynamicSizes.circleDiameter;

	console.log("what?");
	console.log(this.dende);

	// save this after the shrink... for other pages
	site.bulkTextFontSize = $('.about-para').css("font-size");
	$('.text-container').animate({"opacity":"1"},settings.textContainerFadeTime, function() {
		pageflip = $(document.createElement('div'));
		// aboutOval is a stacking context so.
		// make sure that pageflip is behind textContainer

		pageflip.css({
			"background-image" : "url(quadrant.png)",
			"background-size" : "contain",
			"background-repeat" : "no-repeat",
			"right" : "0",
			"bottom" : "0",
			"position": "absolute",
			"width": (cd * 0.5) + "px",
			"height": (cd * 0.5) + "px",
			"z-index" : "-1"
		}).attr("id","page-flip");
		pageflip.appendTo("#oval");

		pageflip.addClass("pointer-please");

		pageflip.click(function () {
			if ( self.nextPageHandler ) {
				self.nextPageHandler();
			}
			
		});
		

		
		var fliptitle = $(document.createElement('div'));

		fliptitle.css({
			"left" : "-75%",
			"right" : "100%",
			"position": "absolute",
			"top" : "50%",
			"bottom" : "15%",
			// "background-color" : "red",
			"font-family" : "gloss-bloom",
			"text-align" : "right",
			"visibility" : "hidden",
			"font-size" : "64px",
			"line-height"  :"normal"
			
			// "overflow": "hidden"
		}).attr("id","flip-title");
		fliptitle.text(self.flipText);
		fliptitle.appendTo(pageflip);
		shrinkToFit("vertical",fliptitle);
		// fliptitle.animate({"opacity":"1"},100);
		fliptitle.hide();
		fliptitle.fadeIn(3000);


		if ( self.onFullyLoaded ) {
			self.onFullyLoaded();
		}
	});
	
}

ballLeftTemplate.prototype.onResize = function() {
	console.log("BALL-LEFT onResize");

	var cd = dynamicSizes.circleDiameter;

	console.log(cd);

	// all circles - everything is a circle
	$('.circle').css({
		"height" : cd + "px",
		"width" : cd + "px"
	});

	// but this is an oval
	$("#oval").css({
		"height" : cd + "px"
	});

	var textcontainer = $(".text-container");
	textcontainer.css({
		"left" : parseInt(cd + cd * settings.innerTextLeftMargin) + "px",
		"right" : parseInt(cd*settings.innerTextRightMargin) + "px",
		"opacity" : "0"
	});

	
	var texttitle = $(".about-title");
	texttitle.css("font-size","64px").invisible();
	shrinkToFit("vertical",texttitle);
	


	var textpara = $(".about-para");
	textpara.css("font-size","64px").invisible();
	shrinkToFit("vertical",textpara,{ afterShrink : function() {
		textcontainer.animate({"opacity":"1"},settings.textContainerFadeTime);
	} } );
	

	
	$("#page-flip").css({
		"width": (cd * 0.5) + "px",
		"height": (cd * 0.5) + "px"
	});

	
	var fliptitle = $("#flip-title");
	fliptitle.css("font-size","64px").invisible();
	shrinkToFit("vertical",fliptitle);


	// REALLY UGLY FIX because this stage overlaps from previous one
	var hup = $(".white-paint");
	hup.css({
		// "z-index": "2",
		"color" : "black",
		"font-size" : "64px",
		"line-height" : (hup.height()*0.5) + "px",
		"opacity" : "1"
	}).invisible();
	shrinkToFit("vertical",hup);
	
};

// so now the thing which controls the height is the font, , the font and nothing else but the font.

$(window).on('resize', function () {
	// updates things like circleDiamater pixel distance which is based on height %
	dynamicSizes.updateSizes();

	navResize();
	site.page.onResize();


	// $("nav").

});

$(function() {
	console.log("start ready");
	// updates things like circleDiamater pixel distance which is based on height %
	dynamicSizes.updateSizes();
	$.easing._default = "linear";


	navResize();


	// since i am using shrink text technique.
	// it generally looks stupid if the text is not the same size as the tab with most text content
	// each time window resizes i must recalculate that height from first tab(because 1st tab has most content)

	var nn = new openingTemplate();
	nn.nav = "#about";
	site.page = stages.opening = nn;

	nn = new ballLeftTemplate("Images/Farmer%20Frank%20Roundel.png");
	nn.nav = "#about";
	nn.textTitle = 'Frank. Honest. Upfront.';
	// nn.textBulk = "Frank believes in honest interior design. Upfront fees, Upfront timescales and straight talking design solutions.\n\n With 4 years experience in the F&B sector, Laura has gained a strong understanding of how design and practicality work hand in hand in this exciting design sector. The challenge of combining branding with the interior comes naturally to her and is where she thrives in combining these cross disciplinary skills.";
	nn.textBulk = "Frank Interior Design specialises in the Food & Beverage sector; working on an array of restaurants, bars, caf\u00E9s and coffee shops.\n\nWith the cross disciplinary nature of the sector, Frank understands the importance of a holistic design approach combining both interior and branding.\n\nAll with Frank's philosophy at heart; believing in honest interior design. Upfront fees, upfront timescales and straight-talking design solutions."
	nn.flipText = "The Offer";
	nn.bulkLargest = true;
	stages.about = nn;
	stages.opening.next = stages.about;

	// offer1
	nn = new ballLeftTemplate("Images/Teal%20Sample%20Board%20Roundel.png");
	nn.nav = "#offer";
	nn.textTitle = "Design Concept Pack  \u00A3475 (3 days lead time)";
	nn.textBulk = "Based on given brief, a PDF document will be collated to include; Mood inspiration, Interior look & feel, Materials palette, furniture & lighting";
	nn.flipText = "Next stage";
	stages.offer1 = nn;
	stages.about.next = stages.offer1;

	// offer2
	nn = new ballLeftTemplate("Images/Laser%20Roundel.png");
	nn.nav = "#offer";
	nn.textTitle = "Proposed CAD Layout  \u00A31,500 (1 week lead time)";
	nn.textBulk = "Including:\n\n\u2022 Site Visit & Measured survey\n\u2022 Computer Aided Existing Layout\n\u2022 Computer Aided Proposed Layout";
	nn.flipText = "Next stage";
	stages.offer2 = nn;
	stages.offer1.next = stages.offer2;

	// offer3
	nn = new ballLeftTemplate("Images/CAD%20Roundel.png");
	nn.nav = "#offer";
	nn.textTitle = "Tender Drawing Pack  \u00A34,500 (2 weeks lead time)";
	// nn.textBulk = "Including:\n\u2022 Floor finishes plan\n\u2022 Toilet details\n\u2022 Ceiling & Lighting plan\n\u2022 Bar details\n\u2022 Wall Finishes plan\n\u2022 Waiterpoint details\n\u2022 furniture plan\n\u2022 Banquette details\n\u2022 Interior Elevations\n\u2022 Booth details\n\u2022 Exterior Elevations";
	nn.textBulk = "";
	nn.flipText = "Get in touch";
	// overwrite the text routine
	nn.writeParaText = function() {
		var textpara = createElementWithClass('about-para',$('.text-container'));
		// textpara.html(htmlForTextWithEmbeddedNewlines(this.textBulk));

		// create left
		var left = $(document.createElement('div'));
		left.css({
			"float": "left",
			"width": "50%",
			"height" : "100%"
			// "background-color": "black"
		}).appendTo(textpara);
			``````````````````````````````````````````````````````````````````````````````````
		left.html(htmlForTextWithEmbeddedNewlines("Including:\n\n\u2022 Floor finishes plan\n\u2022 Ceiling & Lighting plan\n\u2022 Wall Finishes plan\n\u2022 Furniture plan\n\u2022 Interior Elevations\n\u2022 Exterior Elevations"));
		// create right
		var right = $(document.createElement('div'));
		right.css({
			"float": "left",
			"width": "50%",
			"height" : "100%"
			// "background-color": "pink"
		}).appendTo(textpara);

		right.html(htmlForTextWithEmbeddedNewlines("\n\u2022 Toilet details\n\u2022 Bar details\n\u2022 Waiterpoint details\n\u2022 Banquette details\n\u2022 Booth details"));
		// $(".text-container").css("opacity","1");

		if ( this.bulkLargest ) {
			// this is the object that decides all other's size
			// so allow shrink here

			console.log("largest");
			textpara.css("font-size","64px").invisible();
			shrinkToFit("vertical",textpara,this);
		} else {
			console.log("not largest");
			textpara.css("font-size",site.bulkTextFontSize);
			this.afterShrink();
		}
	};
	stages.offer3 = nn;
	stages.offer2.next = stages.offer3;


	
	stages.contact = new basicPageTemplate();
	stages.contact.nav = "#contact";
	stages.offer3.next = stages.contact;


	stages.opening.onFullyLoaded = function() {
		stages.nextStage(stages.about,$("#honest"));
	};

	var genericPageNext = function() {
		if ( site.page.next ) {
			stages.clear();
			stages.nextStage(site.page.next);
			selectNav($(site.page.nav));
		}
	};
	stages.about.nextPageHandler = genericPageNext;
	stages.about.onFullyLoaded = function() {
		// nav bar should fade in after entrance hm
		// need boolean to remember if entrance was played?
		// selectNav($("#about"));
		// display nav
		if ( site.wasEntrance ) {
			site.wasEntrance = false;
			selectNav($(site.page.nav));
			$("nav").animate({"opacity" : "1"},settings.navFadeInTime);
		}
	};
	stages.offer1.nextPageHandler = genericPageNext;
	stages.offer1.onFullyLoaded = function() {
		
	};
	stages.offer2.nextPageHandler = genericPageNext;
	stages.offer2.onFullyLoaded = function() {
		
	};
	stages.offer3.nextPageHandler = genericPageNext;
	stages.offer3.onFullyLoaded = function() {

	};
	

	$("#about").click(function() {
		// deletes elements
		stages.clear();
		// sets site.page to next 'template' object & begins its animation sequences
		stages.nextStage(stages.about);
		// update navbar selection
		selectNav($(site.page.nav));
	});

	$("#offer").click(function() {
		stages.clear();
		stages.nextStage(stages.offer1);
		selectNav($(site.page.nav));
	});
	$("#contact").click(function() {
		stages.clear();
		stages.nextStage(stages.contact);
		selectNav($(site.page.nav));
	});

	$('body').hide().show();	
	console.log("finish ready");
	
	site.ready = true;

	if ( site.fonts_loaded == true && site.loaded == true && site.started == false ) {
		site.started = true;
		site.page.entrance();
	}
	
} );


$( window ).on( "load", function() {
	site.loaded = true;
	console.log("loaded bleh");
	if ( site.fonts_loaded == true && site.ready == true && site.started == false ) {
		site.started = true;
		site.page.entrance();	
	}
	
});

function createElementWithClass(classname,childof)
{
	classname = classname + " live";
	return $( "<div></div>" ,{'class': classname}).appendTo(childof);
}

function htmlForTextWithEmbeddedNewlines(text) {
    var htmls = [];
    var lines = text.split(/\n/);
    var i;
    // The temporary <div/> is to perform HTML entity encoding reliably.
    //
    // document.createElement() is *much* faster than jQuery('<div></div>')
    // http://stackoverflow.com/questions/268490/
    //
    // You don't need jQuery but then you need to struggle with browser
    // differences in innerText/textContent yourself
    var tmpDiv = $(document.createElement('div'));
    for (i = 0 ; i < lines.length ; i++) {
        htmls.push(tmpDiv.text(lines[i]).html());
    }
    return htmls.join("<br>");
}

function shrinkToFit(mode,ele, doAfter) {
	try {
		if ( mode == 'vertical' ) {
			if ( ele[0].scrollHeight >  ele[0].offsetHeight) {
				// the text size is too big
				// decrease font size and try again
				ele.css('font-size',(parseFloat(ele.css('font-size')) - 1) + 'px' );

				// it must be staggered like this else it doesn't work
				setTimeout(function() { shrinkToFit(mode,ele,doAfter); }, 1);
			} else { 
				// final make visible
				ele.visible();

				if ( doAfter ) {
					console.log("Final shrink");
					doAfter.afterShrink();
				}
			}	
		} else if ( mode == "horizontal" ) {
			if ( ele.innerWidth() >  ele.parent().innerWidth() ) {
				// the text size is too big
				// decrease font size and try again
				ele.css('font-size',(parseFloat(ele.css('font-size')) - 1) + 'px' );

				// it must be staggered like this else it doesn't work
				setTimeout(function() { shrinkToFit(mode,ele,doAfter); }, 1);
			} else { 
				// final make visible
				ele.visible();

				if ( doAfter ) {
					console.log("Final shrink");
					doAfter.afterShrink();
				}
			}	
		} else if ( mode == "both" ) {
			if ( ele.innerWidth() >  ele.parent().innerWidth() || ele[0].scrollHeight >  ele[0].offsetHeight) {
				// the text size is too big
				// decrease font size and try again
				console.log("decreasing font size");
				ele.css('font-size',(parseFloat(ele.css('font-size')) - 1) + 'px' );

				// it must be staggered like this else it doesn't work
				setTimeout(function() { shrinkToFit(mode,ele,doAfter); }, 1);
			} else { 
				console.log("making visible now");
				// final make visible
				ele.visible();
				
				if ( doAfter ) {
					console.log("Final shrink with mode " + mode);
					doAfter.afterShrink();
				}
			}
		}
	}	
	
	catch(e) {

	}
}


function clearAll() {
	$("section").children().clearQueue();
	$("section").children().stop();

	// fade out then remove all elements
	// clear canvas
	$("section").children().animate({"opacity":"0"},500,function(){
		// console.log(this);
		$(this).remove();
	});
}

function selectNav(newselect) {
	if ( site.navSelected ) {
		site.navSelected.removeClass('nav-select');
	}
	// welcome to the about section! :)
	newselect.addClass('nav-select');
	site.navSelected = newselect;
}


jQuery.fn.visible = function() {
    return this.css('visibility', 'visible');
};

jQuery.fn.invisible = function() {
    return this.css('visibility', 'hidden');
};

jQuery.fn.visibilityToggle = function() {
    return this.css('visibility', function(i, visibility) {
        return (visibility == 'visible') ? 'hidden' : 'visible';
    });
};