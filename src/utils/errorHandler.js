import createHttpError from "http-errors";

export class BillTestErrorHandler {
  static handleInventoryError(error) {
    if (error.message.includes("Insufficient inventory")) {
      return createHttpError(400, `Inventory Error: ${error.message}`);
    }
    if (error.message.includes("No store tag found")) {
      return createHttpError(500, `Configuration Error: ${error.message}`);
    }
    if (error.message.includes("Test ID is missing")) {
      return createHttpError(400, `Data Error: ${error.message}`);
    }
    return error;
  }

  static validateBillTestUpdate(previousBillTest, requestBody) {
    const errors = [];

    if (requestBody.template && typeof requestBody.template !== "string") {
      errors.push("Template must be a string");
    }

    if (
      requestBody.isTestSample !== undefined &&
      typeof requestBody.isTestSample !== "boolean"
    ) {
      errors.push("isTestSample must be a boolean");
    }

    if (errors.length > 0) {
      throw createHttpError(400, `Validation Error: ${errors.join(", ")}`);
    }
  }

  static logError(operation, error, context = {}) {
    console.error(`[BillTest ${operation}] Error:`, {
      error: error.message,
      stack: error.stack,
      context,
    });
  }
}
