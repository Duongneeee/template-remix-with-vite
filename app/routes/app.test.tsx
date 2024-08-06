// import type { LoaderFunctionArgs } from "@remix-run/node";
// import { json } from "@remix-run/node";
// import { testTransaction } from '~/backend/repositories/test.repository'
// import fs from 'fs';
// import { obfuscate } from 'javascript-obfuscator';
// export const loader = async ({ request }: LoaderFunctionArgs) => {

//   // Đường dẫn tới file chứa mã nguồn JavaScript cho vào loader của app.tsx
//   const filePath = '/Users/macbook/data/code/facebook-pixel/extensions/theme-app-extension/assets/pixel.js';
//   const outputFilePath = '/Users/macbook/data/code/facebook-pixel/extensions/theme-app-extension/assets/embedded.js';

//   // Đọc nội dung của file
//   const codejs = fs.readFileSync(filePath, 'utf8');

//   // Thực hiện obfuscate với mã JavaScript được đọc từ file
//   const firstObfuscatedCode = obfuscate(codejs, {
//     compact: true,
//     controlFlowFlattening: true,
//     controlFlowFlatteningThreshold: 0.75,
//     stringArray: true,
//     stringArrayThreshold: 0.75,
//     identifierNamesGenerator: "hexadecimal",
//   });

//   const secondObfuscationResult = obfuscate(firstObfuscatedCode.getObfuscatedCode(), {
//     compact: true,
//     controlFlowFlattening: true,
//     controlFlowFlatteningThreshold: 0.75,
//     stringArray: true,
//     stringArrayThreshold: 0.75,
//     identifierNamesGenerator: 'hexadecimal',
//   });

//   fs.writeFileSync(outputFilePath, secondObfuscationResult.getObfuscatedCode(), 'utf8');
//   const procedureName = 'proc_create_test';
//   const res = await testTransaction();
//   // console.log(res)
//   return json({
//     res
//   });
// };

// const index = () => {
//   return (
//     <div>app.test</div>
//   )
// }

// export default index;