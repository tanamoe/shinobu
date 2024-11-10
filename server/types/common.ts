export interface CommonResponse<DataT, ErrorT> {
  success: boolean;
  error?: ErrorT | object;
  data?: DataT;
}
