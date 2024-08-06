export const targetOptions = [
  { value: "all", label: "Entire Store" },
  { value: "collections", label: "Collections" },
  { value: "products", label: "Products" },
  // { value: "tag", label: "Tag" },
];
export const eventOptions = [
  { label: "variant_id", value: "variant_id" },
  { label: "product_id", value: "product_id" },
];

export const AudienceRulesOperand1Options = [
  { label: "Url", value: "url" },
  { label: "Content Ids", value: "content_ids" },
  { label: "Content Type", value: "content_type" },
  { label: "Num Items", value: "num_items" },
  { label: "Value", value: "value" },
  { label: "Content Name", value: "content_name" },
  { label: "Currency", value: "currency" },
  { label: "Content", value: "content" },
];
export const AudienceRulesRelationOptions = [
  { label: "Contains", value: "i_contains" },
  { label: "Not Contains", value: "not_contains" },
  { label: "Equals", value: "eq" },
  { label: "Not equals", value: "neq" },
  { label: "Less than", value: "lt" },
  { label: "Less than or equal", value: "lte" },
  { label: "Greater than", value: "gt" },
  { label: "Greater than or equal", value: "gte" },
];

export const audienceChoiceOptions = [
  { value: "and", label: "ALL" },
  { value: "or", label: "ANY" },
];

export const lookaLikeModeOptions = [
  {
    label: "Audience Based",
    value: "audience_based",
  },
  {
    label: "Campaign Based",
    value: "campaign_based",
  },
];

export const lookaLikeClassificationOptions = [
  {
    label: "Combine selected country",
    value: "1",
  },
  {
    label: "Each selected country or region is 1 audience",
    value: "2",
  },
];

export const productConditionOptions = [
  {
    label:'new',
    value:'new'
  },
  {
    label:'used',
    value:'used'
  }
]

export const ageGroupOptions= [
  {
    label:'all ages',
    value:'all ages'
  },
  {
    label:'adult',
    value:'adult'
  },
  {
    label:'infant',
    value:'infant'
  },
  {
    label:'kids',
    value:'kids'
  },
  {
    label:'newborn',
    value:'newborn'
  },
  {
    label:'teen',
    value:'teen'
  },
  {
    label:'toddler',
    value:'toddler'
  }
]

export const genderOptions = [
  {
    label:"female",
    value:"female"
  },
  {
    label:"male",
    value:"male"
  },
  {
    label:"unisex",
    value:"unisex"
  }
];

export const accountDev = ['quickstart-13a0a21b.myshopify.com','my-project-test-shop-ify.myshopify.com','duongnh-store.myshopify.com','lucky-birds-store.myshopify.com', 'michelle-97.myshopify.com','zahuy01.myshopify.com']

export const AudienceSizeOptions = () =>  {
  var array = [];
  for (let i = 1; i <= 20; i++) {
    let label = i + "%";
    let value = String(i + "%");
    array.push({ label: label, value: value });
  }
  return array;
}

export const appConfig = {
  themeApp: 1,
  scriptCheckout: 2,
  eventAssessment: 3,
  pixelAssessment: 4,
  stepOnBoarding: 5,
  reviewApp: 6
}

export const videoConfig = {
  themeApp: 'https://youtu.be/u4kM8V98eiI?si=9Pl_XiEfZdvr0LgH',
  scriptCheckout: 'https://youtu.be/HWkQqk2Epmg?si=uK7i19_BoHyo0IoE',
  setupMetaPixel: 'https://youtu.be/0X8ec55G-Lk?si=CSzgXbKo7iFQayrQ',
  generateAccessToken: 'https://youtu.be/zvoA7aWwai0?si=JenKY4IaUG0xBpaG',
  testEventCode: 'https://youtu.be/-jwGRZuQsrg?si=VeKpdYrIKiKWQHb9',
  checkEvent: 'https://youtu.be/oNd7ftL0fq4?si=nzZmCdGiNnwC58Og',

  generateAccessTokenTiktok: 'https://youtu.be/uc9nCB2icEg',
  testEventCodeTiktok: 'https://youtu.be/mc1gfDqPSDw',
  setupTiktokPixel: 'https://youtu.be/5YyVbvhWCNY',

}

export const lstPlatform = [
  {
    value:'facebook',
    label:'Facebook'
  },
  {
    value:'tiktok',
    label:'Tiktok'
  },
]

export const lstSchedule = [
  { value: "daily", label: "DAILY" },
  { value: "weekly", label: "WEEKLY" },
  { value: "monthly", label: "MONTHLY" },
];