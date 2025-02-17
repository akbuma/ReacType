import React, { useReducer, useEffect } from 'react';
import '../public/styles/style.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AppContainer from '../containers/AppContainer';
import { stateContext } from '../context/context';
import initialState from '../context/initialState';
import reducer from '../reducers/componentReducer';
import localforage from 'localforage';
import { getProjects, saveProject } from '../helperFunctions/projectGetSaveDel';
import Cookies from 'js-cookie';

// Intermediary component to wrap main App component with higher order provider components
export const App = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // checks if user is signed in as guest or actual user and changes loggedIn boolean accordingly
  if (window.localStorage.getItem('ssid') !== 'guest') {
    state.isLoggedIn = true;
  } else {
    state.isLoggedIn = false;
  }

  // following useEffect runs on first mount
  useEffect(() => {
    // if user is a guest, see if a project exists in localforage and retrieve it
    if (state.isLoggedIn === false) {
      localforage.getItem('guestProject').then(project => {
        // if project exists, use dispatch to set initial state to that project
        if (project) {
          dispatch({
            type: 'SET INITIAL STATE',
            payload: project
          });
        }
      });
    } else {
      // otherwise if a user is logged in, use a fetch request to load user's projects from DB
      let userId;
      if (Cookies.get('ssid')) {
        userId = Cookies.get('ssid');
      } else {
        userId = window.localStorage.getItem('ssid');
      }
      //also load user's last project, which was saved in localforage on logout
      localforage.getItem(userId).then(project => {
        if (project) {
          dispatch({
            type: 'SET INITIAL STATE',
            payload: project
          });
        } else {
          console.log(
            'No user project found in localforage, setting initial state blank'
          );
        }
      });
    }
  }, []);

  useEffect(() => {
    let userId;
    if (Cookies.get('ssid')) {
      userId = Cookies.get('ssid');
    } else {
      userId = window.localStorage.getItem('ssid');
    }
    if (state.isLoggedIn === false) {
      localforage.setItem('guestProject', state);
    } else if (state.name !== '') {
      saveProject(state.name, state);
      localforage.setItem(userId, state);
    }
  }, [state]);

  return (
    <div className="app">
      <DndProvider backend={HTML5Backend}>
        <header
          style={{ height: '40px', width: '100%', backgroundColor: 'white' }}
        >
          ReacType
        </header>
        <stateContext.Provider value={[state, dispatch]}>
          <AppContainer />
        </stateContext.Provider>
      </DndProvider>
    </div>
  );
};

export default App;
