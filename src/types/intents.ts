export type IntentDataState = "loading" | "ready" | "fallback" | "empty" | "error";

export type PaymentStatus = "signed" | "delivered" | "settled";

export type SupportedChain = {
  id: number;
  name: string;
  key: string;
  logoUrl?: string;
};

export type SupportedRoute = {
  fromChainId: number;
  toChainId: number;
  fromToken: string;
  toToken: string;
};

export type Split = {
  title: string;
  courtFee: number;
  shuttleFee: number;
  participants: number;
  receiverChain: SupportedChain;
  receiverAsset: string;
};

export type Participant = {
  id: string;
  name: string;
  sourceChain: SupportedChain;
  amount: number;
  status: PaymentStatus;
};

export type IntentPreview = {
  sourceChain: SupportedChain;
  destinationChain: SupportedChain;
  sourceAsset: string;
  destinationAsset: string;
  amount: number;
  routeAvailable: boolean;
  dataState: IntentDataState;
  solverNote: string;
};

