import MedusaCsvParserService from "@medusajs/medusa/dist/services/csv-parser";
class CsvParser extends MedusaCsvParserService {
  protected override readonly $$delimiter: string = ",";
}

export default CsvParser;
