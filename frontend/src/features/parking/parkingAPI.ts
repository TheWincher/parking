import { ParkingSpace } from "./parkingSlice";

export async function getAll() : Promise<ParkingSpace[]> {
    const response = await fetch('http://localhost:3080/parking/all', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    return await await response.json();
}

export async function take() : Promise<number> {
    const response = await fetch('http://localhost:3080/parking/take', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    return await response.json();
}

export async function leave(id: number) : Promise<void> {
    const response = await fetch(`http://localhost:3080/parking/leave/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if(!response.ok) throw await response.json();
}