import { useContract } from "./useContract";
import KamilTouchAbi from "../contracts/KamilTouch.json";
import contractAddress from "../contracts/KamilTouch-address.json";

export const useMinterContract = () =>
  useContract(KamilTouchAbi.abi, contractAddress.KamilTouch);
  