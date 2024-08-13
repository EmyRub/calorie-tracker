import { Activity } from "../types"

//paidload.- Los datos
//Las acciones del reduce
export type ActivityActions =
    { type: 'save-activity', payload: { newActivity: Activity } } |
    { type: 'set-activeId', payload: { id: Activity['id'] } } |
    { type: 'delete-activity', payload: { id: Activity['id'] } } |
    { type: 'restart-app' }

export type ActivityState = {
    activities: Activity[],
    activeId: Activity['id']
}

//revisa si antes no hay nada en el local storage, parse lo regresa como arreglo, caso contrario arreglo vacio
const localStorageActivities = (): Activity[] => {
    const activities = localStorage.getItem('activities')
    return activities ? JSON.parse(activities) : []
}

//El estado inicial del reduce, 
export const initialState: ActivityState = {
    activities: localStorageActivities(),
    activeId: ''
}

//Reducer que conecta stateInicial & Actions y es el que se invoca en App como reducer 
export const activityReducer = (
    state: ActivityState = initialState,
    action: ActivityActions

) => {

    if (action.type === 'save-activity') {
        //Este código maneja la lógica para actualizar el state

        //Inicia como arreglo vacío
        let updatedActivities: Activity[] = []

        //Si tiene Id es que se esta editando
        if (state.activeId) {
            updatedActivities = state.activities.map(activity => activity.id === state.activeId ? action.payload.newActivity : activity)
        } else {
            updatedActivities = [...state.activities, action.payload.newActivity]
        }

        return {
            //Cada que hay una nueva actividad se va a reiniciar
            ...state,
            activities: updatedActivities,
            activeId: ''
        }
    }

    if (action.type === 'set-activeId') {
        return {
            ...state,
            activeId: action.payload.id
        }
    }

    if (action.type === 'delete-activity') {
        return {
            //Se trae un arreglo de los que sean diferentes a ese id
            ...state,
            activities: state.activities.filter(activity => activity.id !== action.payload.id)
        }
    }

    if (action.type === 'restart-app') {
        return {
            activities: [],
            activeId: ''
        }
    }

    return state
}