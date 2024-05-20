import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./styles/index.css";
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';

import App from "./App";
import Provider from "./store";

const theme = createTheme({
  palette: {
    secondary: {
      main: '#b9e6ff'
    }
  }
});

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Provider>
        <MuiThemeProvider theme={theme}>
          <App /> 
        </MuiThemeProvider>
      </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
