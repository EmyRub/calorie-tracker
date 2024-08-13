import { useState, ChangeEvent, FormEvent, Dispatch, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid';
import { categories } from "../data/categories"
import { Activity } from "../types"
import { ActivityActions, ActivityState } from '../reducers/activity-reducer';

//Se importa el type del state de ActiviteState de activity-reducer
type FormProps = {
    dispatch: Dispatch<ActivityActions>,
    state: ActivityState
}

const initialState = {
    id: uuidv4(),
    category: 1,
    name: '',
    calories: 0
}

export default function Form({ dispatch, state }: FormProps) {

    const [activity, setActivity] = useState<Activity>(initialState)

    useEffect(() => {
        if (state.activeId) {
            //Trae la misma actividad que tenga el mismo id que el que presionó el mismo botón
            //stateActivity es del que viene del activity-reducer
            const selectedActivity = state.activities.filter(stateActivity => stateActivity.id === state.activeId)[0]
            setActivity(selectedActivity)
        }
    }, [state.activeId])

    //Se pone ...activity para mantener la copia del objeto
    const handleChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {

        const isNumberField = ['category', 'calories'].includes(e.target.id)

        // El (+) lo convierte a número
        setActivity({
            ...activity,
            [e.target.id]: isNumberField ? +e.target.value : e.target.value
        })
    }

    const isValidActivity = () => {
        const { name, calories } = activity
        return name.trim() !== '' && calories > 0
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch({ type: 'save-activity', payload: { newActivity: activity } })
        setActivity({
            ...initialState,
            id: uuidv4()
        })
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5 bg-white shadow p-10 rounded-lg">
            <div className="grid grid-cols-1 gap-3">

                <label htmlFor="category" className="font-bold">Categoria:</label>

                <select
                    value={activity.category}
                    id="category"
                    onChange={handleChange}
                    className="border border-salte-300 p-2 rounded-lg w-full bg-white">
                    {categories.map(category => (
                        <option
                            key={category.id}
                            value={category.id}
                        >{category.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="name" className="font-bold">Actividad:</label>
                <input
                    value={activity.name}
                    type="text"
                    id="name"
                    onChange={handleChange}
                    className="border border-slate-300 p-2 rounded-lg"
                    placeholder="Ej. Comida, Jugo de Naranja, Ensalada, Ejercicio, Pesas, Bicicleta"
                />
            </div>

            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="calories" className="font-bold">Calorias:</label>
                <input
                    type="number"
                    id="calories"
                    onChange={handleChange}
                    value={activity.calories}
                    className="border border-slate-300 p-2 rounded-lg"
                    placeholder="Calorias. ej. 300 0 500"
                />
            </div>

            <input
                type="submit"
                disabled={!isValidActivity()}
                value={activity.category === 1 ? 'Guardar Comida' : 'Guardar Ejercicio'}
                className="bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-10" />

        </form>
    )
}
