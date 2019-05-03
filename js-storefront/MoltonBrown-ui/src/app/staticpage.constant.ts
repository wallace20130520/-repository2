

export const CountryJsonData =[
  {
   "countryCode":"uk",
    "countryImg":"../assets/imgs/icon_country_german.gif",
    "countryName":"United kingdom",
    "currencyCode":"uk",
    "catalogversionId":'moltonbrown-uk',
    "locale":"en-GB"
},
{
  "countryCode":"ja",
  "countryImg":"../assets/imgs/icon_country_japan.gif",
  "countryName":"Japan",
  "currencyCode":"ja",
  "catalogversionId":'moltonbrown-ja',
  "locale":''
}
   
];

export const moltonBrownPolicies = [
  {
    name: 'Help & Information',
    data: [
      { name: 'contact us' ,templateName:'contact-us',org:true},
      { name: 'FAQs & Help',templateName:'faqs',org:true },
      { name: 'Affiliate Enquiries',org:false,routename:'affliate' },
      { name: 'Trade & Press Enquiries',templateName:'trade-enquiries',org:true },
      { name: 'Sitemap',templateName:'sitemap',org:true }
    ]
  }, {
    name: 'About Us',
    data: [
      { name: 'About Molton Brown',templateName:'about-us',org:true }, 
      { name: 'Our Heritage' ,templateName:'features',org:true,childroute:true,childRouteName:'molton-brown-history'}
    ]
  },
  {
    name: 'Our services',
    data: [
      { name: 'Delivery & Returns' ,templateName:'delivery',org:true},
       { name: 'Store Finder',templateName:'company',org:true,childroute:true,childRouteName:'stores' },
        { name: 'Hotel Amenities',templateName:'hotel-amenities',org:true }
      ]
  },
  {
    name: 'our policies',
    data: [
      { name: 'Terms & Conditions',templateName:'terms-conditions',org:true },
       { name: 'Privacy Policy' ,templateName:'privacy-policy',org:true}, 
       { name: 'Gender Pay Policy' }
      ]
  },
  {
    name:'corporate gifts',templateName:'corporate-gifts'
  },
  {
    name:'careers',templateName:'careers'
  },
  {
    name:'Trade Enquiries',templateName:'terms-conditions',org:true 
  }
];


