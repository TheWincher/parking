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
    for(let index = 0; index < parkingSpaces.length; index++) {
        const parkingSpace = parkingSpaces[index];
        if(parkingSpace.id % 5 === 0) {
            columns.push(<td key={parkingSpace.id} className={parkingSpace.free ? '' : 'taken'}>{parkingSpace.id}</td>);
            if(columns.length < 6) {
                for(let i = columns.length; columns.length < 6; i++) {
                    columns.push(<td key={`empty_${i}`}></td>);
                }
            }
            columns.push(<td key={`${rows.length}_last`} className='entry'></td>);

            rows.push(<tr key={rows.length} className={getRowClassName(rows.length)}>{columns}</tr>);
            columns = [];

            if(rows.length % 3 === 1) {
                columns.push(<td key={`${rows.length}_first`} className='entry'></td>);
                for(let i = columns.length; columns.length < 6; i++) {
                    columns.push(<td key={`center_${i}`}></td>);
                }

                columns.push(<td key={`${rows.length}_last`} className='entry'></td>);
                rows.push(<tr key={rows.length} className='center'>{columns}</tr>);
                columns = [];
            }
            
        } else if(parkingSpace.id % 5 === 1) {
            columns.push(<td key={`${rows.length}_first`} className='entry'></td>);
            columns.push(<td key={parkingSpace.id} className={parkingSpace.free ? '' : 'taken'}>{parkingSpace.id}</td>);

            if((index + 1) === parkingSpaces.length && columns.length < 6) {
                for(let i = columns.length; columns.length < 6; i++) {
                    columns.push(<td key={`empty_${i}`}></td>);
                }

                columns.push(<td key={`${rows.length}_last`} className='entry'></td>);
                rows.push(<tr key={rows.length} className={getRowClassName(rows.length)}>{columns}</tr>);
                columns = [];
            }
        } else {
            columns.push(<td key={parkingSpace.id} className={parkingSpace.free ? '' : 'taken'}>{parkingSpace.id}</td>);
            if((index + 1) === parkingSpaces.length && columns.length < 7) {
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
