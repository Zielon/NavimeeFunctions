import Room from "../models/entities/chat/room";

export default class ChatCountryFilters{

    public getFilter(country: string, city: string): any{
        if(country.toUpperCase() === 'POLAND')
            return function(room: Room){
                // A special case for Trójmiasto
                const tricity = ['GDAŃSK', 'GDYNIA', 'SOPOT'];
                const roomCity = room.name.toUpperCase();
                const userCity = city.toUpperCase();

                return roomCity === userCity || (roomCity === 'TRÓJMIASTO' && tricity.indexOf(userCity) > -1)
            }
        else throw Error(country + " is not available!");
    }
}