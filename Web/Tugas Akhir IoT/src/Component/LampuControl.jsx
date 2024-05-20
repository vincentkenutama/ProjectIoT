import { useEffect, useState } from "react"

export default function LampuControl({links, value})
{
    const [kondisiLampu, setKondisiLampu] = useState(false);

    const image = {
        true : './lampu_nyala.jpg',
        false : './lampu_mati.jpg'
    }

    const lampuMessage = {
        true : 'Menyala',
        false : 'Mati'
    }

    const buttonMessage = {
        true : 'Matikan',
        false : 'Nyalakan'
    }

    const handleLampu = () => {
        // console.log(value)
        links(!value);
    }

    // useEffect(() => {

    // }, )

    return(
        <div className="lampu-control">
            <span className="monitoring-statistics-title">Lampu</span>
            <div className="lampu-control-wrapper">
                <img className='lampu-control-img' src={image[value]} alt="" />

                <div className="lampu-control-controller">
                    <span className="kondisi-lampu">{lampuMessage[value]}</span>
                        <button className="lampu-control-btn"
                                onClick={handleLampu}>{buttonMessage[value]}</button>
                </div>

            </div>
        </div>
    )
}