"use client"
import {Provider} from "react-redux"
import store from "../redux/store";
import Navbar from "@components/components/Navbar";
import Footer from "@components/components/Footer";
import "../styles/globals.css"

export default function RootLayout({children}){
  return (
    <html lang="en" suppressHydrationWarning="false">
      <body>
        <Provider store={store}>
          <Navbar/>
          {children}
          <Footer/>
        </Provider>
      </body>
    </html>
  );
}