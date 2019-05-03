import { Component, OnInit, Input,Output, EventEmitter,OnChanges ,SimpleChange, AfterContentInit} from '@angular/core';
import {countries} from '../../../app.constant';
import {ShipmentForm} from '../../../forms/shipmentForm.form';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {DeliveryComponentService} from '../delivery.service';
import {profileComponentService} from '../../../component/profile-form/profile.service';
import {SingletonService} from '../../../services/singleton.service';
import { HttpClient ,HttpHeaders,HttpErrorResponse} from '@angular/common/http';
import * as _ from 'lodash';
@Component({
  selector: 'app-delivery-form',
  templateUrl: './delivery-form.component.html',
  styleUrls: ['./delivery-form.component.scss']
})
export class DeliveryFormComponent implements OnInit,AfterContentInit,OnChanges {
  @Output() onValueChanged: EventEmitter<any> = new EventEmitter<any>();
  @Input() deliveryInfo:any;
  loading:boolean;
  reguser:boolean;
  countries:Array<any>=JSON.parse(JSON.stringify(countries));
  shipmentForm:FormGroup;
  manualAdress:boolean;
  showDeliveryForm:boolean;
  addressList:Array<any>;
  updateAddress:boolean;
  addressId:string;
  addressForm:FormGroup;
  addressData:any;
  shippingInfo:any;
  userInfo:any;
  postalAddresses:Array<any>;
  guestUser:boolean;
  currentUser:boolean;
  allItems:any;
  checkAddressId:any;
  postCodeStatus:boolean;
  ukSpecificForm:boolean;
  constructor(public singletonServ:SingletonService,public http: HttpClient, public customerForm:ShipmentForm,private fb: FormBuilder,public profileServ:profileComponentService,
    public deliveryServ:DeliveryComponentService) {
      this.ukSpecificForm=true;
      this.postCodeStatus=true;
      this.guestUser=false;
    this.manualAdress=true;
    this.showDeliveryForm=false;
    this.updateAddress=false;
    this.shipmentForm = this.fb.group(customerForm.getForm());
    this.addressForm = this.fb.group(customerForm.addressData());
    this.loading=false;
    if(sessionStorage.getItem('customerToken')){
      this.currentUser=true;
    }else{
      this.currentUser=false;
    }
   }
   ngAfterContentInit(){
      // const country= _.find(this.countries, function(o) { return o['name']= "United Kingdom" });
      // this.shipmentForm.controls['country'].patchValue(country);
   }
   ngOnChanges(changes: { [propKey: string]: SimpleChange })  {
    if (changes['deliveryInfo']){
      if (changes['deliveryInfo']['currentValue'] != undefined){  
         this.shippingInfo=changes['deliveryInfo']['currentValue'];
          const form =changes['deliveryInfo']['currentValue'];
         if(form.updateForm){
           if(form.editStatus){
           this.shipmentForm.patchValue(form.updateForm.customerAddress);
         }
        }
      }
    }
  }
   onAddressChange(address,k){
     this.addressList.map((obj)=>{
       if(obj==k){
         obj['defaultAddress']=true;
       }else{
        obj['defaultAddress']=false;
       }
     });
     this.addressData=address;
   }
   onSelectAddress(){
      if( this.addressData){
        this.addressData['deliveryType']='UK & International delivery';
         this.onValueChanged.emit(this.addressData);
      }
   }
  ngOnInit() {
    if(sessionStorage.getItem('customerToken')){
      this.reguser=true;
      const data = JSON.parse(sessionStorage.getItem('customerToken'));
      const emailid=data.email;
      const token=data['token'];
      this.getUserAddressList(emailid,token);
    }else{
      this.reguser=false;
      this.showDeliveryForm=true;
    }
  }
  onSubmitAddressForm(){
  }
  editAddress(data){
    this.addressId=data.id;
    this.showDeliveryForm=true;
    this.updateAddress=true;
    this.shipmentForm.patchValue(data); 
    // const countryIndx= _.findIndex(this.countries, function(o) { return o['isocode']= data['country']['isocode']; });
    // this.shipmentForm.controls['country'].patchValue(this.countries[countryIndx]);
    this.manualAdress=false;
    this.reguser=false;    
  }
  getUserAddressList(email,token){
    const cVrsnid = this.singletonServ.catalogVersionId;
    const that=this;
    this.addressData=undefined;
    this.reguser=false;
    that.loading=true;
    this.profileServ.getUserAddress(cVrsnid,token,email).subscribe((resp)=>{
      this.addressList=resp['addresses'];
      this.addressList.map((obj)=>{

        if(obj.defaultAddress){
          this.addressData=obj;
        }
        if(that.checkAddressId){
          if(obj.id ==that.checkAddressId){
            obj.defaultAddress=true
            that.addressData=obj
          }else{
            obj.defaultAddress=false
          }
      }
      });
      that.showDeliveryForm=false;
      that.reguser=true;
      that.loading=false;

    },(error)=>{
      that.loading=false;
    });
  }
  onSearchByPostal(){
    this.shipmentForm.controls['postalCode'].setValue('');
    this.shipmentForm.controls['line1'].setValue('');
    this.shipmentForm.controls['line2'].setValue('');
    this.shipmentForm.controls['County'].setValue('');
    this.shipmentForm.controls['city'].setValue('');
    this.manualAdress=true;
  }
  addressManual(){
    this.manualAdress=false;
  }
  addAddress(){
    this.reguser=false;
    this.showDeliveryForm=true;
  }
  onSubmitForm(){
    const that=this;
    const cVrsnid = this.singletonServ.catalogVersionId;
  if(this.shipmentForm.valid){
    that.loading=true;
    const user=this.shipmentForm.value;
    const _address={
      "country": {
        "isocode": user.country.isocode
      },
      "type": "Home",
      "firstName": user.firstName,
      "postalCode": user.postalCode,
      "town": user.city,
      "lastName": user.lastName,
      "phone": user.phone,
      "line1": user.line1,
      "line2": user.line2,
      "companyName": "",
      "visibleInAddressBook": false,
      "fpo": false,
      "recordType": "S",
      "titleCode": user.titleCode
    };
    this.userInfo=_address;
    if(sessionStorage.getItem('customerToken')){
    
      const userData = JSON.parse(sessionStorage.getItem('customerToken'));
      const email =userData.email;

    that.profileServ.generateToken().subscribe((resp)=>{ 
      const tokenId=resp['access_token'];
      if(this.updateAddress){
        this.updateAddressForm(cVrsnid,_address,tokenId,email);
      }else{

      this.addUserAddress(cVrsnid,_address,tokenId,email,userData);
      }
    },(err)=>{
      that.loading=false;
    })
  
}else{
  if(sessionStorage.getItem('cartGUID')){
    const guidData = JSON.parse(sessionStorage.getItem('cartGUID'));
    let tokenId =guidData['tokenId'];
    let cartId =guidData['guid'];

    this.addAnnonymousAddress(cVrsnid,tokenId,cartId,_address);
  }else{
    that.profileServ.generateToken().subscribe((resp)=>{ 
      const tokenId=resp['access_token'];
    },(err)=>{
   
    })
  }
}
}
}
onChangeCountry(event){
  const _isocode=this.shipmentForm.value.country.isocode;
  if(_isocode !='GB'){
  this.manualAdress=false;
  this.ukSpecificForm=false;
  }else{
    this.ukSpecificForm=true;
  }
}
findAddress(event){
  event.preventDefault();
  const that =this;
  const val=this.shipmentForm.value;
  const postcode=val['postalCode'];
  that.deliveryServ.getPostCode(postcode).subscribe((response)=>{
    if(response["Items"][0]["Error"]){
     this.postCodeStatus=false;
    }else{
      this.postCodeStatus=true;
     that.postalAddresses=response['Items'];
     if(val['line1'].length!=0){
       let i;
      for (i = 0; i < response['Items'].length; i++) {
        if (response['Items'][i]['StreetAddress'].indexOf(val['line1']) !=-1) {
          console.log(response['Items'][i]['StreetAddress']);
          that.shipmentForm.controls['line1'].setValue('');    
          that.onSelectPlace(response['Items'][i]['Id']);
          break;
        }
      }
  
    }
  }
  },(error)=>{

  });

}
onSelectPlace(val){
  const that=this;  
  const id=val;
  this.deliveryServ.retrievePostalAddress(id).subscribe((resp)=>{
    const _postAddress=resp['Items'];
    if(!_postAddress[0].Error){
      that.postalAddresses=resp['Items'];
  

    that.postalAddresses=undefined;
    this.manualAdress=false;
    let _addresses=resp['Items'][0];
    that.shipmentForm.controls['city'].setValue(_addresses['PostTown']);
  
    if(_addresses['Company'].length==0){
     that.shipmentForm.controls['line1'].setValue(_addresses['Line1']);
     that.shipmentForm.controls['line2'].setValue(_addresses['Line2']);
   }else{
    that.shipmentForm.controls['line1'].setValue(_addresses['Company']);
    that.shipmentForm.controls['line2'].setValue(_addresses['Line1']);
   }
   that.shipmentForm.controls['postalCode'].setValue(_addresses['Postcode']);
   
   that.shipmentForm.controls['County'].setValue(_addresses['County']);
  }else{
    alert('please enter valid postCode');
  }
},(err)=>{

  });

}
onPostCodeKeyUp(el){
  if(!el || !el.target.value) return;
   el.target.value = el.target.value.toUpperCase();
}
addAnnonymousAddress(cVrsnid,tokenId,cartId,body){
  const that =this;
  that.deliveryServ.createAnnonymousAddress(cVrsnid,tokenId,cartId,body).subscribe((resp)=>{
    this.addressData=this.userInfo;
    this.onValueChanged.emit(this.addressData);
  },(error)=>{

  });

}
addUserAddress(cVrsnid,_address,tokenId,email,user){
  const that =this;
  this.deliveryServ.addShippingAddress(cVrsnid,tokenId,_address,email,user.code).subscribe((response)=>{
    that.checkAddressId=response['id'];
    that.getUserAddressList(email,tokenId);
          },(error)=>{
            that.loading=false;
          })
}
updateAddressForm(cVrsnid,_address,tokenId,email){
  const that =this;
  const id =this.addressId;
  this.profileServ.updateUserAddress(cVrsnid,_address,tokenId,email,id)
  .subscribe((response)=>{
    that.getUserAddressList(email,tokenId);
    that.showDeliveryForm=false;
          },(error)=>{
            that.loading=false;
          })
}
onResetForm(){
  this.showDeliveryForm=false;
  this.updateAddress=false;
  this.manualAdress=false;
  this.reguser=true; 
}
}
