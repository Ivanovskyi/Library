import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';
import { HomePage } from './layouts/HomePage/HomePage';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';
import { ShelfPage } from './layouts/ShelfPage/ShelfPage';
import { MessagesPage } from './layouts/MessagesPage/MessagesPage';
import { ManageLibraryPage } from './layouts/ManageLibraryPage/ManageLibraryPage';
import { ReviewListPage } from './layouts/BookCheckoutPage/ReviewListPage/ReviewListPage';
import { PaymentPage } from './layouts/PaymentPage/PaymentPage';
import { LoginForm } from './Auth/LoginForm'; 
import { RegisterForm } from './Auth/RegisterForm';
import { useAuth } from './Auth/authContext';

export const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Navbar />
      <div className='flex-grow-1'>
        <Routes>
          
          <Route path='/' element={<Navigate to='/home' replace />} />
          
          <Route path='/home' element={<HomePage />} />
          <Route path='/search' element={<SearchBooksPage />} />
          <Route path='/reviewlist/:bookId' element={<ReviewListPage />} />
          <Route path='/checkout/:bookId' element={<BookCheckoutPage />} />
          
          
          <Route 
            path='/login' 
            element={!isAuthenticated ? <LoginForm /> : <Navigate to='/home' replace />} 
          />
          <Route 
            path='/register' 
            element={!isAuthenticated ? <RegisterForm /> : <Navigate to='/home' replace />} 
          />

          <Route 
            path='/shelf' 
            element={isAuthenticated ? <ShelfPage /> : <Navigate to='/login' replace />} 
          />
          <Route 
            path='/messages' 
            element={isAuthenticated ? <MessagesPage /> : <Navigate to='/login' replace />} 
          />
          <Route 
            path='/admin' 
            element={isAuthenticated ? <ManageLibraryPage /> : <Navigate to='/login' replace />} 
          />
          <Route 
            path='/fees' 
            element={isAuthenticated ? <PaymentPage /> : <Navigate to='/login' replace />} 
          />
          
          <Route path='*' element={<Navigate to='/home' replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
