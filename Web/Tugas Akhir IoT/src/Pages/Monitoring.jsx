import React, { useEffect, useMemo, useState } from "react";
import UserCard from "../Component/UserCard";
import ProfilePasien from "../Component/ProfilePasien";
import HighlightText from "../Component/HighlightText";
import DataCards from "../Component/DataCards";
import MonitoringStatistics from "../Component/MonitoringStatistics";
import ControlComponent from "../Component/ControlComponent.jsx";
import LampuControl from "../Component/LampuControl.jsx";
import Notify from "../Component/Notify.jsx";
import DateFilter from "../Component/DateFilter.jsx";
import { getDataFeeds, SendData } from "../Script.js";
import '../Styles/globalstyle.css';
import Button from "../Component/Button.jsx";

export default function Monitoring() {
    const [data_suhu, setDataSuhu] = useState([]);
    const [data_kelembapan, setDataKelembapan] = useState([]);
    const [data_detak_jantung, setDataJantung] = useState([]);
    const [data_kualitas_udara, setDataUdara] = useState([]);
    const [data_infus, setDataInfus] = useState(0);
    const [data_lampu, setDataLampu] = useState(false);
    const [date, setDate] = useState(new Date().valueOf());
    const [notifyData, setNotifyData] = useState({
        message: '',
        visibility: 'hidden',
        type: 'ok'
    });

    const getThingspeakData = async () => {
        const suhu = await getDataFeeds(2474055, 'E1H1VFO1ALP4CFP7', 1, 3000);
        const kelembapan = await getDataFeeds(2474055, 'E1H1VFO1ALP4CFP7', 2, 3000);
        const detakJantung = await getDataFeeds(2474055, 'E1H1VFO1ALP4CFP7', 3, 3000);
        const kualitasUdara = await getDataFeeds(2474055, 'E1H1VFO1ALP4CFP7', 4, 3000);

        // setTimeout(getThingspeakData, 15000);

        return { suhu, kelembapan, detakJantung, kualitasUdara };
    };

    const memoizedData = useMemo(() => getThingspeakData(), [date]);

    useEffect(() => {
        memoizedData.then(data => {
            setDataSuhu(data.suhu);
            setDataKelembapan(data.kelembapan);
            setDataJantung(data.detakJantung);
            setDataUdara(data.kualitasUdara);
        });
    }, [memoizedData]);

    const handleOnClick = async (value) => {
        const notify = {};
        const data = [
            {
                value: data_infus
            },
            {
                value: data_lampu ? 1 : 0
            }
        ];
        const res = await SendData(2554290, 'DSNIDA883TO9FWPP', data);

        if (res === 0) {
            notify.message = 'Error on sending data...';
            notify.type = 'danger';
            notify.visibility = 'visible';
        } else {
            notify.message = 'Sending data success...';
            notify.type = 'ok';
            notify.visibility = 'visible';
        }

        setNotifyData(notify);

        setTimeout(() => {
            setNotifyData({
                message: '',
                type: 'ok',
                visibility: 'hidden'
            });
        }, 3000);
    };

    return (
        <div className="beranda-background">
            <div className="beranda-container">
                <div>
                    <UserCard links="/home" linksText="Kembali" />
                    <HighlightText message='Pasien Aktif' />
                    <ProfilePasien nama='Eren Yeager' picture="./ian.jpg" />
                    <HighlightText message='Data Profil Pasien' />
                    <DataCards />
                    <HighlightText message='Monitoring' />
                    <DateFilter date={date} links={setDate} />

                    <MonitoringStatistics
                        namaData="Suhu Ruangan (C)"
                        datas={data_suhu}
                        dataKeys={'field1'}
                        replaceKeys={'Suhu'}
                        color="red"
                        date_filter={date}
                    />

                    <MonitoringStatistics
                        namaData="Kelembapan (%)"
                        datas={data_kelembapan}
                        dataKeys={'field2'}
                        replaceKeys={'Kelembapan'}
                        color="orange"
                        date_filter={date}
                    />

                    <MonitoringStatistics
                        namaData="Detak Jantung (bpm)"
                        datas={data_detak_jantung}
                        dataKeys={'field3'}
                        replaceKeys={'Detak Jantung'}
                        color="blue"
                        date_filter={date}
                    />

                    <MonitoringStatistics
                        namaData="Kualitas Udara (ppm)"
                        datas={data_kualitas_udara}
                        dataKeys={'field4'}
                        replaceKeys={'ppm'}
                        date_filter={date}
                    />

                    <HighlightText message='Control' />

                    <Notify message={notifyData.message} 
                            type={notifyData.type} 
                            visibility={notifyData.visibility} />

                    <ControlComponent links={setDataInfus} value={data_infus} />
                    <LampuControl links={setDataLampu} value={data_lampu} />

                    <Button title="Send Data" links={handleOnClick} />
                </div>
            </div>
        </div>
    );
}
