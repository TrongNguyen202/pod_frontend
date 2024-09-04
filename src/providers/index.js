import { Provider } from "react-redux";
import { store } from "src/redux/store";

const ProviderCustom = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ProviderCustom;
