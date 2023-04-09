import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getAllAsync, leaveAsync, selectInitialized, selectParkingSpaces, takeAsync } from '../features/parking/parkingSlice';
import './Parking.css';

function Parking() {

    //On récupère la liste des places de parking dans redux
    const parkingSpaces = useAppSelector(selectParkingSpaces);

    //On récupère l'état d'initialisation dans redux
    const initialized = useAppSelector(selectInitialized);

    //On récupère le dispatch
    const dispatch = useAppDispatch();

    //Si le state n'est pas initialisé
    if(!initialized) {
        //On récupère la liste des places de parking via l'API
        dispatch(getAllAsync());
    }

    //On construit les lignes composées de 5 places de parking
    //Chaque ligne est composée de deux couloirs et de 5 places de parking
    //Chaque ligne est séparée par un couloir

    let rows = [];
    let columns = [];
    for(let index = 0; index < parkingSpaces.length; index++) {
        const parkingSpace = parkingSpaces[index];

        //Si la place de parking est la dernière de la ligne
        if(parkingSpace.id % 5 === 0) {
            //On ajoute la place de parking à la ligne
            columns.push(<td key={parkingSpace.id} className={parkingSpace.free ? '' : 'taken'}>{parkingSpace.id}</td>);
            
            //On ajoute le deuxième couloir à la ligne
            columns.push(<td key={`${rows.length}_last`} className='entry'></td>);

            //On ajoute la ligne
            rows.push(<tr key={rows.length} className={getRowClassName(rows.length)}>{columns}</tr>);
            
            //On réinitialise les colonnes
            columns = [];

            //Si on vient d'ajouter une ligne avec des places de parking dirigées vers le haut,
            //on ajoute une ligne couloir
            if(rows.length % 3 === 1) {
                columns.push(<td key={`${rows.length}_first`} className='entry'></td>);
                for(let i = columns.length; columns.length < 6; i++) {
                    columns.push(<td key={`center_${i}`}></td>);
                }

                columns.push(<td key={`${rows.length}_last`} className='entry'></td>);
                rows.push(<tr key={rows.length} className='center'>{columns}</tr>);
                columns = [];
            }
            
        } 
        //Sinon si la place de parking est la première de la ligne
        else if(parkingSpace.id % 5 === 1) {
            //On ajoute le premier couloir
            columns.push(<td key={`${rows.length}_first`} className='entry'></td>);
            //On ajoute la place de parking
            columns.push(<td key={parkingSpace.id} className={parkingSpace.free ? '' : 'taken'}>{parkingSpace.id}</td>);

            //Si la place est la dernière de la liste et qu'elle n'est pas un multiple de 5
            //on complète la ligne avec des places vides
            if((index + 1) === parkingSpaces.length && columns.length < 6) {
                for(let i = columns.length; columns.length < 6; i++) {
                    columns.push(<td key={`empty_${i}`}></td>);
                }

                columns.push(<td key={`${rows.length}_last`} className='entry'></td>);
                rows.push(<tr key={rows.length} className={getRowClassName(rows.length)}>{columns}</tr>);
                columns = [];
            }
        } 
        //Sinon on ajoute la place de parking à la ligne
        else {
            columns.push(<td key={parkingSpace.id} className={parkingSpace.free ? '' : 'taken'}>{parkingSpace.id}</td>);
            
            //Si la place est la dernière de la liste et qu'elle n'est pas un multiple de 5
            //on complète la ligne avec des places vides
            if((index + 1) === parkingSpaces.length && columns.length < 6) {
                for(let i = columns.length; columns.length < 6; i++) {
                    columns.push(<td key={`empty_${i}`}></td>);
                }

                columns.push(<td key={`${rows.length}_last`} className='entry'></td>);
                rows.push(<tr key={rows.length} className={getRowClassName(rows.length)}>{columns}</tr>);
                columns = [];
            }
        }
    }

    return (
        <div>
            <h1>Parking Simulator</h1>
            <button onClick={async () => {
                let res = await dispatch(takeAsync());
                if(res.payload !== undefined) {
                    alert(`Vous avez la place n°${res.payload}`)
                    await dispatch(getAllAsync());
                } else {
                    alert(`Désolé, il n'y a plus de place disponible`)
                }
                
            }}>Prendre un ticket</button>
            <button onClick={async () =>{
                const res = await dispatch(leaveAsync()) as any;
                if(res.error !== undefined) {
                    alert(res.error.message)
                } else {
                    await dispatch(getAllAsync());
                }
            }}>Libérer une place</button>
            <table>
                <tbody>
                {rows}
                </tbody>
            </table>
        </div>
    );
}

function getRowClassName(rowNumber: number) : string {
    switch(rowNumber % 3) {
        case 1: return 'center';
        case 2: return 'bottom';
        case 0 : 
        default:
            return 'top';
    }
}

export default Parking;
