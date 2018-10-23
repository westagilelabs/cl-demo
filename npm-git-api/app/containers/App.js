// @flow
import * as React from 'react';
import * as ReactDOM from "react-dom";
import { Theme as UWPThemeProvider, getTheme } from "react-uwp/Theme";

type Props = {
  children: React.Node
};

export default class App extends React.Component<Props> {
  props: Props;

  render() {
    const { children } = this.props;
    return (
       <UWPThemeProvider
        theme={getTheme({
          themeName: "dark", // set custom theme
          accent: "#0076d6", // set accent color
          useFluentDesign: true // sure you want use new fluent design.
                  })}
      >
    <React.Fragment>{children}</React.Fragment>
          </UWPThemeProvider>
    );
  }
}
