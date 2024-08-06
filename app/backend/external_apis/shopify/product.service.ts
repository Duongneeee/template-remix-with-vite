import axios from "axios";
const version = '2024-04'
// TODO page
export const getAllProducts = async (shop:string, shopifyToken:string ='') => {
  try {
    const data = {
      query: `query {
        products(first: 200, reverse: true) {
          edges {
            node {
              id
              title
              handle
              tags
              productType
              priceRangeV2 
              { maxVariantPrice {
                 amount
                 currencyCode
                } 
                minVariantPrice { 
                  amount 
                  currencyCode} 
              }
              featuredImage { 
                altText 
                url 
              }
              tags
              totalInventory
              productType
              onlineStorePreviewUrl
            }
          }
          pageInfo {
                  endCursor
                  hasNextPage
                }
        }
      }`,
      variables: {}
    };

    const response = await axios.post(`https://${shop}/admin/api/${version}/graphql.json`, data, {
      headers: {
        'X-Shopify-Access-Token': shopifyToken,
        'Content-Type': 'application/json'
      },
      maxBodyLength: Infinity
    });

    return response.data.data.products;

  } catch (error) {
    console.error(error);
    return []; // Return an empty array or handle the error accordingly
  }
};

export const transformOption = (productsData:any) => {
  return productsData.edges.map((edge:any) => {
    const product = edge.node;
        // Extract numeric part of the "id"
    const numericId = product.id.match(/\d+/)[0];
    return {
      label: product?.title,
      value: numericId
    };
  });
};

export const transformProducts = (productsData:any) => {
  return productsData.edges.map((edge:any) => {
    const product = edge.node;
    // Extract numeric part of the "id"
    const numericId = product.id.match(/\d+/)[0];
    return {
      id:numericId,
      value: `${product.title}-${numericId}`,
      label: product?.title,
      image: product?.featuredImage?.url,
      tags: product?.tags,
      productType: product?.productType,
    };
  });
};

export const transformProductIds = (productsData:any) => {
  return productsData.edges.map((edge:any) => {
    const product = edge.node;
    // Extract numeric part of the "id"
    const numericId = product.id.match(/\d+/)[0];
    return `${numericId}` ;
  });
};

export const getAccessTokenStoreFont = async (shop:string,accaccessToken:string ='')=>{
  try{
    const response:any = await axios.post(`https://${shop}/admin/api/${version}/storefront_access_tokens.json`,{storefront_access_token:{title:"Test"}}, {
      headers: {
        'X-Shopify-Access-Token': accaccessToken,
        'Content-Type': 'application/json'
      },
      maxBodyLength: Infinity
    });
    // console.log('response',response)
    return response.data.storefront_access_token.access_token
  }catch (error) {
    console.error(error);
    return []; 
  }
}

export const getProductTags = async (shop:string, access_token:string ='') => {
  try {
    const data = {
      query: `query{
        productTags(first: 100) {
          edges {
            cursor
            node
          }
        }
      }`,
      variables: {}
    };
    const response = await axios.post(`https://${shop}/api/${version}/graphql.json`, data, {
      headers: {
        'X-Shopify-Storefront-Access-Token': access_token,
        'Content-Type': 'application/json'
      },
      maxBodyLength: Infinity
    });
    const transformProducts = (productsData:any) => {
      return productsData.edges.map((edge:any) => {
        // const product = edge.node;
        // Extract numeric part of the "id"
        // const numericId = product.id.match(/\d+/)[0];
        return {
          id: edge.node,
          value: edge.node,
          label: edge.node
        };
      });
    };


    return transformProducts(response.data.data.productTags);

  } catch (error) {
    console.error(error);
    return []; // Return an empty array or handle the error accordingly
  }
};

export const getProductTypes = async (shop:string, access_token:string ='') => {
  try {
    const data = {
      query: `query {
        productTypes(first: 100) {
          edges {
            cursor
            node
          }
        }
      }`,
      variables: {}
    };
    const response = await axios.post(`https://${shop}/api/${version}/graphql.json`, data, {
      headers: {
        'X-Shopify-Storefront-Access-Token': access_token,
        'Content-Type': 'application/json'
      },
      maxBodyLength: Infinity
    });

    const transformProducts = (productsData:any) => {
      let arrayProduct:any = [];
      productsData.edges.map((edge:any) => {
        // const product = edge.node;
        // Extract numeric part of the "id"
        // const numericId = product.id.match(/\d+/)[0];
        edge.node && arrayProduct.push({
          id: edge.node,
          value: edge.node,
          label: edge.node
        });
      });
      return arrayProduct
    };

    return transformProducts(response.data.data.productTypes);

  } catch (error) {
    console.error(error);
    return []; // Return an empty array or handle the error accordingly
  }
};