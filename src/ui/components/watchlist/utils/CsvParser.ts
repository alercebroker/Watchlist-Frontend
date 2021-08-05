import { parse } from "papaparse";

export class CsvTargetParser {
  parseCsvToList(csvFile: File, handleError: CallableFunction): unknown[] {
    const result = parse(csvFile, { header: true });
    if (result.errors.length) {
      handleError(result.errors);
      return [];
    }
    return result.data;
  }
}
