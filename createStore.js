import React from 'react';

import stores from './stores';

function createStore(name, reducer, initialState = {}, timeoutDuration) {
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

            // Add current hook into the listeners
            const key = React.useRef(null);
            if (key.current === null) {
                key.current = Math.random();
                store.listeners.push({key: key.current, updateState});
            }

            React.useEffect(() => {
                return () => {
                    store.listeners = store.listeners.filter((item) => item.key !== key.current);
                };
            }, []);

            const dispatch = React.useCallback((action) => {
                const newState = isReducerMode ? reducer(store.state, action) : (
                    typeof action === 'function' ? action(store.state) : action
                );
                const oldState = store.state;
                store.state = newState;
                timeoutDuration && timeout && clearTimeout(timeout);
                timeoutDuration && (
                    timeout = setTimeout(() => {
                        update(newState, oldState);
                    }, timeoutDuration)
                ) || update(newState, oldState);
            }, []);

            const update = React.useCallback((newState, oldState) => {
                store.listeners.forEach(({updateState}) => {
                    updateState(newState, oldState);
                });
            }, []);

            const getState = React.useCallback(() => {
                return store.state;
            }, []);
        
            return [state, dispatch, getState];
        }
    };
}

export default createStore;