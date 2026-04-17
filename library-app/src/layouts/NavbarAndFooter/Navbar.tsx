import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../Auth/authContext";

export const Navbar = () => {
  const { isAuthenticated, logout, userRole } = useAuth();

  const isAdmin = userRole === 'ADMIN';

  return (
    <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
      <div className='container-fluid'>
        <span className='navbar-brand'>Luv 2 Read</span>

        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNavDropdown'
        >
          <span className='navbar-toggler-icon'></span>
        </button>

        <div className='collapse navbar-collapse' id='navbarNavDropdown'>
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <NavLink className='nav-link' to='/home'>Home</NavLink>
            </li>

            <li className='nav-item'>
              <NavLink className='nav-link' to='/search'>Search Books</NavLink>
            </li>

            {isAuthenticated && (
              <li className='nav-item'>
                <NavLink className='nav-link' to='/shelf'>Shelf</NavLink>
              </li>
            )}

            {isAuthenticated && (
              <li className='nav-item'>
                <NavLink className='nav-link' to='/fees'>Pay fees</NavLink>
              </li>
            )}

            {isAuthenticated && isAdmin && (
              <li className='nav-item'>
                <NavLink className='nav-link' to='/admin'>Admin</NavLink>
              </li>
            )}
          </ul>

          <ul className='navbar-nav ms-auto'>
            {!isAuthenticated ? (
              <>
                <li className='nav-item m-1'>
                  <Link className='btn btn-outline-light me-2' to='/login'>
                    Sign in
                  </Link>
                </li>
                <li className='nav-item m-1'>
                  <Link className='btn btn-success' to='/register'>
                    Sign up
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <button
                  className='btn btn-outline-light'
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
