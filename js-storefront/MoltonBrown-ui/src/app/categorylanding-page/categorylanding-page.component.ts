import { Component, OnInit,OnDestroy,ViewChild, ViewEncapsulation,ElementRef, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import {CategoryComponentService} from './categorylanding-page.service';
import { PagerService } from '../services/pager.service';
import {SingletonService} from '../services/singleton.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable} from 'rxjs';
import '../../assets/js/handlebars_helpers';
declare var $: any;
declare var AmpCa :any

@Component({
  selector: 'app-categorylanding-page',
  templateUrl: './categorylanding-page.component.html',
  styleUrls: ['./categorylanding-page.component.scss'],
    
  encapsulation: ViewEncapsulation.None
})
export class CategorylandingPageComponent implements OnInit,AfterViewInit,OnDestroy {
  @ViewChild('facetTag') facetValue:ElementRef;
  @ViewChild('parentCategory') parentCategory:ElementRef;
  searchDisplay:boolean;
  paramcode:string;
  facets:Array<any>;
  catalogSpecific:boolean;
  navigationSubscription:any;
  searchPrdId:string;
  breadcrumb:Array<any>;
  routeParams:any;
  categoryData:Array<any>;
  totalProducts:number;
  currentPage:number;
    pager: any = {};
    pagedItems: any[];
    displayGrid:boolean;
    parentCatName:string;
    productname:string;
    categorybanner:Array<any>;
    IsmodelShow:boolean;
    refineFacets:Array<any>;
    mbFacet:boolean;
    refinePath:string;
    checkedfilter:boolean;
    showFacets:boolean;
    checkList:boolean=false;
    paths:string;
    form: FormGroup;
    value: Observable<number>;
    showFacetVal:boolean;
    freshRelevanceSpecific:boolean;
    viewAllProducts:boolean;
    offset = 100;
    screen_lg = '1200px';
    screen_md = '992px';
    pageNumber:number;
    checkedCount:number;
    checkedData:any=[];
    searchCatId:string;
    freeSearchText:string;
    spellingSuggestion:any;
    activeProducts:boolean;
    totalNumber:Array<any>;
    catId:string;
    pageSize:number=12;
    pageLoad:boolean;
    pagination:any;
    sortId:number;
  constructor(private el: ElementRef,public location: Location,public router: Router,public route :ActivatedRoute,
    public singletonServ: SingletonService,private titleService: Title,public mbPagerService:PagerService,
    public categoryServ:CategoryComponentService) {
      this.paths='';
      this.showFacets=true;
      this.categoryData =[];
      this.checkedCount=1;
      this.catalogSpecific=false;
      this.displayGrid=true;
      this.facets = [{}];
      this.refinePath='';
      this.IsmodelShow=false;
      this.mbFacet=true;
      const that =this;
      this.viewAllProducts=false;
      this.pageNumber=0;
      this.pageLoad=false;
      this.router.routeReuseStrategy.shouldReuseRoute = function(){
        return false;
     }
 this.navigationSubscription=this.route.params.subscribe(params => {
        this.routeParams=params;
        
  if(!params.searchId){

        this.searchDisplay=false;
        if(params.categoryId){
          const queryStatus = that.route.snapshot.queryParamMap.get("viewAllCat"); 
          const cookieSearch= this.singletonServ.getCookie('searchId');
          let prdId='/search?query=:relevance:category:' + params.categoryId;
          this.catId=params.categoryId;
          if(cookieSearch.length !=0){
            const data=JSON.parse(cookieSearch);
            if(data.catId== params.productid){
              prdId=data.id;
            }
          }
         
     
          this.searchCatId=params.categoryId
          this.searchPrdId = prdId; 
          if(queryStatus){
            this.catalogSpecific=true;
            this.freshRelevanceSpecific=false;
            const _searchId={
              id:prdId,
              catId:params.categoryId
            };
            this.singletonServ.setCookie("searchId", _searchId, 365);  
            this.getCategoryData(prdId,true,this.pageSize);
          }else{
            this.freshRelevanceSpecific=true;
            this.pageLoad=true
    
          }
  
                 
        }else if(params.productid){
            const cookieSearch= this.singletonServ.getCookie('searchId');
            let prdId='/search?query=:relevance:category:' + params.productid;
            this.catId=params.productid;
            if(cookieSearch.length !=0){
              const data=JSON.parse(cookieSearch);
              if(data.catId== params.productid){
                prdId=data.id;
              }
            }

            this.searchPrdId = prdId;
            this.getCategoryData(prdId,true,this.pageSize);
        }
        this.parentCatName= (params.categoryname)?params.categoryname:params.productname; 
        this.productname=params.productname;
        if(params.categoryname){
          this.catalogSpecific=true;
        }
        const _catData=that.singletonServ.menudata;
        if(_catData){
        const splitPath=window.location.pathname.split('/');
        const _catId=splitPath[splitPath.length-1];
        let _breadCrumb=this.findCat(_catData,_catId);
        if(_breadCrumb){
            _breadCrumb.splice(1,1);
           this.breadcrumb=_breadCrumb;
           }
            for (let obj of _catData) {
            const  result = that.getCatalogtree(obj, _catId);
              if (result) {
                  that.categorybanner=result;
                  break;
              }
          }
        }
      }else{
        this.freshRelevanceSpecific=false;
        this.breadcrumb =['SEARCH','MY SEARCH'];
        this.searchDisplay=true;
        this.searchPrdId=params.searchId;
        this.paramcode=params.searchId;
        this.renderSearchRelatedpage(this.searchPrdId,true,this.pageSize);
      }
      
      
     });
     

   }


  ngOnInit() {
    const that=this;
    this.paths='';
    AmpCa.utils = new AmpCa.Utils();
  }



  ngAfterViewInit(){
    const that =this;
    const categoryname=this.routeParams.categoryname;
    this.singletonServ.getMessage().subscribe(message => {
      if (message.catgories) {
           const splitPath=window.location.pathname.split('/');
           const _catId=splitPath[splitPath.length-1];
           let _breadCrumb=this.findCat(message.catgories,_catId);
           if(_breadCrumb){
               _breadCrumb.splice(1,1);
                this.breadcrumb=_breadCrumb;
              }
          for (let obj of message.catgories) {
          const  result = this.getCatalogtree(obj, _catId);
            if (result) {
              this.titleService.setTitle(result.titleName);
                that.categorybanner=result;
                break;
            }
        }
      } 
     });

if(this.freshRelevanceSpecific){
 // this.parentCategory.nativeElement.innerHTML=` <div class="tmspslot" style="width: 100%;" data-k="qa5buoy" data-slid="uk-hybris-prod-feed-parent-category" data-p="1" ></div>`;
}



  }
  getCatalogtree(obj, targetId) {
    if (obj.id.toLowerCase() === targetId.toLowerCase()) {
        return obj
    }
    if (obj.subcategories) {
        for (let item of obj.subcategories) {
            let check = this.getCatalogtree(item, targetId)
            if (check) {
                return check
            }
        }
    }
    return null
}

findCat(array, id) {
    if (typeof array != 'undefined') {
        for (var i = 0; i < array.length; i++) {
            if (array[i].id.toLowerCase() == id.toLowerCase()) {             
                return [array[i]]
            }
            var a = this.findCat(array[i].subcategories, id);
            if (a != null) {
                a.unshift(array[i]);
                return a;
            }
        }
    }
    return null;
  }


  /* category level call */



  onviewAllProducts(event){
    event.stopPropagation();
    this.freshRelevanceSpecific=false;
    let prdId=this.searchPrdId;
    const pageSize=123;
    this.catalogSpecific=true;
    this.pager=false;
    this.viewAllProducts=true;
    this.getCategoryData(prdId,true,pageSize);
    

  }
  fetchProductNextperPage(event,status:boolean){
     event.preventDefault();
     if(!status){
       let page =this.pagination.currentPage+1;
       this.pageNumber=page;
        if(this.searchDisplay){
          const id = this.searchPrdId +':relevance'+this.paths+ '&currentPage=' + page;
          this.renderSearchRelatedpage(id, false,12);
        }else{
          const id = this.searchPrdId+this.paths + '&currentPage=' + page;
        
          this.getCategoryData(id, false,this.pageSize);
        }
     }else{       
        const _pageNumber=this.pagination.currentPage-1;
        this.pageNumber=_pageNumber;

        if(this.searchDisplay){
          const id = this.searchPrdId +':relevance'+this.paths+ '&currentPage=' + _pageNumber;
          this.renderSearchRelatedpage(id, false,12);
        }else{
          const id = this.searchPrdId+this.paths + '&currentPage=' + _pageNumber;
          this.getCategoryData(id, false,this.pageSize);
        }
     }
  }
  fetchProductperPage(event,page: number){
    event.stopPropagation();
    event.preventDefault();
    this.viewAllProducts=false;
    const pgNumber = page['value'] ;
    this.pageNumber=page['content'];
    if(this.searchDisplay){
      const id = this.searchPrdId +':relevance'+this.paths+ '&currentPage=' + page['value'];
      this.renderSearchRelatedpage(id, false,12);
    }else{
      const id = this.searchPrdId+this.paths + '&currentPage=' + page['value'];
      this.getCategoryData(id, false,this.pageSize);
    }
   
  }
  convertNextString(){
    let _number=this.pageNumber+1;
    return _number;
    }
    convertPrevString(){
      let _number=this.pageNumber-1;
      return _number;
      }
  sortByCahnge(){
    
  }

  onQuickView(event,indx){
    
    this.categoryData.map((obj,id)=>{
      if(id==indx){
        obj.show=!obj.show;
      }else{
        obj.show =false;
      }
      });
      const yOffset =event.pageY+0;
      window.scrollTo(window.pageXOffset,yOffset);
  }
  onShowDetailPage(event,data){
   console.log(data);
    let url ='/store'+data.url.replace('/p/','/');
    this.router.navigate([url]);
  }


  onGridClick(bol){
     if(bol){
      this.displayGrid=true;
     }else{
      this.displayGrid=false;
     }
  }
  onCloseWindow(data,i){
    // window.scrollTo(15,15);
    this.categoryData.map((obj,id)=>{
     if(id==i){
       obj.show=!obj.show
     }else{
       obj.show =false;
     }
     });
    }
    onViewAllProducts(data){
      this.freshRelevanceSpecific=false;
      this.catalogSpecific=true;
      const productname=this.routeParams.productname;
      const categoryId=this.routeParams.categoryId;
      this.router.navigate(['store',productname,categoryId] ,{ queryParams: { viewAllCat: true}, queryParamsHandling: 'merge' });
     
    }
    




    //swap products
    swapproducts(products, oldIndex, newIndex) {
      var temp = products[oldIndex]; 
      products[oldIndex] = products[newIndex];
      products[newIndex] = temp;
     }
  
    //set page
    // setPage(page: number) {
    //   if (page < 1 || page > this.pager.totalPages) {
    //       return;
    //   }
    //   const length =12;
    //   // get pager object from service
    //   this.pager = this.mbPagerService.getPager(length, page);
    //   window.scrollTo(0,0)
    // }
    

//category Related Call
  getCategoryData(id,facets,pageSize){
    const that=this;
    const _searchId={
     id:id,
     catId:this.searchCatId
    };
   this.singletonServ.setCookie("searchId", JSON.stringify(_searchId), 365); 
    const cVrsnid = this.singletonServ.catalogVersionId;
    const indexArray=[];
    this.pageLoad=false;
    this.categoryServ.getMBProduct(id, cVrsnid,pageSize).subscribe((resp)=>{
     const prodPaginator = resp['pagination'];
     this.pagination=resp['pagination'];
     _.forEach(resp['products'], function(value,i) {
        _.assignIn(value, { show:false,id: i + 1, review: (Math.random() * 5).toFixed(1)});
        if(value.isDummy){
          value['currentIndex']=i;
          let obj={
            oldindex:i,
            newIndex:4
          }
          indexArray.push(obj)
          AmpCa.utils.getHtmlServiceData({
            auth: {
                baseUrl: 'https://c1.adis.ws',
                id: value.code,
                store: 'moltonbrown',
                templateName: 'acc-template-card',
                locale:'en-GB'
            },
            callback: function (data) {
              _.assignIn(value, { htmlData:data});
            }
        });
        }    
  });
  const products =resp['products'];
  if(indexArray.length>=1){
      _.forEach(indexArray, function(value,i) {
        that.swapproducts(products, value.oldindex, value.newIndex); 
      });
  }


     this.totalProducts =prodPaginator['totalResults'];
     this.currentPage=prodPaginator['currentPage'];
     let currentPage = 1;
     this.categoryData = products; 
     this.pagedItems=products;
      this.pagedItems=products;
      this.activeProducts=(products)?true:false;
    this.renderFacets(facets,resp['facets']);
    let totalPages = Math.ceil(this.totalProducts  / pageSize);

    // ensure current page isn't out of range

    if (currentPage < 1) { 
        currentPage = 1; 
    } else if (currentPage > totalPages) { 
        currentPage = totalPages; 
    }
    
    let startPage: number, endPage: number;
    if (totalPages <= 10) {
        // less than 10 total pages so show all
        startPage = 1;
        endPage = totalPages;
    } else {
        // more than 10 total pages so calculate start and end pages
        if (currentPage <= 6) {
            startPage = 1;
            endPage = 10;
        } else if (currentPage + 4 >= totalPages) {
            startPage = totalPages - 9;
            endPage = totalPages;
        } else {
            startPage = currentPage - 5;
            endPage = currentPage + 4;
        }
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, this.totalProducts  - 1);

      // create an array of pages to ng-repeat in the pager control
      let pages = _.range(startPage, endPage );

      let count=[];
      for(let k=0;k<=pages.length;k++ ){
        const obj={
          content:k+1,
          value:k
        }
        count.push(obj);
      }
      this.totalNumber=count;  
      this.pageLoad=true;
    },(err)=>{
      this.pageLoad=true;
    })
 }
//search related call

renderSearchRelatedpage(searchId,facets,pageSize){
 this.catalogSpecific=true;
 const baseSiteid =this.singletonServ.catalogVersionId
 this.singletonServ.setCookie("searchId", searchId, 365);
 this.categoryServ.getCategorySearchResults(searchId,baseSiteid,pageSize).subscribe((resp)=>{
     const products =resp['products'];
     const prodPaginator = resp['pagination'];
     this.pagination=resp['pagination'];
     _.forEach(products, function(value,i) {
       _.assignIn(value, { show: false, id: i + 1, review: (Math.random() * 5).toFixed(1)});
     });
     this.categoryData = products; 
     this.pagedItems=products;
     this.activeProducts=(products)?true:false;
     this.totalProducts =prodPaginator['totalResults'];
     this.currentPage=prodPaginator['currentPage'];
     const currentPage = prodPaginator['currentPage']+1;
     this.freeSearchText=resp['freeTextSearch'];
     this.spellingSuggestion=resp['spellingSuggestion'];
    //  this.setPage(currentPage);
     this.renderFacets(facets,resp['facets']);

     let totalPages = Math.ceil(this.totalProducts  / pageSize);

     let startPage: number, endPage: number;

     if (totalPages <= 5) {
         startPage = 1;
         endPage = totalPages;
     } else {
         if (currentPage <= 3) {
             startPage = 1;
             endPage = 5;
         } 
         else if (currentPage + 1 >= totalPages) {
             startPage = totalPages - 4;
             endPage = totalPages;
         } else {
             startPage = currentPage - 2;
             endPage = currentPage+2;
         }
     }

     // calculate start and end item indexes
     let startIndex = (currentPage - 1) * pageSize;
     let endIndex = Math.min(startIndex + pageSize - 1, this.totalProducts - 1);

     // create an array of pages to ng-repeat in the pager control
     let pages = _.range(startPage, endPage );

     let count=[];
     for(let k=0;k<=pages.length;k++ ){
       const obj={
         content:k+1,
         value:k
       }
       count.push(obj);
     }
     this.totalNumber=count; 
     this.pageLoad=true 
  },(error)=>{
    this.pageLoad=true
  });
}
    //filters functions
    onShowFirstPage(){
      this.pager=true;      
      this.viewAllProducts=false;
      this.freshRelevanceSpecific=false;
      let prdId=this.searchPrdId;
      const pageSize=12;
      this.getCategoryData(prdId,true,pageSize);
    }
    onfilterBy(event,sortId,valueData,i){
      const that =this;
      this.pager=true;
      this.viewAllProducts=false;
      let checkFilterStatus=false;
      this.checkList=true;
      if(this.facetValue.nativeElement.querySelector('input[type=checkbox]:checked')){
        checkFilterStatus=true;
      }
      this.paths = '';
      const checkedData=[];
      if(this.searchDisplay){
         this.filterSearchDisplay(event.target.checked,sortId,valueData,i)
      }else{

      
     if(event.target.checked){
         that.facets[sortId]['checked']=true;
          that.facets[sortId]['values'][i]['selected']=true;
       
          _.map(that.facets, (obj, i) => {
            _.map(obj.values, (item, k) => {
              if (item.selected) {
                that.checkedCount=that.checkedCount+1;
                checkedData.push(obj.name);
                const queryval = item['query']['query']['value'].substring(20, item['query']['query']['value'].length);
                const queryIndx = queryval.indexOf(':');
                const subStrQueryVal = queryval.substring(queryIndx, queryval.length);
                const splitString = subStrQueryVal;
                this.paths = this.paths + splitString;
              }
            })
          });

            this.checkedData=_.uniq(checkedData);
            const id=this.searchPrdId+this.paths;
            this.getCategoryData(id,false,this.pageSize);
              
     }else{
      that.facets[sortId]['checked']=false;
      this.facets[sortId]['values'][i]['selected']=false;
    
      _.map(that.facets, (obj, i) => {
        _.map(obj.values, (item, k) => {
          if (item.selected) {
            checkedData.push(obj.name);
            this.checkedCount=this.checkedCount+1;
            const queryval = item['query']['query']['value'].substring(20, item['query']['query']['value'].length);
            const queryIndx = queryval.indexOf(':');
            const subStrQueryVal = queryval.substring(queryIndx, queryval.length);
            const splitString = subStrQueryVal;
            this.paths = this.paths + splitString;
          }else{
            this.checkedCount=this.checkedCount-1;
          }
        })
      });
        this.checkedData=_.uniq(checkedData);
        const id=this.searchPrdId+this.paths;
        this.getCategoryData(id,false,this.pageSize);
       }
    }
    }

    //search related filters

    filterSearchDisplay(check,sortId,valueData,i){
      const that=this;
      let  v='relevance:'
      const checkedData=[];
      let checkFilterStatus=false;
      if(this.facetValue.nativeElement.querySelector('input[type=checkbox]:checked')){
        checkFilterStatus=true;
      }

      if(check){
        that.facets[sortId]['checked']=true;
        that.facets[sortId]['values'][i]['selected']=true;
        this.checkedCount=+this.checkedCount;
        _.map(that.facets, (obj, i) => {
          _.map(obj.values, (item, k) => {
            if (item.selected) {
              checkedData.push(obj.name);
              let queryUrlText=item['query']['query']['value']
              const queryval = queryUrlText.substring(queryUrlText.indexOf('relevance')+v.length, item['query']['query']['value'].length);
              const splitString = ':'+ queryval;
              this.paths = this.paths + splitString;
            }
          })
        });
        this.checkedData=_.uniq(checkedData);
          const id=this.searchPrdId+':relevance'+this.paths; 
          this.renderSearchRelatedpage(id,false,this.pageSize);
      }else{
        this.facets[sortId]['values'][i]['selected']=false;
        _.map(that.facets, (obj, i) => {
          _.map(obj.values, (item, k) => {
            if (item.selected) {
              checkedData.push(obj.name);
              let queryUrlText=item['query']['query']['value']
              const queryval = queryUrlText.substring(queryUrlText.indexOf('relevance')+v.length, item['query']['query']['value'].length);
              const splitString = ':'+ queryval;
              this.paths = this.paths + splitString;
            }
          })
        });
        this.checkedData=_.uniq(checkedData);
        const id=this.searchPrdId+':relevance'+this.paths;
        this.renderSearchRelatedpage(id,false,this.pageSize);
      }

    }

    //updating facets

    renderFacets(status,resp){
      const that =this;
      let facets =resp;
      const dataFilters= this.facets;
      let checkFilterStatus=false;
      if(this.facetValue){
      if(this.facetValue.nativeElement.querySelector('input[type=checkbox]:checked')){
        checkFilterStatus=true;
      }
       }
      if(status){
         this.facets=resp;
      }else{
        _.map(that.facets,(obj)=>{
          obj['values'].map((item)=>{
              if(!item.selected){
                item['disable']=true;
              }
          })
        });

        _.map(facets, function(value,i) {   
               const facetValue= _.filter(that.facets,(item,p)=>{
              return item.name == value.name}); 
             if(facetValue){            
              facetValue.map((obj)=>{
                obj.values.map((val,k)=>{
                  const data= _.find(facets[i]['values'],(item,p)=>{return item.name == val.name})
                  if(data){
                      obj['values'][k]['count']=data['count'];
                      obj['values'][k]['disable']=false;
                      obj['values'][k]['name']=data.name;
                  }else{
                    val['disable']=true;
                    if(that.checkedData.length==1){
                          if(obj.name==that.checkedData[0]){
                            obj['values'][k]['disable']=false;
                          }
                     }
                  }
                })
              })
            }        
      });
      }
    }

    onClearAll(){
      if(this.checkList){
          this.checkList=false;
          this.showFacets=true;
          if(this.searchDisplay){
            this.renderSearchRelatedpage(this.searchPrdId,true,this.pageSize);
          }else{
            let prdId='/search?query=:relevance:category:' +this.catId;
            this.getCategoryData(prdId,true,this.pageSize);
          }
      }
    }
    onFacetClicked(filterData,sortId){
      this.facets[sortId]['checked']=!this.facets[sortId]['checked'];
    }
    onCloseQuickView(data){
      const index = _.findIndex(this.pagedItems,(resp)=>{return resp.code==data.code});
      this.pagedItems[index]['show']=false;
    }

    
  
//tabs
updateFilterData(event,valueData,i){
  const sortId=this.sortId
  this.onfilterBy(event,sortId,valueData,i);
  this.checkList=false;
  this.checkedfilter=true;
}
onShowFilters(){
  this.refinePath ='';
  this.mbFacet=!this.mbFacet;
  this.refineFacets =[];
  this.checkedfilter=false;
  this.IsmodelShow=true;
  this.showFacets=false;
  this.checkList=false; 
}
ontapClear(event){
  const that =this;
  let  v='relevance:'
      const checkedData=[];
  let index =_.findIndex(that.facets,(resp)=>resp.name ==that.refinePath);
  if(index!=-1){
    that.facets[index]['values'].map((obj,i)=>{
       obj.selected=false;
    });
  
 
  
  _.map(that.facets, (obj, i) => {
    _.map(obj.values, (item, k) => {
      if (item.selected) {
        checkedData.push(obj.name);
        const queryval = item['query']['query']['value'].substring(20, item['query']['query']['value'].length);
        const queryIndx = queryval.indexOf(':');
        const subStrQueryVal = queryval.substring(queryIndx, queryval.length);
        const splitString = subStrQueryVal;
        this.paths = this.paths + splitString;
      }
    })
  });

    this.checkedData=_.uniq(checkedData);
    const id=this.searchPrdId+this.paths;
    this.getCategoryData(id,false,this.pageSize);
}
}
ontapApplyFacets(){
    this.IsmodelShow=!this.IsmodelShow;
    this.mbFacet=!this.mbFacet;
}

onCheckListDone(){
  this.refinePath ='';
  this.mbFacet=!this.mbFacet;
  this.refineFacets =[];
  this.checkedfilter=false;
  this.IsmodelShow=true;
  this.showFacets=false;
  this.checkList=true;
  
}
onRefineitem(data,sortID){
  this.sortId=sortID;
  this.refinePath=data.name;
  this.mbFacet=!this.mbFacet;
  this.IsmodelShow=!this.IsmodelShow;
  this.refineFacets =data.values;
  this.checkedfilter=true;
  this.checkList=false;
  this.showFacets=false;
  }
  onMbFilterByClick(){
    this.refinePath ='';
    this.refineFacets =[];
    this.mbFacet = true;
    this.IsmodelShow=true;
  }
  onCloseModalWindow(){
    this.IsmodelShow=!this.IsmodelShow;
    this.mbFacet=!this.mbFacet;
  }
    ngOnDestroy() { 
      if (this.navigationSubscription) {  
         this.navigationSubscription.unsubscribe();
      }
    }
}
