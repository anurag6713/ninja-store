import React from 'react';

const stores = {};

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
        useStore: () => {

            const [state, setState] = React.useState(store.state);

            React.useEffect(() => {
                const key = Math.random();
                store.listeners.push({key, setState});
                return () => {
                    store.listeners = store.listeners.filter((item) => item.key !== key);
                };
            }, []);

            const dispatch = React.useCallback((action) => {
                const newState = isReducerMode ? reducer(store.state, action) : (
                    typeof action === 'function' ? action(store.state) : action
                );
                store.state = newState;
                timeout && clearTimeout(timeout);
                timeout = setTimeout(() => {
                    store.listeners.forEach(({setState}) => {
                        setState(() => newState);
                    });
                });
            }, []);
        
            return [state, dispatch]
        }
    };
}

export default createStore;