// import Navbar from "@/layout/Navbar";
// import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Home from "./page";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main> {/* Your page content loads here */}
        {/* <Footer /> */}
      </body>
    </html>
  );
}