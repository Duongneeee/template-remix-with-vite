import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { Button } from "@shopify/polaris";
import { ExportIcon } from "@shopify/polaris-icons";

interface ExportCSVProps {
  csvData: any[];
  fileName: string;
}

export const ExportCSV: React.FC<ExportCSVProps> = ({ csvData, fileName }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (csvData: any[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <Button icon={ExportIcon} size="large" onClick={() => exportToCSV(csvData, fileName)}>
      Export data
    </Button>
  );
};
