import { createContext, Dispatch, ReactNode, useMemo, useReducer } from "react"
import { ActivityActions, activityReducer, ActivityState, initialState } from "../reducers/activity-reducer"
import { categories } from "../data/categories"
import { Activity } from "../types"

type ActivityProviderProps = {
    children: ReactNode
}

type ActivityContextProps = {
    state: ActivityState
    dispatch: Dispatch<ActivityActions>,
    caloriesConsumed: number,
    caloriesBurned: number,
    netCalories: number,
    categoryName: (category: Activity['category']) => string[],
    isEmptyActivities: boolean
}

export const ActivityContext = createContext<ActivityContextProps>(null!)

export const ActivityProvider = ({ children }: ActivityProviderProps) => {

    const [state, dispatch] = useReducer(activityReducer, initialState)

    // Contadores
    //el reduce es una función de JS que verifica una condicion
    const caloriesConsumed = useMemo(() => state.activities.reduce((total, activity) => activity.category === 1 ? total + activity.calories : total, 0), [state.activities])
    const caloriesBurned = useMemo(() => state.activities.reduce((total, activity) => activity.category === 2 ? total + activity.calories : total, 0), [state.activities])
    const netCalories = useMemo(() => caloriesConsumed - caloriesBurned, [state.activities])

    //Se activa cada que hay actividad en activities
    const categoryName = useMemo(() =>
        //Checa si el cat.id es igual a la categoria que esta recibiendo, si es asi, regresa cat.name
        (category: Activity['category']) =>
            //.map está iterando en el type de categorias
            categories.map(cat => cat.id === category ? cat.name : '')
        , [state.activities])

    //Escucha mediante activities cambia y funciona con el if condicional de más abajo
    const isEmptyActivities = useMemo(() => state.activities.length === 0, [state.activities])


    return (
        <ActivityContext.Provider value={{
            state,
            dispatch,
            caloriesConsumed,
            caloriesBurned,
            netCalories,
            categoryName,
            isEmptyActivities
        }}>
            {children}
        </ActivityContext.Provider>
    )
}