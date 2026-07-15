import { errorResponse, successResponse } from "../../utils/apiResponse";

describe("apiResponse", () => {
  it("successResponse envuelve la data con success=true y error=null", () => {
    const result = successResponse({ id: 1 });
    expect(result).toEqual({ success: true, data: { id: 1 }, error: null });
  });

  it("errorResponse envuelve code y message con success=false y data=null", () => {
    const result = errorResponse("NOT_FOUND", "no existe");
    expect(result).toEqual({
      success: false,
      data: null,
      error: { code: "NOT_FOUND", message: "no existe" },
    });
  });
});
