import { IResponseHandlerParams } from '../interface/reponse-handler.interface';
import { IResponseHandlerData } from '../interface/reponse-handler.interface';

export const ResponseHandlerService = (params: IResponseHandlerParams) => {
  const res: IResponseHandlerData = {
    timeRequested: new Date().toISOString(),
    callId: Date.now(),
    ...params,
  };

  return res;
};
