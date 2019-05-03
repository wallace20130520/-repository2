import { Component, OnInit,AfterViewInit,ViewEncapsulation } from '@angular/core';

import { Location } from '@angular/common';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';
import * as amp from '../../assets/js/amp-min.js';
import * as Handlebars from '../../assets/js/handlebar.min';
import '../../assets/js/handlebars_helpers';
import { AMPLIENCETEMPLATE} from '../handlebar.constant';
import {HomeComponentService} from './home.service';
import {SingletonService} from '../services/singleton.service';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
declare var $: any;
declare var AmpCa :any
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],  
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit,AfterViewInit {
  renderingServ:boolean;
  contentDeliveryUrl: any;
  slotID = "f9705311-515b-43ff-88a6-d104d8cb03c8";
  toggleMenu:boolean;
  cardslot1:string='';
  cardItems:Array<any>;
  cardSlot1:any;
  constructor(public _homeServ:HomeComponentService,public singletonServ:SingletonService,
    public route :ActivatedRoute,public location:Location) {
    this.contentDeliveryUrl = "https://c1.adis.ws/cms/content/query?fullBodyObject=true&query="
    + encodeURIComponent(JSON.stringify({ "sys.iri": "http://content.cms.amplience.com/" + this.slotID }))
    + "&scope=tree&store=1digitals";
    this.toggleMenu=false;
    this.cardItems=[1,2,3,4,5,6,7,8,9,10,11,12];

   }

  ngOnInit() { 
    Handlebars.partials['acc-template-MBImage'] = AmpCa.templates['acc-template-image'];
    Handlebars.partials['acc-template-MBHomePage'] = AmpCa.templates['acc-template-homepage'];
    Handlebars.partials['acc-template-ImageContent'] = AmpCa.templates['acc-template-image'];
    Handlebars.partials['acc-template-Newsamplebanner'] = AmpCa.templates['acc-template-banner'];
    Handlebars.partials['acc-template-MBText'] = AmpCa.templates['acc-template-text'];
    Handlebars.partials['acc-template-MBCard'] = AmpCa.templates['acc-template-card'];
    Handlebars.partials['acc-template-Splitblockwithmultiplecontent'] = AmpCa.templates['acc-template-splitBlock'];
   if(this.location.path() == "/store/homepage"){
    this.renderingServ=false;
    this.getAmplienceContent('86ab585a-7313-404c-9a5e-21274675d0f3', '1digitals', AMPLIENCETEMPLATE.CARD, ".home-banner",'cardImage','acc-template-banner');
    // this.getAmplienceContent('5680fdd2-8b56-484e-be06-0478d0fb5752', '1digitals', AMPLIENCETEMPLATE.CARD, ".mb-marketing_carousel",'cardImage','acc-template-cardList');
    this.getAmplienceContent('f9705311-515b-43ff-88a6-d104d8cb03c8', '1digitals', AMPLIENCETEMPLATE.CARD, ".amp-homepage-card-slot1",'cardImage','acc-template-card');
    this.getAmplienceContent('86fb5314-6987-4b61-9d7c-4a39653d49c8', '1digitals', AMPLIENCETEMPLATE.CARD, ".amp-homepage-card-slot2",'cardImage','acc-template-card');
    this.getAmplienceContent('c2430b0a-5710-49fa-a78a-aebe3098293d', '1digitals', AMPLIENCETEMPLATE.CARD, ".amp-homepage-card-slot3",'cardImage','acc-template-card');
    this.getAmplienceContent('5fa6ba57-4343-4cd7-b866-cef6872edd7f', '1digitals', AMPLIENCETEMPLATE.CARD, ".amp-homepage-card-slot4",'cardImage','acc-template-card');
    this.getAmplienceContent('84eb3a19-3b3c-4b76-9d52-75ef7a5d93bc', '1digitals', AMPLIENCETEMPLATE.CARD, ".amp-homepage-card-slot5",'cardImage','acc-template-card');
    this.getAmplienceContent('5459bdba-f14f-40ce-b9de-0acddbb57fd3', '1digitals', AMPLIENCETEMPLATE.CARD, ".discover_heritage",'cardImage','acc-template-card');
   
  }else{
    this.renderingServ=true;
    this.getcardFromRenderingServ(); 
   }
    
     
}
renderFreshElement(){
  if(!this.renderingServ){             
  let _script = document.createElement("script");
  _script.type = "text/javascript";
  _script.src = "//d81mfvml8p5ml.cloudfront.net/yre05t09.js";
  document.head.appendChild(_script);

}
}
  getcardFromRenderingServ(){
    AmpCa.utils = new AmpCa.Utils();
    AmpCa.utils.getHtmlServiceData({
        auth: {
            baseUrl: 'https://c1.adis.ws',
            id: 'e28b2854-9672-4820-b1a9-d674a730a10c',
            store: 'moltonbrown',
            templateName: 'acc-template-homepage'
        },
        callback: function (data) {
            document.querySelectorAll(".home_template-wrappper")[0].innerHTML = data;
            AmpCa.utils.postProcessing.execHtmlService('splitBlock');
            // let freshRevlevanTag = document.createElement('div');
            // let dataFreshElemnt=`<div class="tmspslot" style="width: 100%;" data-k="qa5buoy" data-slid="uk-hp-prod-feed" data-p="1" ></div>
            //                      <div class="tmspslot" style="width:100%;" data-k="qa5buoy" data-slid="uk-free-delivery" ></div>`;
            //                      document.querySelectorAll(".amp-dc-card-list")[0].innerHTML = dataFreshElemnt;                
                                //  let _script = document.createElement("script");
                                //  _script.type = "text/javascript";
                                //  _script.src = "//d81mfvml8p5ml.cloudfront.net/yre05t09.js";
                                //  document.head.appendChild(_script);             
        
        }
    });
  }
  ngAfterViewInit(){
    this.singletonServ.getMessage().subscribe(message => {
      if (message.toggle) {
        window.scroll(0, 0);
        this.toggleMenu=message.toggle.state;
      }
     });
  }
  getAmplienceContent(slotId,storename,type,classname,partial,partialType){
   this._homeServ.getampcontent(slotId,storename).subscribe((resp)=>{
   this.renderContent(resp,type,classname,partial,partialType);
   },(err)=>{
    this.showErrorMessage(err);
   });
  }


  renderContent(data,type,classname,partial,partialType) {
    // use the Amplience CMS JavaScript SDK to manipulate the JSON-LD into a content tree
    var contentTree = amp.inlineContent(data)[0];
    var template =  Handlebars.template(AmpCa.templates[partialType]);


    Handlebars.registerHelper('escapeUrl', function(url) {
       if (!url || url.length < 1) {
          return '';
       }
       return encodeURIComponent(url);
    });

  Handlebars.registerHelper('math', function(
    lvalue,
    operator,
    rvalue,
    options
) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
        '+': lvalue + rvalue,
        '-': lvalue - rvalue,
        '*': lvalue * rvalue,
        '/': lvalue / rvalue,
        '%': lvalue % rvalue
    }[operator];
});

