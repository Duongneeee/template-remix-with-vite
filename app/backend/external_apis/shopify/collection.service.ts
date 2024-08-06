import { LOG_LEVELS, sentryLogger } from '~/utils/logger';
import type { IProduct, IProductInCollectionsReq } from './collection.types';
import axios from "axios";
const version = '2024-04'
export const getCollections = async (shop:string, shopifyToken:string ='') => {
  try {
    const data = {
      query: `query {
        collections(first: 100) {
          edges {
            node {
              id
              title
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
    const transformCollections = (collectionsData:any) => {
      return collectionsData.edges.map((edge:any) => {
        const collection = edge.node;
        // Extract numeric part of the "id"
        const numericId = collection.id.match(/\d+/)[0];
        return {
          id:numericId,
          label: collection.title,
          value: `${collection.title}-${numericId}`
        };
      });
    };

    return transformCollections(response.data.data.collections);

  } catch (error) {
    console.error(error);
    return []; // Return an empty array or handle the error accordingly
  }
};

export const getCollectionsStorefront = async (shop:string, shopifyToken:string ='') => {
  try {
    const data = {
      query: `query {
        collections(first: 100) {
          edges {
            node {
              id
              title
              products(first: 200) {
                edges {
                  node {
                    id
                  }
                }
              }
            }
          }
        }
      }`,
    };

    const response = await axios.post(`https://${shop}/api/${version}/graphql.json`, data, {
      headers: {
        'X-Shopify-Storefront-Access-Token': shopifyToken,
        'Content-Type': 'application/json'
      },
      maxBodyLength: Infinity
    });
    const transformCollections = (collectionsData:any) => {
      return collectionsData.edges.map((edge:any) => {
        const collection = edge.node;
        // Extract numeric part of the "id"
        const productIds = collection.products.edges.map((productEdge:any)=>{
          const product = productEdge.node;
          const productNumericId = product.id.match(/\d+/)[0];
          return productNumericId
        })
        const numericId = collection.id.match(/\d+/)[0];
        return {
          id:numericId,
          label: collection.title,
          value: `${collection.title}`,
          productIds
        };
      });
    };

    return transformCollections(response.data.data.collections);

  } catch (error) {
    console.error(error);
    return []; // Return an empty array or handle the error accordingly
  }
};
export const getProductsByCollection = async (req:IProductInCollectionsReq) => {
  const {shop, shopifyToken, collectionId} = req
  const _url = `https://${shop}/admin/api/${version}/collections/${collectionId}/products.json`;
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: _url,
    headers: {
      "X-Shopify-Access-Token": shopifyToken,
    },
  };

  try {
    const res = await axios.request(config);
    if (res.data) {
      return mapResponseProduct(res.data.products);
    }
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error fetching product in collections ", {
      additionalInfo: error
    });
    throw error; // Re-throw the error to indicate that an error occurred
  }
};
const mapResponseProduct = (obj: IProduct[]): number[] => {
  return obj.map(product => product.id);
};