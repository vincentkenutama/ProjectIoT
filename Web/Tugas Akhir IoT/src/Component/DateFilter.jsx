import { useState } from "react"
import DateTimePicker from "react-datetime-picker"
import '../Styles/globalstyle.css'

export default function DateFilter({date, links}){

    // const [date, setDate] = useState(new Date().valueOf())

    const handleDate = (e, mode) => {

        const today = new Date().valueOf()
        const dateNow = new Date(date).valueOf();
        
        const previousDate = new Date(dateNow - 86400000)
        const nextDate = new Date(dateNow + 86400000);

        switch(mode)
        {
            case 0:
                links(previousDate.valueOf());
                break;
            
            case 1:
                if(nextDate.valueOf() > today){
                    links(today)
                }
                else{
                    links(nextDate.valueOf());
                }
                break;
            case 2:
                links(today)
                break;
        }
    }

    const day = [
        'Min',
        'Sen',
        'Sel',
        'Rab',
        'Kam',
        'Jum',
        'Sab'
    ]
    const month = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember'
    ]

    return(
        <div className="date-picker">
            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="back-button" fill="#ffffff" stroke="#000000" strokeLinecap="round" 
                 strokeLinejoin="round" strokeWidth={20} height="50px" width="50px" version="1.1" id="Capa_1"  xmlns:xlink="http://www.w3.org/1999/xlink" 
                 xml:space="" onClick={(e) => handleDate(e, 0)}>

                <g data-name="Layer 2" id="Layer_2">

                <g data-name="E416, back, Media, media player, multimedia, player" id="E416_back_Media_media_player_multimedia_player">

                <circle class="cls-1" cx="256" cy="256" r="246"/>

                <polyline class="cls-1" points="333.82 100.37 178.18 256 333.82 411.63"/>

                </g>

                </g>

            </svg>

            <span className="date" onClick={(e) => handleDate(0, 2)}>{day[new Date(date).getDay()]}, {new Date(date).getDate()} {month[new Date(date).getMonth()]} {new Date(date).getFullYear()}</span>

            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="next-button" fill="#ffffff" stroke="#000000" strokeLinecap="round" 
                 strokeLinejoin="round" strokeWidth={20} height="50px" width="50px" version="1.1" id="Capa_1"  xmlns:xlink="http://www.w3.org/1999/xlink" 
                 xml:space="" onClick={(e) => handleDate(e, 1)}>
            
            

            <g data-name="Layer 2" id="Layer_2">

            <g data-name="E415, next, Media, media player, multimedia" id="E415_next_Media_media_player_multimedia">

            <circle class="cls-1" cx="256" cy="256" r="246"/>

            <polyline class="cls-1" points="178.18 411.63 333.82 256 178.18 100.37"/>

            </g>

            </g>

            </svg>
        </div>
    )
}