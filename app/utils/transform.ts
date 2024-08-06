export const jsonToFormData = (jsonObject: Record<string, any>, formData = new FormData(), parentKey = ''):FormData  => {
  for (const key in jsonObject) {
    if (jsonObject.hasOwnProperty(key)) {
      const value = jsonObject[key];
      const currentKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // If the value is an object, recursively convert it
        jsonToFormData(value, formData, currentKey);
      } else {
        // Convert the value to a string and append to FormData
        formData.append(currentKey, String(value));
      }
    }
  }

  return formData;
}

export const formDataToJson = (formData: FormData): Record<string, string> => {
    const jsonObject: Record<string, string> = {};
    formData.forEach((value, key) => {
      jsonObject[key] = value.toString();
    });
    return jsonObject;
  }
export const  extractNumbersFromStringArray= (stringArray: string[]) => {
    const regex = /\d+$/;
    const extractNumbers = (inputString:string) => {
        const matches = inputString.match(regex);
        return matches ? matches.join(',') : '';
    };

    const extractedNumbersArray = stringArray.map(extractNumbers);
    return extractedNumbersArray.join(',');
}