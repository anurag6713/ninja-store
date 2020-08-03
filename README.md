# Ninja Store
Create reusable state for your react components.

`npm i ninja-store -S`

**Step 1: Import the createStore function**
```js
import {createStore} from 'ninja-store';
```

**Step 2: Create a store with unique name**
```js
const INITIAL_STATE = {};
const {useStore} = createStore('storeName', INITIAL_STATE);
// or 
const {useStore} = createStore('storeName', reducer, INITIAL_STATE);
```

**Step 3: Use the store and export it with state management functions**
```js
// Refer to the examples below for more
function useComponent = function() {
    const [state, setState] = useStore();
    // or 
    const [state, dispatch] = useStore();

    return {
      state,
      // followed by methods managing the state
    };
}
```

**Step 4: Import `useComponent()` in your components and start performing actions**
```
function someOtherComponent() {
    const {state, actionFunction} = useComponent();
}
```


## Example using State
```js
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {createStore} from 'ninja-store';

const INITIAL_STATE = {
    count: 0
};

const {useStore} = createStore('counter', INITIAL_STATE);

function useCounter() {
    const [state, setState] = useStore();
    const increment = React.useCallback(() => {
        setState((state) => ({
            ...state,
            count: state.count + 1
        }));
    }, []);
    const decrement = React.useCallback(() => {
        setState((state) => ({
            ...state,
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


## Example using a Reducer
```js
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {createStore} from 'ninja-store';

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

## Use mapState function to listen to only subset of store data
```js

const INITIAL_STATE = {
    teachers: [],
    students: []
};

const {useStore} = createStore('users', INITIAL_STATE);

// Pass the mapState function to useStore function.
// This will be passed by the components which needs to listen only to the specific keys instead of the whole object
function useUsers(mapState) {
    const [state, setState] = useStore(mapState);
    return {
        state,
        // followed by other state management functions
    };
}

// This component will re-render only when there is a change in `teachers` array
function Teachers() {
    const [state, getTeachers] = useUsers((state) => ({ 
        teachers: state.teachers
    });
    //....
}

// This component will re-render only when there is a change in `students` array
function Students() {
    const [state, getStudents] = useUsers((state) => ({ 
        students: state.students
    });
    //....
}

```



