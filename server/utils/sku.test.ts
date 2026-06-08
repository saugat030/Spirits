import { generateSKU } from "./sku"; 

// suite
describe("generateSKU Utility Function", () => {
  
  // test 1: standard behaviour
  it("should generate a properly formatted SKU with normal inputs", () => {
    const productName = "Jack Daniels";
    const size = "750ml";

    const result = generateSKU(productName, size);
    expect(result.startsWith("SKU-")).toBe(true);
    expect(result).toContain("-JACKDA-");
    expect(result).toContain("-750ML-");
  });

  // second test : edge cases like alphanumric stripness
  it("should strip out non-alphanumeric characters", () => {
    const productName = "Special @#Wine!";
    const size = "1 Liter";

    const result = generateSKU(productName, size);

    expect(result).toContain("-SPECIA-");
    expect(result).toContain("-1LITER-");
  });

  // test 3: dealing with the random UUID
  it("should always return a string with exactly 4 sections separated by hyphens", () => {
    const result = generateSKU("Beer", "Pint");
    
    const parts = result.split("-");
    expect(parts.length).toBe(4);
    
    const uuidSuffix = parts[3];
    expect(uuidSuffix?.length).toBe(6);
  });

});