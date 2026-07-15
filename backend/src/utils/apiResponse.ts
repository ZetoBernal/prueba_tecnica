export interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
  error: null;
}

export interface ApiErrorEnvelope {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
  };
}

export const successResponse = <T>(data: T): ApiSuccessEnvelope<T> => ({
  success: true,
  data,
  error: null,
});

export const errorResponse = (code: string, message: string): ApiErrorEnvelope => ({
  success: false,
  data: null,
  error: { code, message },
});
