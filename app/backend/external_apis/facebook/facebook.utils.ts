/* eslint-disable array-callback-return */
import type { Config, ISelectSource } from "./facebook.types";

export const mapViewAccount = (input: any) => {
  var output: ISelectSource[] = [];
  input &&
    input.businesses &&
    input.businesses.data.map((item: any, index: number) => {
      output.push({
        label: item.id + "-" + item.name,
        value: item.id,
      });
    });
  return output;
};
export const mapViewPixel = (input: any) => {
  var output: ISelectSource[] = [];
  input &&
    input.adspixels &&
    input.adspixels.data.map((item: any, index: number) => {
      output.push({
        label: item.id + "-" + item.name,
        value: item.id,
      });
    });
  return output;
};

export const mapViewCatalog = (input: any) => {
  var output: ISelectSource[] = [];
  input &&
    input.data &&
    input.data.map((item: any, index: number) => {
      output.push({
        label: item.id + "-" + item.name,
        value: item.id,
      });
    });
  return output;
};

export const removeNullValues = (value: any) => {
  if (value === null) {
    return undefined;
  }
  return value;
}
export const formatRules =  (input:any) => {
  let output:Config;
  return;
}