interface IGenericObject {
    [key: string]: any;
}

type IReducerFn = (
    state: IGenericObject,
    action: {
        type: string;
        payload: any[] | IGenericObject;
        [key: string]: any
    }
) => IGenericObject;

type IReducer = IGenericObject | IReducerFn;

declare module 'ninja-store' {

    export function createStore(
        name: string,
        reducer: IReducer,
        initialState?: IGenericObject,
        timeoutDuration?: number
    ): {
        useStore<T>(
            mapFn?: (state: T) => IGenericObject
        ): [
            state: T,
            setState?: (
                action?: string | 
                ((state: T) => T) | 
                T
            ) => void,
            getState ?: () => T
        ]
    }

    export const stores: IGenericObject;

}
