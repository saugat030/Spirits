export const generateSKU = (productName: string, size: string): string => {
    const sanitizedName = productName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 6);

    const sanitizedSize = size
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 6);

    const uuidSuffix = crypto.randomUUID().replace(/-/g, "").slice(-6).toUpperCase();

    return `SKU-${sanitizedName}-${sanitizedSize}-${uuidSuffix}`;
};
