# sharedState
Create reusable state for your react components

`npm i react-shared-state -S`

## State Model
```js
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {createStore} from './utils';

const INITIAL_STATE = {
    count: 0
};

const {useStore} = createStore('counter', INITIAL_STATE);

function useCounter() {
    const [state, setState] = useStore();
    const increment = React.useCallback(() => {
        setState((state) => ({
            count: state.count + 1
        }));
    }, []);
    const decrement = React.useCallback(() => {
        setState((state) => ({
            count: state.count - 1
        }));
    }, []);
    return {
        state,
        increment,
        decrement
    };
}

function App() {
    return (
        <>
            <Counter />
            <Counter />
        </>
    );
}

function Counter() {
    const {state, increment, decrement} = useCounter();
    return (
        <View>
            <Text>Count: {state.count}</Text>
            <TouchableOpacity onPress={increment}>
                <Text>Increment</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={decrement}>
                <Text>Decrement</Text>
            </TouchableOpacity>
        </View>
    );
}

export default App;
```


## Reducer Model
```js
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {createStore} from './utils';

const INITIAL_STATE = {
    count: 0
};

function reducer(state, action) {
    switch(action.type) {
        case 'increment': {
            return {
                ...state,
                count: state.count + 1
            };
        }
        case 'decrement': {
            return {
                ...state,
                count: state.count - 1
            }
        }
        default: {
            return state;
        }
    }
}

const {useStore} = createStore('counter', reducer, INITIAL_STATE);

function useCounter() {
    const [state, dispatch] = useStore();
    return {
        state,
        dispatch
    };
}

function App() {
    return (
        <>
            <Counter />
            <Counter />
        </>
    );
}

function Counter() {
    const {state, dispatch} = useCounter();
    const increment = React.useCallback(() => {
        dispatch({ type: 'increment' });
    }, []);
    const decrement = React.useCallback(() => {
        dispatch({ type: 'decrement' });
    }, []);
    return (
        <View>
            <Text>Count: {state.count}</Text>
            <TouchableOpacity onPress={increment}>
                <Text>Increment</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={decrement}>
                <Text>Decrement</Text>
            </TouchableOpacity>
        </View>
    );
}

export default App;
```