export const hotelAmenities=[
    {
    name:'Hotel-Amenities',
    filterBy:'hotel-amenities',
    templateId:'f6007e3f-bd5d-489a-bf5c-e8052dc6e856',
    contentType:'containerwithMultipleContent',
    templateName:'acc-template-homepage'
    },
    {
    name:'Why Molton Brown',
    filterBy:'about',
    contentType:'',
    templateId:'aff2b812-fbb1-4afd-b83e-6b1a8e8d27db',
    templateName:'acc-template-homepage',
    },
    
    {
    name:'Hotel-Products',
    filterBy:'hotel-products',
    templateId:'a237a9b4-7066-48f1-9474-ee6e54249727',
    contentType:'homepage',
    templateName:'acc-template-homepage',
    children:[
     {
       name:'Luxury Collection I',
       filterBy:'luxury-collection-one',
       templateId:'94b53b02-998f-4ae0-a335-4d29fb893d0b',
       contentType:'homepage',
       templateName:'acc-template-homepage'
     },
     {
       name:'Luxury Collection II',
       filterBy:'luxury-collection-two',
       templateId:'8ffe8e10-974c-46b6-9551-5bec7e883442',
       contentType:'homepage',
       templateName:'acc-template-homepage'
     },
     {
       name:'The 1973 Collection',
       filterBy:'the-1973-collection',
       templateId:'869d31ab-20e6-4616-bdec-aaa8d42c178b',
       contentType:'homepage',
       templateName:'acc-template-homepage'
     },
     {
       name:'Essential Accessories',
       filterBy:'essential-accessories',
       templateId:'1c5712ba-5e2e-4e61-a83a-8ac94dd6ea69',
       contentType:'homepage',
       templateName:'acc-template-homepage'
     },
     {
       name:'Turndown Service',
       filterBy:'turndown-service',
       templateId:'dfa6ab9e-f2a4-4ffd-bee0-6e9957240dda',
       contentType:'containerwithMultipleContent',
       templateName:'acc-template-homepage'
     },
     {
       name:'Hand Care',
       filterBy:'hand-care',
       templateId:'2e6cb9cb-d683-4962-83f9-80b2c8f2d9d2',
       contentType:'containerwithMultipleContent',
       templateName:'acc-template-homepage'
     },
     {
       name:'Skin Care',
       filterBy:'skin-care',
       templateId:'218f5d8a-0c91-4645-a4f8-7d55bc2df2fa',
       contentType:'containerwithMultipleContent',
       templateName:'acc-template-homepage',
     },
     {
       name:'The Home Collection',
       filterBy:'catUKHF',
       templateId:'',
       contentType:'',
       templateName:''
     }
    ]
    },
    {
    name:'Bespoke Hotel Amenities',
    filterBy:'bespoke-hotel-amenities',
    templateId:'36fd8816-e9c5-4a14-a98f-4d401722c421',
    contentType:'homepage',
    templateName:'acc-template-homepage'
    },
    {
      name:'Download Hotel Brochure',
      filterBy:'hotel-brochure',
      templateId:'efd1be5a-7a1f-4dd6-a107-d57b8cc1f518',
      contentType:'homepage',
      templateName:'acc-template-homepage'
    },    
    {
    name:'Contact Hotel Amenities',
    filterBy:'hotel-brochure',
    templateId:'',
    contentType:'',
    templateName:''
    }
    
    ];

    
    export const organisation=[
      {
      name:'About Us',
      filterBy:'about-us',
      templateId:'1b7ab2df-f35f-4509-9bec-c6cabf7bd0d5',
      contentType:'homepage',
      templateName:'acc-template-homepage'
      },
      {
      name:'Contact Us',
      filterBy:'contact-us',
      templateId:'db0f73de-c677-4c1f-8cfa-270c02fda452',
      contentType:'text',
      templateName:'acc-template-text'
      },
      {
      name:'Trade Enquiries',
      filterBy:'trade-enquiries',
      templateId:'10ce38b9-160a-417c-9ac1-ce633e4592bd',
      contentType:'text',
      templateName:'acc-template-text'
      },
      {
      name:'Delivery & Returns',
      filterBy:'delivery',
      templateId:'39b7a4e9-3aa4-4728-80a2-845394181342',
      contentType:'text',
      templateName:'acc-template-text'
      },
      {
      name:'Molton Brown Stores'
      },
      {
      name:'Terms & Conditions',
      filterBy:'terms-conditions',
      templateId:'a0e6f518-9205-41ff-82fa-c3544aaccb62',
      contentType:'text',
      templateName:'acc-template-text',
      children:[
      {
        name:'Gift Cards Terms & Conditions',
         filterBy:'gift-terms-conditions',
        templateId:'7f980c1c-e76c-4405-ac86-33be27f48f6c',
        contentType:'text',
        templateName:'acc-template-text'
      },
      {
        name:'Promotional Terms & Conditions',
         filterBy:'promo-terms-conditions',
        templateId:'ce7f6975-c2ea-4ae9-9522-b2cc021bd5d5',
        contentType:'text',
        templateName:'acc-template-text'
      }
      ]
      },
      {
      name:'Privacy & Cookie Policy',
      templateId:'7039313a-8175-4335-ab26-1aca964c240a',
      filterBy:'privacy-policy',
      contentType:'text',
      templateName:'acc-template-text'
      },
      {
      name:'FAQs & Help',
      filterBy:'faqs-list',
      templateId:'ac7b8422-23eb-4bee-8733-4fc1ab0515f7',
      contentType:'text',
      templateName:'acc-template-text',
      children:[
      {
        name:'Placing an Order',
         filterBy:'faqs-order',
        templateId:'fb809b59-65a7-4a4d-aa56-e9ad3d9e82b6',
        contentType:'text',
        templateName:'acc-template-text'
      },
      {
        name:'Delivery',
          filterBy:'faqs',
        templateId:'c9517fe6-d904-4913-9279-5eae26817f89',
        contentType:'text',
         templateName:'acc-template-text'
      },
      {
        name:'Online Account',
         filterBy:'faqs-account',
        templateId:'a5a5d6b6-d919-4977-b91a-bb7a4f2a1a20',
        contentType:'text',
       templateName:'acc-template-text'
      },
      {
        name:'Product',
        filterBy:'faqs-product',
        templateId:'ba408c4c-4092-455b-9c72-b777ac3cc8d8',
        contentType:'text',
        templateName:'acc-template-text'
      },
      {
        name:'Gift Card',
        filterBy:'gift-cards-faqs',
        templateId:'9ee2811f-57e8-4a1f-ba5b-86ccb29398c0',
        contentType:'text',
        templateName:'acc-template-text'
      },
      {
        name:'Company',
        filterBy:'faqs-company',
        templateId:'b697f4aa-d456-4a4e-a298-3a7b2e2f1076',
        contentType:'text',
        templateName:'acc-template-text'
      },
      {
        name:'Careers'
      }
      ]
      },
      {
      name:'Sitemap'
      }
      
      ];

  export  const giftCard=[
    {
      name:'Molton Brown Gift Cards',
      route:'/giftcards',
      template:true
    },
    {
      name:'About Gift Cards',
      route:'/store/giftcards/about'
    },
    {
      name:'Buy Gift Cards',
      route:'/store/gifts/gift-cards/cat0012/'
    },
    {
      name:'Check your Balance',
      route:'/store/giftcards/check-balance'
    },
    {
      name:'Register your Card',
      route:'/store/giftcards/protected/registerCard'
    },
    {
      name:'Transfer Balance',
      route:'/store/giftcards/protected/transferBalance'
    },
    {
      name:'Report Lost/StolenCards',
      route:'/store/giftcards/protected/reportLostStolenCards'
    },
    {
      name:'FAQs',
      route:'/store/gift-terms-conditions'
    },
    {
      name:'Terms & Conditions',
      route:'/store/gift-terms-conditions'
    }
  ];
      
     