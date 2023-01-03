import React, { FC } from "react";
import Layout from "../components/Layout";
import { store } from "../redux/store";
import { Provider } from "react-redux";

interface IProps {
  Component: FC;
  pageProps: any;
}

const App = ({ Component, pageProps }: IProps) => {
  return (
      <Provider store={store}>
        <Layout title="Home | Next.js + TypeScript Example">
          <Component {...pageProps} />
        </Layout>
     </Provider>
  );
};

export default App;
