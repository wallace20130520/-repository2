<%@ page trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="template" tagdir="/WEB-INF/tags/responsive/template"%>
<%@ taglib prefix="cms" uri="http://hybris.com/tld/cmstags"%>
<%@ taglib prefix="product" tagdir="/WEB-INF/tags/responsive/product" %>
<%@ taglib prefix="quickorder" tagdir="/WEB-INF/tags/responsive/quickorder" %>

<spring:htmlEscape defaultHtmlEscape="true" />
<spring:theme code="product.grid.confirmQtys.message" var="gridConfirmMessage"/>

<template:page pageTitle="${pageTitle}">
	<div id="quickOrder" class="account-section" data-grid-confirm-message="${gridConfirmMessage}">
	 <script type="text/javascript">
	 var inklanguages = new Map();
	 inklanguages.set("ja","ja-JP");
	 inklanguages.set("en","en-US");
	 inklanguages.set("de","de-DE");
	 inklanguages.set("zh","zh-CN");

	 SERVER_ADDRESS = "https://azurehackationinkrecognizer.cognitiveservices.azure.com";
	 ENDPOINT_URL = SERVER_ADDRESS + "/inkrecognizer/v1.0-preview/recognize";
	 SUBSCRIPTION_KEY = "51fc9d78a7ce4a44af78c156d36f3137";

	 // Languages for user to try
	 LANGUAGE_TAGS_TO_TRY = ["en-US", "de-DE", "en-GB", "fr-FR", "hi-IN", "ja-JP", "ko-KR", "zh-CN"];

	 // Window.devicePixelRatio could change, e.g., when user drags the window to a display with different pixel density,
	 // however, there is no callback or event available to detect the change.    
	 // In this sample, we assume devicePixelRatio doesn't change.
	 PIXEL_RATIO = window.devicePixelRatio;
	 MILLIMETER_PER_INCH = 25.4;
	 PIXEL_PER_INCH = 96;
	 MILLIMETER_TO_PIXELS = PIXEL_PER_INCH / (MILLIMETER_PER_INCH * PIXEL_RATIO);
	 PIXEL_TO_MILLIMETERS = MILLIMETER_PER_INCH * PIXEL_RATIO / PIXEL_PER_INCH;
	 
	 
	 function NetworkException(xhttp) {
		    Error.call(this, xhttp.responseText);
		    this.name = "NetworkException";
		    this.status = xhttp.status;
		}

		function InkRecognitionException(message) {
		    Error.call(this, message);
		    this.name = "InkRecognitionException";
		}

		function BadRequestException(xhttp) {
		    InkRecognitionException.call(this, "");
		    this.name = "BadRequestException";
		    this.status = xhttp.status;
		    this.rawMessage = xhttp.responseText;
		    var messageArray = JSON.parse(this.rawMessage).details
		    var message = [];
		    for (var index = 0; index < messageArray.length; index += 1) {
		        messageArray[index] = messageArray[index].message;
		    }
		    this.message = messageArray.join("<br/>");
		}

		UNIT_CATEGORY_TO_TYPE = {
		    inkDrawing: Shape,
		    inkWord: Word,
		    line: Line,
		    inkBullet: Bullet
		};

		function RecognitionUnit(unitJObject) {
		    this.json = unitJObject;
		    this.id = unitJObject.id;
		    this.strokeIds = unitJObject.strokeIds;
		    this.category = unitJObject.category;
		    this.class = unitJObject.class;
		    this.isLeaf = (this.class === "leaf");
		    this.children = this.isLeaf ? [] : unitJObject.childIds;
		    this.parent = unitJObject.parentId;
		    this.boundingRectangle = unitJObject.boundingRectangle;
		    this.rotatedBoundingRectangle = unitJObject.rotatedBoundingRectangle;
		}

		function Shape(unitJObject) {
		    RecognitionUnit.call(this, unitJObject);

		    this.center = unitJObject.center;
		    this.confidence = unitJObject.confidence;
		    this.shape = unitJObject.recognizedObject;
		    this.rotationAngle = unitJObject.rotationAngle;
		    this.points = unitJObject.points;

		    this.getAlternates = function (alternatesJArray) {
		        if (typeof (alternatesJArray) === "undefined" || !alternatesJArray || alternatesJArray.length === 0) {
		            return [];
		        }
		        var alternates = [];
		        alternatesJArray.map(function (obj) {
		            alternates.push({
		                "shape": obj.recognizedString,
		                "points": obj.points,
		                "rotationAngle": obj.orientation
		            });
		        });
		        return alternatesJArray;
		    };
		    this.alternates = this.getAlternates(unitJObject.alternates);
		}

		function Word(unitJObject) {
		    RecognitionUnit.call(this, unitJObject);
		    this.text = unitJObject.recognizedText

		    this.getAlternates = function (alternatesJArray) {
		        if (typeof (alternatesJArray) === "undefined" || !alternatesJArray || alternatesJArray.length === 0) {
		            return [];
		        }

		        return alternatesJArray.map(function (obj) {
		            return obj.recognizedString;
		        });
		    };

		    this.alternates = this.getAlternates(unitJObject.alternates);
		}

		function Line(unitJObject) {
		    RecognitionUnit.call(this, unitJObject);
		    this.text = unitJObject.recognizedText
		}

		function Bullet(unitJObject) {
		    RecognitionUnit.call(this, unitJObject);
		    this.text = unitJObject.recognizedText
		}

		function InkRecognitionResult(xhttp) {
		    var json = JSON.parse(xhttp.responseText);

		    var optionalProperties = ['language', 'unit', 'version'];
		    optionalProperties.forEach(function (e) {
		        if (json.hasOwnProperty(e)) {
		            this[e] = json[e];
		        }
		    });

		    InkRecognitionResult.prototype.convertJObjectToUnit = function (unitJObject) {
		        var category = unitJObject.category;
		        var classType = UNIT_CATEGORY_TO_TYPE[category];
		        if (classType) {
		            return new classType(unitJObject);
		        } else {
		            return new RecognitionUnit(unitJObject);
		        }
		    };

		    var that = this;
		    this.recognitionUnits = json.recognitionUnits.map(function (u) {
		        return that.convertJObjectToUnit(u);
		    });

		    InkRecognitionResult.prototype.findByCategory = function (category) {
		        return this.recognitionUnits.filter(function (u) {
		            return u.category === category;
		        });
		    };

		    InkRecognitionResult.prototype.findShapes = function () {
		        return this.findByCategory("inkDrawing");
		    };

		    InkRecognitionResult.prototype.findWords = function () {
		        return this.findByCategory("inkWord");
		    };

		    InkRecognitionResult.prototype.findBullets = function () {
		        return this.findByCategory("inkBullet");
		    };

		    InkRecognitionResult.prototype.findLines = function () {
		        return this.findByCategory("line");
		    };

		    InkRecognitionResult.prototype.findParagraphs = function () {
		        return this.findByCategory("paragraph");
		    };

		    InkRecognitionResult.prototype.findListitems = function () {
		        return this.findByCategory("listItem");
		    };

		    InkRecognitionResult.prototype.findWritingRegions = function () {
		        return this.findByCategory("writingRegion");
		    };
		}

		function Recognizer(url, subscriptionKey, language, version) {
		    this.url = url;
		    this.subscriptionKey = subscriptionKey;
		    this.language = (typeof (language) === "undefined" || !language) ? "en-US" : language;
		    this.version = (typeof (version) === "undefined" || !version) ? 1 : version;

		    this.returnFunction = null;
		    this.errorFunction = null;
		    this.strokes = [];

		    Recognizer.prototype.addStroke = function (id, data) {
		        this.strokes.push({
		            "id": id,
		            "points": data
		        });
		    };

		    Recognizer.prototype.data = function () {
		        var cloudIAFormat = {
		            version: this.version,
		            language: this.language,
		            strokes: this.strokes
		        };
		        return JSON.stringify(cloudIAFormat);
		    };

		    Recognizer.prototype.recognize = function (returnFunction, errorFunction) {
		        this.returnFunction = returnFunction;
		        this.errorFunction = errorFunction;

		        var xhttp = new XMLHttpRequest(),
		            error, result;
		        xhttp.onreadystatechange = function () {
		            if (this.readyState === 4) {
		                switch (this.status) {
		                    case 200:
		                        result = new InkRecognitionResult(xhttp);
		                        returnFunction(result, xhttp.responseText);
		                        break;

		                    case 400:
		                        error = new BadRequestException(xhttp);
		                        errorFunction(error);
		                        break;

		                    default:
		                        error = new NetworkException(xhttp);
		                        errorFunction(error);
		                        break;
		                }
		            }
		        };
		        xhttp.open("PUT", this.url, true);
		        xhttp.setRequestHeader("Ocp-Apim-Subscription-Key", this.subscriptionKey);
		        xhttp.setRequestHeader("Content-Type", "application/json");
		        xhttp.send(this.data());
		    };
		}
	 
		
		
		'use strict';

		function Point(x, y) {
		    this.x = (typeof (x) === "undefined") ? 0 : x;
		    this.y = (typeof (y) === "undefined") ? 0 : y;
		    this.toArray = function () {
		        return [this.x, this.y];
		    };
		}

		function Rect(x, y, w, h) {
		    this.x = (typeof (x) === "undefined") ? 0 : x;
		    this.y = (typeof (y) === "undefined") ? 0 : y;
		    this.w = (typeof (w) === "undefined") ? 0 : w;
		    this.h = (typeof (h) === "undefined") ? 0 : h;
		}

		function InkStroke(points) {
		    // Stroke ID is auto-generated and unique in an analysis session
		    InkStroke.prototype.getNextId = function () {
		        InkStroke.counter += 1;
		        return InkStroke.counter;
		    };

		    // Members
		    this.points = (typeof (points) === "undefined") ? [] : points;
		    this.id = this.getNextId();

		    // Convert to InkRecognizer service compliant format
		    InkStroke.prototype.toJsonString = function (scale, digits) {
		        var scaleFactor = (typeof (scale) === "undefined") ? 1.0 : scale;
		        var nDigits = (typeof (digits) === "undefined") ? 4 : digits;

		        return this.points.map(function (pt) {
		            return pt.toArray().map(function (item) {
		                return (item * scaleFactor).toFixed(nDigits);
		            }).join();
		        }).join();
		    };

		    InkStroke.prototype.fillWithString = function (pointsStr, scale) {
		        var str = (typeof (pointsStr) === "undefined" || !pointsStr) ? "" : pointsStr;
		        var scaleFactor = (typeof (scale) === "undefined") ? 1.0 : scale;
		        if (str === "") {
		            this.points = [];
		        } else {
		            // Split string based on comma or whitespace
		            var XYs = str.split(/[, ]+/);
		            for (var i = 0; i < XYs.length; i += 2) {
		                var x = parseFloat(XYs[i]) * scaleFactor,
		                    y = parseFloat(XYs[i + 1]) * scaleFactor;
		                this.points.push(new Point(x, y));
		            }
		        }
		    };
		}

		InkStroke.counter = 0;

		// InkCanvas is a thin wrapper of <canvas>, and unit of the coordinates is pixel
		function InkCanvas(canvasElementId) {
		    // Canvas related members
		    this.canvas = document.getElementById(canvasElementId);
		    this.width = this.canvas.width;
		    this.height = this.canvas.height;
		    this.ctx = this.canvas.getContext("2d");

		    // Stroke related members
		    this.points = [];
		    this.strokes = [];
		    this.strokeStarted = false;

		    // Register event handlers
		    var that = this;
		    ["pointerdown", "pointerup", "pointermove", "pointerout", "touchdown", "touchmove", "touchend", "touchleave"].forEach(function (e) {
		        that.canvas.addEventListener(e, function (evt) {
		            that.handlePointerEvent(e, evt);
		        }, false);
		    });

		    InkCanvas.prototype.handlePointerEvent = function (res, e) {
		        e.preventDefault();

		        var offsetX = this.canvas.getBoundingClientRect().left,
		            offsetY = this.canvas.getBoundingClientRect().top,
		            pageXOffset = window.pageXOffset,
		            pageYOffset = window.pageYOffset,
		            point = new Point(pageXOffset - offsetX, 0-offsetY);
		       // console.log(offsetX+"--"+offsetY+"--"+pageXOffset+"---"+pageYOffset);

		        if (res.indexOf("touch") === 0) {
		            point.x += e.touches[0].clientX;
		            point.y += e.touches[0].clientY;
		        } else {
		            point.x += e.clientX;
		            point.y += e.clientY;
		        }

		        if (res === "pointerdown" || res === "touchdown") {
		            this.points = [];
		            this.points.push(point);
		            this.drawLine(point, point);
		            this.strokeStarted = true;
		        } else if (res === "pointermove" || res === "touchmove") {
		            if (this.strokeStarted) {
		                var size = this.points.length;
		                if (size > 0) {
		                    var prevPoint = this.points[size - 1];
		                    this.drawLine(prevPoint, point);
		                }
		                this.points.push(point);
		            }
		        } else if (res === "pointerup" || res === "pointerout" || res === "touchleave" || res === "touchend") {
		            if (this.strokeStarted) {
		                var stroke = new InkStroke(this.points);
		                this.strokes.push(stroke);
		            }
		            this.strokeStarted = false;
		        }
		    };

		    // Rendering utilities
		    InkCanvas.prototype.clear = function () {
		        this.ctx.clearRect(0, 0, this.width, this.height);
		        this.points = [];
		        this.strokes = [];
		    };

		    InkCanvas.prototype.setStrokeStyle = function (color, lineWidth, dash) {
		        var strokeDash = (typeof (dash) === "undefined") ? [] : dash;

		        this.ctx.strokeStyle = (typeof (color) === "undefined") ? "black" : color;
		        this.ctx.lineWidth = (typeof (lineWidth) === "undefined") ? 2 : lineWidth;
		        this.ctx.setLineDash(strokeDash);
		        this.ctx.font = "18px Arial";
		        this.ctx.fillStyle = color;
		    };
		    this.setStrokeStyle();

		    InkCanvas.prototype.drawStroke = function (s) {
		        var pts = s.points;
		        this.drawPath(pts);
		    };

		    InkCanvas.prototype.drawLine = function (p1, p2) {
		        this.ctx.beginPath();
		        this.ctx.moveTo(p1.x, p1.y);
		        this.ctx.lineTo(p2.x, p2.y);
		        //context.lineWidth = 10;
		        //context.strokeStyle = '#ff0000';
		        this.ctx.stroke();
		    };

		    InkCanvas.prototype.drawRect = function (rect, scale) {
		        var scaleFactor = (typeof (scale) === "undefined") ? 1.0 : scale;
		        this.ctx.beginPath();
		        this.ctx.rect(rect.x * scaleFactor, rect.y * scaleFactor, rect.w * scaleFactor, rect.h * scaleFactor);
		        this.ctx.stroke();
		        this.ctx.closePath();
		    };

		    InkCanvas.prototype.drawPath = function (pts, scale, closePath) {
		        var scaleFactor = (typeof (scale) === "undefined") ? 1.0 : scale;
		        var closePath = (typeof (closePath) === "undefined") ? false : true;
		        if (pts.length > 0) {
		            this.ctx.beginPath();
		            this.ctx.moveTo(pts[0].x * scaleFactor, pts[0].y * scaleFactor);
		            for (var i = 1; i < pts.length; i += 1) {
		                this.ctx.lineTo(pts[i].x * scaleFactor, pts[i].y * scaleFactor);
		            }
		            if (closePath) {
		                this.ctx.lineTo(pts[0].x * scaleFactor, pts[0].y * scaleFactor);
		            }
		            this.ctx.stroke();
		        }
		    };

		    InkCanvas.distance = function (p1, p2) {
		        var dx = p1.x - p2.x,
		            dy = p1.y - p2.y;
		        return Math.sqrt((dx * dx) + (dy * dy));
		    };

		    InkCanvas.prototype.drawEllipse = function (pts, scale) {
		        var scaleFactor = (typeof (scale) === "undefined") ? 1.0 : scale;
		        var cx = ((pts[0].x + pts[2].x) * scaleFactor) / 2.0,
		            cy = ((pts[0].y + pts[2].y) * scaleFactor) / 2.0,
		            w = InkCanvas.distance(pts[0], pts[2]) * scaleFactor,
		            h = InkCanvas.distance(pts[1], pts[3]) * scaleFactor,
		            rotationAngle = Math.atan2(pts[2].y - pts[0].y, pts[2].x - pts[0].x);

		        this.ctx.beginPath();
		        this.ctx.ellipse(cx, cy, w / 2.0, h / 2.0, rotationAngle, 0, 2 * Math.PI);
		        this.ctx.stroke();
		    };

		    InkCanvas.prototype.drawCircle = function (pts, scale) {
		        var scaleFactor = (typeof (scale) === "undefined") ? 1.0 : scale;
		        var cx = ((pts[0].x + pts[2].x) * scaleFactor) / 2.0,
		            cy = ((pts[0].y + pts[2].y) * scaleFactor) / 2.0,
		            r = InkCanvas.distance(pts[0], pts[2]) * scaleFactor / 2.0;

		        this.ctx.beginPath();
		        this.ctx.arc(cx, cy, r, 0, 2 * Math.PI);
		        this.ctx.stroke();
		    };

		    InkCanvas.prototype.drawText = function (text, pos, scale, color) {
		        var scaleFactor = (typeof (scale) === "undefined") ? 1.0 : scale;
		        var textContent = (typeof (text) === "undefined") ? "" : text;

		        if (textContent !== "") {
		            this.ctx.fillStyle = color;
		            this.ctx.fillText(textContent, pos.x * scaleFactor, pos.y * scaleFactor);
		        }
		    };
		}
	 
	 
		
		 var controlButtonIds = [];
		    var request = "",
		      response = "",
		      errorMessage = "";
		    var inkRecognzier, inkCanvas, resultBox, inkRecognitionResult;

		    function init() {
		    	console.log('init');
		      if (SUBSCRIPTION_KEY === "") {
		        window.alert("Please change the subscriptionKey variable by a valid key!");
		        return;
		      }

		      inkRecognizer = new Recognizer(ENDPOINT_URL, SUBSCRIPTION_KEY);
		      inkCanvas = new InkCanvas('inkCanvas');
		      //resultBox = document.getElementById('resultBox');
		      inkRecognitionResult = null;
		      controlButtonIds = ['convertButton', 'requestButton', 'responseButton'];

		      //fillLanguageTags();
		      //disableControlButtons();

		      document.getElementById('clearButton').addEventListener("click", function () {
		        clear();
		      }, false);
		      document.getElementById('recognizeButton').addEventListener("click", function () {
		        recognize();
		      }, false);
		      /*document.getElementById('convertButton').addEventListener("click", function () {
		        convert();
		      }, false);
		      document.getElementById('requestButton').addEventListener("click", function () {
		        showRequest();
		      }, false);
		      document.getElementById('responseButton').addEventListener("click", function () {
		        showResponse();
		      }, false);*/
		    }

		    function fillLanguageTags() {
		      var options = document.getElementById('languageTags');
		      LANGUAGE_TAGS_TO_TRY.map(function (tag) {
		        var opt = document.createElement('option');
		        opt.innerHTML = tag;
		        options.appendChild(opt);
		      });
		      options.selectedIndex = 0;
		    }

		    function setButtonDisableState(buttons, state) {
		      buttons.map(function (id) {
		        document.getElementById(id).disabled = state;
		      });
		    }

		    function enableControlButtons() {
		      setButtonDisableState(controlButtonIds, false);
		    }

		    function disableControlButtons() {
		      setButtonDisableState(controlButtonIds, true);
		    }

		    function clear() {
		      inkCanvas.clear();
		      request = "";
		      response = "";
		      errorMessage = "";
		      inkRecognitionResult = null;
		      //resultBox.value = "";
		      //disableControlButtons();
		    }

		    function showRequest() {
		      resultBox.value = request.toString();
		    }

		    function showResponse() {
		      console.log(inkRecognitionResult);
		      var bullets = inkRecognitionResult.findBullets();
		        var bulletText = "-";
		        if (bullets.length !== 0) {
		          var bulletSymbols = bullets.map(function (e) {
		            return e.text;
		          });
		          var isAllSymbolsTheSame = bulletSymbols.every(function (v) {
		            return v === bulletSymbols[0];
		          });
		          if (isAllSymbolsTheSame) {
		            bulletText = bulletSymbols[0];
		          }
		        }

		        var bulletIds = bullets.map(function (e) {
		            return e.id;
		          });
		        var products =[];
		        var lines = inkRecognitionResult.findLines();
		       	if (typeof (lines) !== "undefined") {
			        
			        lines.map(function (line) {
			          // Check if is list item
			          var text = line.text;
			          console.log(text);
						products.push(line.text);
			        });
		      	}
		       	
		        //var products=['1981415-1','1438465-2','1992693-3','779841-1','898503-2'];
		    	var qo = $('.js-quick-order-container').find(":input[placeholder='Enter SKU']");
		    	var qua;
		        //console.log(qo);
		        console.log(qo.length);
		        if(qo.length>=products.length){
		        	for (index = 0; index < products.length; ++index) {
			        	var input = $(qo[index]);
			        	input.focus();
			        	input.val(getSKU(products[index]));
			        	input.change();
			        	input.focusout();
			        	
			        }
		        	setTimeout(function(){ 
		        		qua = $('.js-quick-order-container').find(":input.js-quick-order-qty ");
			        	console.log(qua);
			        	for (index = 0; index < products.length; ++index) {
			        		console.log(getQuantity(products[index]));
				        	var quantity = $(qua[index]);
				        	quantity.focus();
				        	quantity.val(getQuantity(products[index]));
				        	quantity.change();
				        	quantity.focusout();
				        }
		        	}, 1500);
		        	
		        }else{
		        	var l = qo.length;
		        	for (index = 0; index < qo.length; ++index) {
			        	var input = $(qo[index]);
			        	input.focus();
			        	input.val(getSKU(products[index]));
			        	input.change();
			        	input.focusout();
			        	
			        }
		        	
		        	console.log(l);
		        	
		        	for(index=l;index<products.length;++index){
		        		qo = $('.js-quick-order-container').find(":input[placeholder='Enter SKU']");
		        		console.log(index+"---"+qo.length);
		        		/*while(qo.length<=products.length){
			        		//await sleep(500);
			        		console.log(qo.length)
			        		qo = $('.js-quick-order-container').find(":input[placeholder='Enter SKU']");
			        	}*/
		        		var input = $(qo[index]);
			        	input.focus();
			        	input.val(getSKU(products[index]));
			        	input.change();
			        	input.focusout();
			        	
		        		
		        	}
		        	setTimeout(function(){ 
		        		qua = $('.js-quick-order-container').find(":input.js-quick-order-qty ");
			        	console.log(qua);
			        	for (index = 0; index < products.length; ++index) {
			        		console.log(getQuantity(products[index]));
				        	var quantity = $(qua[index]);
				        	quantity.focus();
				        	quantity.val(getQuantity(products[index]));
				        	quantity.change();
				        	quantity.focusout();
				        }
		        	}, 1500);
		        	
		        	
		        }
		    }

		    function getLanguageTag() {
		      var lang = languages.get($("#lang-selector").val());
		      return (lang === "") ? "en-US" : lang;
		    }
			
		    function getSKU(str){
		    	var i = str.indexOf("-");
		    	if(i!=-1){
		    		return str.substring(0, i);
		    	}else{
		    		return str;
		    	}	    	
		    }
		    function getQuantity(str){
		    	var i = str.indexOf("-");
		    	if(i!=-1){
		    		return str.substring(i);
		    	}else{
		    		return 1;
		    	}	
		    }
		    
		    function recognize() {
		      // check if any strokes present
		      var strokes = inkCanvas.strokes;
		      if (strokes.length === 0) {
		        window.alert("There are no strokes for analysis.");
		        return;
		      }

		      inkRecognizer = new Recognizer(ENDPOINT_URL, SUBSCRIPTION_KEY, getLanguageTag());

		      strokes.map(function (stroke) {
		        var strokeString = stroke.toJsonString(PIXEL_TO_MILLIMETERS);
		        inkRecognizer.addStroke(stroke.id, strokeString);
		      });

		      request = JSON.stringify(JSON.parse(inkRecognizer.data()), null, 2);
		      inkRecognizer.recognize(function (result, responseText) {
		          inkRecognitionResult = result;
		          response = JSON.stringify(JSON.parse(responseText), null, 2);
		          showResponse();
		          
		        },
		        function (error) {
		          errorMessage = error.status + ": " + error.message;
		          console.log(errorMessage);
		        });
		       
		        
		        
		        
		    }

		    function convertLines(lines, bulletIds, bulletText) {
		    	console.log('lines:'+lines);
		    	console.log('bulletIds:'+bulletIds);
		        console.log('bulletText:'+bulletText);
		    	
		      if (typeof (lines) !== "undefined") {
		        var pos;
		        inkCanvas.setStrokeStyle();
		        lines.map(function (line) {
		          // Check if is list item
		          var text = line.text;
		          if (line.children.some(function (e) {
		              return bulletIds.indexOf(e) !== -1;
		            })) {
		            text = bulletText + ' ' + text;
		          }

		          if (typeof (pos) === "undefined") {
		            pos = new Point(line.boundingRectangle.topX, line.boundingRectangle.topY);
		          } else {
		            // Leave enough gap between lines
		            pos = new Point(pos.x, pos.y + 20);
		          }

		          inkCanvas.drawText(text, pos, MILLIMETER_TO_PIXELS, "blue");
		        });
		      }
		    }

		    function convertShapes(units) {
		      if (typeof (units) !== "undefined") {
		        units.map(function (unit) {
		          if (unit.shape !== "drawing") {
		            var keyPoints = unit.points;
		            inkCanvas.setStrokeStyle("red");
		            if (unit.shape === "circle") {
		              inkCanvas.drawCircle(keyPoints, MILLIMETER_TO_PIXELS);
		            } else if (unit.shape === "ellipse") {
		              inkCanvas.drawEllipse(keyPoints, MILLIMETER_TO_PIXELS);
		            } else {
		              inkCanvas.drawPath(keyPoints, MILLIMETER_TO_PIXELS, true);
		            }
		          }
		        });
		      }
		    }

		    function convert() {
		      // convert all leaf nodes: words, bullets, shapes 
		      if (inkRecognitionResult != null) {
		        inkCanvas.clear();
		        setButtonDisableState(['convertButton'], true);

		        // For list, we want to unify the symbol of bullet
		        var bullets = inkRecognitionResult.findBullets();
		        var bulletText = "-";
		        if (bullets.length !== 0) {
		          var bulletSymbols = bullets.map(function (e) {
		            return e.text;
		          });
		          var isAllSymbolsTheSame = bulletSymbols.every(function (v) {
		            return v === bulletSymbols[0];
		          });
		          if (isAllSymbolsTheSame) {
		            bulletText = bulletSymbols[0];
		          }
		        }

		        var bulletIds = bullets.map(function (e) {
		          return e.id;
		        });

		        var lines = inkRecognitionResult.findLines();
		        convertLines(lines, bulletIds, bulletText);
		        convertShapes(inkRecognitionResult.findShapes());
		        inkCanvas.setStrokeStyle();
		      }
		    }
		    
		   
	 </script>
	 <table>
	 <tr>
	    <td>
	    	<div id='visualContainer' style="height:700px">
    	
        	 <canvas id='inkCanvas' width="500" height="700"
          style=' border:2px solid #CCC;touch-action:none;'></canvas>
        </div>
         <div id='controlBar' style='height:40px;display: block;margin-top: 10px'>
	        <button id='clearButton'>Clear</button>
	        <button id='recognizeButton'>Recognize</button>
      	</div>
	    </td>
	    <td><div class="account-section-content">
            <div class="quick-order-section-header account-section-header">
                <spring:theme code="text.quickOrder.header" />
            </div>

            <div class="row">
                <div class="col-xs-12 col-md-7 col-lg-6">
                    <div class="quick-order__introduction">
                        <cms:pageSlot position="TopContent" var="feature">
                            <cms:component component="${feature}" element="div" class="yComponentWrapper"/>
                        </cms:pageSlot>
                    </div>
                </div>

                <product:addToCartTitle/>
                <div class="col-xs-12 col-md-5 col-lg-6 pull-rightt">
                    <div class="row quick-order__actions">
                        <div class="pull-right col-sm-3 col-md-6 col-lg-5 quick-order__add-to-cart-btn">
                            <product:productFormAddToCartButton addToCartBtnId="js-add-to-cart-quick-order-btn-top" />
                        </div>
                        <div class="pull-right col-sm-4 col-md-6 col-lg-5 text-right">
                            <quickorder:quickorderResetButton resetBtnId="js-reset-quick-order-form-btn-top" resetBtnClass="quick-order__reset-link"/>
                        </div>
                    </div>
                </div>
            </div>
			
			<quickorder:quickorderListRows/>

            <div class="row">
                <div class="col-xs-12 col-md-5 col-lg-6 pull-right">
                    <div class="row quick-order__actions">
                        <div class="pull-right col-sm-3 col-md-6 col-lg-5 quick-order__add-to-cart-btn">
                            <product:productFormAddToCartButton addToCartBtnId="js-add-to-cart-quick-order-btn-bottom" />
                        </div>
                        <div class="pull-right col-sm-4 col-md-6 col-lg-5 text-right">
                            <quickorder:quickorderResetButton resetBtnId="js-reset-quick-order-form-btn-bottom" resetBtnClass="quick-order__reset-link"/>
                        </div>
                    </div>
                </div>
            </div>
        </div></td> 
    
  </tr>
	 </table>
        
       <script type="text/javascript">
       	init();
       </script>
    </div>
    	
</template:page>