Handlebars.registerHelper('escapeUrl', function(url) {
		
  if (!url || url.length < 1) {
    return '';
  }
  return encodeURIComponent(url);
});

Handlebars.registerHelper('templateChooser', function(
  context,
  addTemplateClassname
) {
  var context = context instanceof Array ? context[0] : context;
  
  var parsedName = context['_meta']['schema']
    .match(/(\/\w+)/g)
    .splice(-1)[0]
    .replace('/', '');
  var matchedTemplate;
  var templateName = 'acc-template-' + parsedName;
  for (var x in Handlebars.partials) {
    if ((templateName.toLowerCase() === x.toLowerCase()) || (parsedName.toLowerCase() === x.toLowerCase())) {
      matchedTemplate = Handlebars.partials[x].length ?
        Handlebars.partials[x] :
        Handlebars.template(Handlebars.partials[x]);
      break;
    }
  }

  if (!matchedTemplate) {
    return 'Template matching id: ' + matchedTemplate + ' not found';
  }

  context.addTemplateClassname =
    typeof addTemplateClassname !== 'undefined' ?
    addTemplateClassname :
    '';
  return new Handlebars.SafeString(matchedTemplate(context));
});
/*handele helpers */

Handlebars.registerHelper('math', function(
lvalue,
operator,
rvalue,
options
) {
lvalue = parseFloat(lvalue);
rvalue = parseFloat(rvalue);

return {
  '+': lvalue + rvalue,
  '-': lvalue - rvalue,
  '*': lvalue * rvalue,
  '/': lvalue / rvalue,
  '%': lvalue % rvalue
}[operator];
});

Handlebars.registerHelper('bannerConfig', function(opts) {
var style = '';
var  hex = this.bannerColor || '#fff';
var alpha = this.bannerOpacity || 1;
hex = hex.replace('#', '');

if (hex.length === 3) {
  var hexArr = hex.split('');
  hex = hexArr[0] + hexArr[0];
  hex += hexArr[1] + hexArr[1];
  hex += hexArr[2] + hexArr[2];
}

var r = parseInt(hex.slice(0, 2), 16);
var g = parseInt(hex.slice(2, 4), 16);
var b = parseInt(hex.slice(4, 6), 16);

if (alpha) {
  style +=
    'background-color:rgba(' +
    r +
    ', ' +
    g +
    ', ' +
    b +
    ', ' +
    alpha +
    '); ';
} else {
  style += 'background-color:rgb(' + r + ', ' + g + ', ' + b + '); ';
}

if (this.textColour) {
  style += 'color: #' + this.textColour;
}

return style;
});

