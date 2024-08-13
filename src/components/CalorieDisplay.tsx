type CalorieDisplayProps = {
    calories: number
    text: string
}

//Para no repetir codigo y estilos inecessarios se crea este componente
export default function CalorieDisplay({calories, text}:CalorieDisplayProps) {
    return (

        <p className="text-white font-bold rounded-full grid grid-cols-1 gap-3 text-center">
            <span className="font-black text-6xl text-orange">{calories} </span>
            {text}
        </p>

    )
}
