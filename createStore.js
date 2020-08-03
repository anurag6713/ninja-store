import React from 'react';

import stores from './stores';

function createStore(name, reducer, initialState = {}) {
    const isReducerMode = typeof reducer === 'function';
    stores[name] = {
        state: isReducerMode ? initialState : reducer,
        listeners: [],
        isReducerMode
    };
    const store = stores[name];
    let timeout;
    return {
        useStore: (mapStateFn) => {

            const [state, setState] = React.useState(typeof mapStateFn === 'function' ? mapStateFn(store.state) : store.state);

            const updateState = React.useCallback((newState) => {
                setState((state) => {
                    if(typeof mapStateFn === 'function') {
                        const newMappedState = mapStateFn(newState);
                        if(state && newMappedState && typeof state === 'object' && typeof newMappedState === 'object') {
                            const isStateArray = Array.isArray(state);
                            const isMappedStateArray = Array.isArray(newMappedState);
                            if(isStateArray && isMappedStateArray) {
                                let shouldUpdate = false;
                                if(state.length !== newMappedState.length) {
                                    shouldUpdate = true;
                                } else {
                                    for(let i = 0; i < newMappedState.length; i++) {
                                        if(newMappedState[i] !== state[i]) {
                                            shouldUpdate = true;
                                            break;
                                        }
                                    }
                                }
                                return shouldUpdate ? newMappedState : state;
                            } else if(!isStateArray && !isMappedStateArray) {
                                let shouldUpdate = false;
                                for(let i in newMappedState) {
                                    if(newMappedState[i] !== state[i]) {
                                        shouldUpdate = true;
                                        break;
                                    }
                                }
                                return shouldUpdate ? newMappedState : state;
                            }
                        }
                    }
                    return newState;
                });
            }, []);

            React.useEffect(() => {
                const key = Math.random();
                store.listeners.push({key, updateState});
                return () => {
                    store.listeners = store.listeners.filter((item) => item.key !== key);
                };
            }, []);

            const dispatch = React.useCallback((action) => {
                const newState = isReducerMode ? reducer(store.state, action) : (
                    typeof action === 'function' ? action(store.state) : action
                );
                const oldState = store.state;
                store.state = newState;
                timeout && clearTimeout(timeout);
                timeout = setTimeout(() => {
                    store.listeners.forEach(({updateState}) => {
                        updateState(newState, oldState);
                    });
                });
            }, []);
        
            return [state, dispatch]
        }
    };
}

export default createStore;