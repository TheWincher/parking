import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getAllAsync, selectParkingSpaces, takeAsync } from '../features/parking/parkingSlice';
import './Parking.css';

function Parking() {

    const parkingSpaces = useAppSelector(selectParkingSpaces);
    const dispatch = useAppDispatch();


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
            <button onClick={() => dispatch(getAllAsync())}>afficher les places</button>
            <button onClick={async () => {
                await dispatch(takeAsync());
                await dispatch(getAllAsync());
            }}>prendre un ticket</button>
            <button onClick={() => dispatch(getAllAsync())}>liberer une place</button>
            <table>
                <tbody>
                {rows}
                </tbody>
            </table>
        </div>
    );
}

export default Parking;
