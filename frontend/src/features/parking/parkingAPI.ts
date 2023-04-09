import { ParkingSpace } from "./parkingSlice";

/**
 * Récupère la liste des places de parking via un appel à l'API
 * @returns la liste des places de parking
 */
export async function getAll() : Promise<ParkingSpace[]> {
    const response = await fetch('http://localhost:3080/parking/all', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    return await await response.json();
}

/**
 * Prend la première place de parking disponible via un appel à l'API
 * @returns le numéro première place de parking disponible, sinon undefined
 */
export async function take() : Promise<number> {
    const response = await fetch('http://localhost:3080/parking/take', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    return await response.json();
}

/**
 * Libère une place de parking
 * @param id le numéro de la place a libérer
 * @throws 
 * HttpStatus.NOT_FOUND si aucune place ne correspond au numéro de place demandé
 * HttpStatus.BAD_REQUEST si la place est déjà libre
*/
export async function leave(id: number) : Promise<void> {
    const response = await fetch(`http://localhost:3080/parking/leave/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if(!response.ok) throw await response.json();
}