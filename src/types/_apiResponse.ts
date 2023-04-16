export enum ApiResponseCodes {
  SUCCESS = 'SUCCESS',
  INVALID_REQUEST = 'INVALID_REQUEST',
  WALLET_NOT_PROVIDED = 'WALLET_ADDRESS_NOT_PROVIDED',
  INVALID_WALLET = 'INVALID_WALLET',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  CLAIMED_RECENTLY = 'CLAIMED_RECENTLY',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  DB_ERROR = 'DB_ERROR',
}

export interface BaseApiResponse {
  code: ApiResponseCodes;
  message?: any;
  data?: any;
  [key: string]: any;
}

export interface ApiSuccess extends BaseApiResponse {
  code: ApiResponseCodes.SUCCESS;
}

export interface ApiError extends BaseApiResponse {
  code: Exclude<ApiResponseCodes, ApiResponseCodes.SUCCESS>;
}