Handlebars.registerHelper('roundelConfig', function(roundel) {
if (
  roundel &&
  roundel[0] &&
  roundel[0].roundel &&
  roundel[0].roundel.name
) {
  var roundelParams = [];
  var imageRoundelIndex;
  for (var x = 0; x < roundel.length; x++) {
    var roundelParam = '';
    switch (roundel[x].roundelPosition) {
      case 'Bottom Right':
        roundelParam = 'p1_img=';
        imageRoundelIndex = 1;
        break;
      case 'Bottom Left':
        roundelParam = 'p2_img=';
        imageRoundelIndex = 2;
        break;
      case 'Top Left':
        roundelParam = 'p3_img=';
        imageRoundelIndex = 3;
        break;
      case 'Top Right':
        roundelParam = 'p4_img=';
        imageRoundelIndex = 4;
        break;
    }

    var roundelRatio = roundel[x].roundelRatio;
    roundelParam +=
      roundel[x].roundel.name +
      (roundelRatio ?
        '&roundelRatio' + imageRoundelIndex + '=' + roundelRatio :
        '');
    roundelParams.push(roundelParam);
  }

  return roundelParams.join('&');
} else {
  return '';
}
});

Handlebars.registerHelper('bannerRoundel', function(roundel, options) {
if (
  roundel &&
  roundel[0] &&
  roundel[0].roundel &&
  roundel[0].roundel.name
) {
  var roundelParams = ['$banner-roundel$'];
  var imageRoundelIndex;
  for (var x = 0; x < roundel.length; x++) {
    var roundelParam = '';
    switch (roundel[x].roundelPosition) {
      case 'Bottom Right':
        roundelParam = 'p1_img=';
        imageRoundelIndex = 1;
        break;
      case 'Bottom Left':
        roundelParam = 'p2_img=';
        imageRoundelIndex = 2;
        break;
      case 'Top Left':
        roundelParam = 'p3_img=';
        imageRoundelIndex = 3;
        break;
      case 'Top Right':
        roundelParam = 'p4_img=';
        imageRoundelIndex = 4;
        break;
    }

    var roundelRatio = roundel[x].roundelRatio;

    if (options && options.hash && options.hash.aspectRatio) {
      roundelRatio = options.hash.aspectRatio;
    }
    roundelParam +=
      roundel[x].roundel.name +
      (roundelRatio ?
        '&roundelRatio' + imageRoundelIndex + '=' + roundelRatio :
        '');
    roundelParams.push(roundelParam);
  }

  return roundelParams.join('&');
} else {
  return '';
}
});

Handlebars.registerHelper('bannerPOI', function(options) {
if (!options || !options.hash || !options.hash.name) {
  return '';
}

var str = '$banner-poi=0$&layer0=[src=/i//' + options.hash.name;

if (options.hash.aspect) {
  str += '&aspect=' + options.hash.aspect;
}

if (options.hash.w) {
  str += '&w=' + options.hash.w;
}

if (options.hash.h) {
  str += '&h=' + options.hash.h;
}

str += ']';

return str;
});

Handlebars.registerHelper('splitBlock', function(index, split) {
if (typeof split === 'undefined') {
  return '';
}
var id = parseInt(index, 10);
var splitter = split.split('/');
if (id === 0) {
  return 'amp-dc-size-' + splitter[0];
}

return 'amp-dc-size-' + splitter[1];
});

Handlebars.registerHelper('iff', function(a, operator, b, opts) {
var bool = false;
switch (operator) {
  case '==':
    bool = a == b;
    break;
  case '>':
    bool = a > b;
    break;
  case '<':
    bool = a < b;
    break;
  default:
    throw 'Unknown operator ' + operator;
}

if (bool) {
  return opts.fn(this);
} else {
  return opts.inverse(this);
}
});

Handlebars.registerHelper('roundelProperties', function(opts) {
if (
  this.roundel &&
  this.roundel[0] &&
  this.roundel[0].roundel &&
  this.roundel[0].roundelPosition &&
  this.roundel[0].roundelRatio
) {
  return opts.fn(this);
} else {
  return opts.inverse(this);
}
});



    // // render the content using the template
    var html = template(contentTree);
    $(classname).html(html);
    if(classname == '.mb-marketing_carousel'){

    }
  }
  getHelpers(){

  }
  showErrorMessage(err) {
    $(document.body).append('<div class="error">An error occurred retrieving your content.<br/><br/>Please ensure that it is published.<br/><br/>Details of the error have been saved to the browser console.</div>');
  }

  getQueryVar(variable) {
    var query = window.location.search.substring(1);

    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return false;
  }
  scrollHandler(event){
  }

}


