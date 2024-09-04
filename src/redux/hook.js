import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";

export const useAppDispatch = () => useReduxDispatch();
export const useAppSelector = useReduxSelector;
