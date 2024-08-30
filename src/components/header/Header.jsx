import React, { useState, useEffect } from "react";
import { baseUrl } from '../../api/http-client';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { removeUser } from '../../redux/slices/userSlice';
import { removeToken } from '../../redux/slices/tokenSlice';
import endpoints from "../../shared/router/endpoints";
import { removeIntro, setIntro } from "../../redux/slices/isSkipedIntro";

import "./header.css";

const Header = () => {
    const [isMainListMenuOpen, setMainListMenuOpen] = useState(false);
    const currentUser = useSelector(state => state.userReducer.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const setIsSkiped = () => {
        dispatch(setIntro({
          intro: false
        }));
      }

    const mainListMenu = () => document.querySelector("#main-list-menu");

    const onHandleClick = (event) => {
        if (!isMainListMenuOpen) {
            setMainListMenuOpen(true);
        } else {
            setMainListMenuOpen(false);
        }
        event.stopPropagation();
        const target = event.target;

        if (mainListMenu() && (target.id === "main-menu-button" || target.id === "main-menu-span")) {

            if (mainListMenu().classList.contains("d-block")) {
                mainListMenu().classList.remove("d-block");
                mainListMenu().classList.add("visually-hidden");
            } else {
                mainListMenu().classList.remove("visually-hidden");
                mainListMenu().classList.add("d-block");
            }
        }
    }

    const handleLogout = async() => {
        try {
            const response = await baseUrl.post('/api/auth/logout');
            console.log(response.data);
            dispatch(removeUser());
            dispatch(removeToken());
            dispatch(removeIntro());

        } catch (error) {
            console.error('There was an error logouting:', error);
        }
    }

    const handleClickLogin = async () => {
        navigate(`/${endpoints.LOGIN}`);
    }

    useEffect(() => {
        const handleGlobalClick = (event) => {
            setMainListMenuOpen(false);
            event.stopPropagation();
            const target = event.target;
            if (mainListMenu() && (target.id !== "main-menu-button" && target.id !== "main-menu-span")) {
                mainListMenu().classList.remove("d-block");
                mainListMenu().classList.add("visually-hidden");
            }
        };

        document.addEventListener("click", handleGlobalClick);

        return () => {
            document.removeEventListener("click", handleGlobalClick);
        };

    }, []);

    return (
        <header 
            id="header" 
            className="w-100 position-fixed top-0 z-3 navbar navbar-expand-lg justify-content-center transition" 
            style={{ background: "#f29b4e", padding:"1px 0px" }}
        >
            <section className="container-fluid d-flex justify-content-between align-items-center" style={{ maxWidth: "100vw" }}>
                <div className="d-flex justify-content-between align-items-center">
                    <img src={`${process.env.PUBLIC_URL}/images/Logo.png`} width="60px" alt="Logo" />
                    <h2 style={{ color: "#027dbf", marginTop: "9px" }}>TOURS TO THE FUTURE</h2>
                </div>
                <div className='d-flex main-block'>
                    <div id="main-menu-block" onClick={onHandleClick} className="position-relative">
                        <button  id="main-menu-button" className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span id="main-menu-span" className="navbar-toggler-icon"></span>
                        </button>
                        <ul id="main-list-menu" className={`${isMainListMenuOpen ? "d-block" : "visually-hidden"} p-0 position-absolute mt-2 top-100 border border-0 shadow-sm ${location.pathname !== "/" + endpoints.TRANSPORTS ? "header-ul" : "header-ul-transport"} `} style={{ background: "#f5f4f0" }}>
                            {                                  
                                location.pathname !== "/" ?
                                    <li
                                        className="dropdown-item li-item-menu header-li">
                                        <Link to={`${endpoints.HOME}`} className="nav-link" aria-current="page">Tours</Link>
                                    </li> : null
                            }
                            {                                  
                                location.pathname !== "/" + endpoints.ROBOTS ?
                                    <li
                                        className="dropdown-item li-item-menu header-li">
                                        <Link to={`${endpoints.ROBOTS}`} className="nav-link" aria-current="page">Robots</Link>
                                    </li> : null
                            }
                            {                                  
                                location.pathname !== "/" + endpoints.TRANSPORTS ?
                                    <li
                                        className="dropdown-item li-item-menu header-li">
                                        <Link to={`${endpoints.TRANSPORTS}`} className="nav-link" aria-current="page">Transports</Link>
                                    </li> : null
                            }
                            {                                  
                                location.pathname !== "/" + endpoints.ABOUT ?
                                    <li
                                        className="dropdown-item li-item-menu header-li">
                                        <Link to={`${endpoints.ABOUT}`} className="nav-link" aria-current="page">About</Link>
                                    </li> : null
                            }
                        </ul>
                    </div>
                    <nav className="collapse navbar-collapse" id="navbarNav" style={{ marginRight: "280px" }}>
                        <ul className="navbar-nav">
                            {
                                location.pathname !== "/" ?
                                    <li className="nav-item" style={{ marginRight: "40px" }}>
                                        <Link to={`${endpoints.HOME}`} className="nav-link" aria-current="page">Tours</Link>
                                    </li> : null
                            }
                            {
                                location.pathname !== "/" + endpoints.ROBOTS ?
                                    <li className="nav-item"  style={{ marginRight: "40px" }}>
                                        <Link to={`${endpoints.ROBOTS}`} className="nav-link" aria-current="page">Robots</Link>
                                    </li> : null
                            }
                            {
                                location.pathname !== "/" + endpoints.TRANSPORTS ?
                                    <li className="nav-item" style={{ marginRight: "40px" }}>
                                        <Link to={`${endpoints.TRANSPORTS}`} className="nav-link" aria-current="page">Transports</Link>
                                    </li> : null
                            }
                            {
                                location.pathname !== "/" + endpoints.ABOUT ?
                                    <li className="nav-item" style={{ marginRight: "40px" }}>
                                        <Link onClick={setIsSkiped} className="nav-link" aria-current="page">About</Link>
                                    </li> : null
                            }
                        </ul>
                    </nav>
                </div>                
                <div>
                {
                    currentUser.id ? <button onClick={handleLogout} className="btn btn-sm" style={{ marginRight: "10px", color: "black", backgroundColor: "#34c6eb", borderColor: "#34c6eb", borderRadius: "7px" }}>
                    Logout
                </button> : <button 
                    onClick={handleClickLogin}
                    type="button"
                    className="btn btn-sm"
                    style={{ marginRight: "14px", color: "white", backgroundColor: "#34c6eb", borderColor: "#34c6eb", borderRadius: "7px" }}
                    >Login
                </button>
                }
                
            </div>
            </section>
        </header>
    )
}

export default Header;