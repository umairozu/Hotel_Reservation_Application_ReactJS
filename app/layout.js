import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import NavigationBar from '../components/NavigationBar';

export const metadata = {
  title: 'Hotel Reservation',
  description: 'Hotel Reservation Application'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavigationBar />
        <main className="main-shell">{children}</main>
      </body>
    </html>
  );
}


