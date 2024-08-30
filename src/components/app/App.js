import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Ticket from '../ticket/Ticket';
import endpoints from '../../shared/router/endpoints';
import Registration from '../registration/Registration';
import Login from '../login/Login';
import { checkTokenExpiration } from '../../utils/checkTokenExpiration';
import { useSelector } from 'react-redux';
import Layout from '../layout/Layout';
import Home from '../home/Home';
import Cart from '../cart/Cart';
import Robots from '../robots/Robots';
import Transports from '../transports/Transports';
import About from '../about/About';

export const App = () =>  {
  const user = useSelector(state => state.userReducer.user);
  const token = useSelector(state => state.tokenReducer.item);
  console.log(user);
  console.log(token);

  useEffect(() => {
    // Запуск інтервалу перевірки токену
    const interval = setInterval(checkTokenExpiration, 60000); // перевірка кожну хвилину

    return () => clearInterval(interval); // очищення інтервалу при демонтажі компонента
  }, []);

  return (
    
      <Routes>
        <Route path={endpoints.HOME} element={<Layout />}>
        <Route exact path={endpoints.HOME} element={<Home />} /> 
          <Route exact path={endpoints.REGISTRATION} element={<Registration />} />
          <Route exact path={endpoints.LOGIN} element={<Login />} />
          <Route exact path={endpoints.TICKET} element={<Ticket />} />               
          <Route exact path={endpoints.CART} element={<Cart />} />  
          <Route exact path={endpoints.ROBOTS} element={<Robots />} />  
          <Route exact path={endpoints.TRANSPORTS} element={<Transports />} />  
          <Route exact path={endpoints.ABOUT} element={<About />} />
        </Route>          
      </Routes>    
  );
}
