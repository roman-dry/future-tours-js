import React, { Fragment, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Header from "../header/Header";

import endpoints from "../../shared/router/endpoints";

const Layout = () => {
    const location = useLocation();
    const isHeader = !(location.pathname === `/${endpoints.REGISTRATION}` || location.pathname === `/${endpoints.LOGIN}`);

    // Змінюємо фон сторінки залежно від поточного маршруту
    useEffect(() => {
        switch (location.pathname) {
            case `${endpoints.HOME}`:
                document.body.style.backgroundColor = "#f29b4e"; // Помаранчевий фон для домашньої сторінки
                break;
            // case `/${endpoints.REGISTRATION}`:
            //     document.body.style.backgroundColor = "#00BFFF"; // Блакитний фон для сторінки реєстрації
            //     break;
            // case `/${endpoints.LOGIN}`:
            //     document.body.style.backgroundColor = "#32CD32"; // Зелений фон для сторінки входу
            //     break;
            // // Додайте інші випадки для інших сторінок
            // default:
            //     document.body.style.backgroundColor = "#FFFFFF"; // Білий фон за замовчуванням
            //     break;
        }

        // Очищуємо стилі при демонтажі компонента
        return () => {
            document.body.style.backgroundColor = "";
        };
    }, [location.pathname]);

    return (
        <Fragment >
            {isHeader ?
                <Header />
                : null}
            <div className="w-100 d-flex flex-grow-1 ">
                <main className="mx-auto min-vh-100 d-flex container-fluid">
                    <Outlet />
                </main>
            </div>
        </Fragment >
    );
};

export default Layout;