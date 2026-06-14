export type GoveeControlRequest = {
  requestId: string;
  payload: {
    sku: string;
    device: string;
    capability: {
      type: string;
      instance: string;
      value?: string | number;
    };
  };
};