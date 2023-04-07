import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getAllAsync, leaveAsync, selectInitialized, selectParkingSpaces, takeAsync } from '../features/parking/parkingSlice';
import './Parking.css';

function Parking() {

    const parkingSpaces = useAppSelector(selectParkingSpaces);
    const initialized = useAppSelector(selectInitialized);
    const dispatch = useAppDispatch();

    if(!initialized) {
        dispatch(getAllAsync());
    }


    let rows = [];
    let columns = [];
    for(var parkingSpace of parkingSpaces) {
        if(parkingSpace.id % 5 === 4) {
            let className = '';
            switch(rows.length % 3) {
                case 0 : className = 'top';
                break;
                case 1: className = 'center';
                break;
                case 2: className = 'bottom';
                break;
            }

            columns.push(<td className={parkingSpace.free ? '' : 'taken'}>{parkingSpace.id}</td>);
            columns.push(<td className='entry'></td>);
            rows.push(<tr key={parkingSpace.id} className={className}>{columns}</tr>);
            columns = [];

            if(rows.length % 3 === 1) {
                columns.push(<td className='entry'></td>);
                columns.fill(<td></td>)
                columns.push(<td className='entry'></td>);
                rows.push(<tr className='center'>{columns}</tr>);
                columns = [];
            }
            
        } else if(parkingSpace.id % 5 === 0) {
            columns.push(<td className='entry'></td>);
            columns.push(<td className={parkingSpace.free ? '' : 'taken'}>{parkingSpace.id}</td>);
        } else {
            columns.push(<td className={parkingSpace.free ? '' : 'taken'}>{parkingSpace.id}</td>);
        }
    }

    return (
        <div>
            <h1>Parking Simulator</h1>
            <button onClick={async () => {
                let res = await dispatch(takeAsync());
                if(res.payload) {
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

export default Parking;
