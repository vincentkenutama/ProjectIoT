import { useState } from 'react';
import Slider from 'react-input-slider';

export default function ControlComponent({namaKomponen, links, value = 0}){

    // const [state, setState] = useState(0);

    const handleChange = (value) => {
        links(value)
    }

    return(
        <div className="control-component">
            <span className='monitoring-statistics-title'>Pump Infus (cc / h)</span>
            <div className='control-componen-ch'>
                <img className='control-infus-img'
                    src="https://sejawat-for-her.s3.ap-southeast-1.amazonaws.com/sejawat-for-her/thumbnail/ketahui-7-jenis-cairan-iv-yang-digunakan-saat-merawat-pasien/327357121fdea993bbaefcc4d741dbbc/Untitled-design.png" alt="" />
                
                <div className='control-infus-control'>
                    <span className='control-infus-speed'>{value}</span>
                    <Slider
                    axis="x"
                    xmax={30}
                    // xstep={1}
                    x={value}
                    onChange={({x}) => 
                        {
                            // setState(x)
                            handleChange(x)
                    }} 
                    />   
                     
                </div>
            </div>
            
            
        </div>
    )
}