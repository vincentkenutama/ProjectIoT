import '../Styles/globalstyle.css'

export default function DataCards({data})
{

    const dataList = [
        {
            keterangan: 'Tanggal Masuk',
            nilai : '19 - Mei - 2024'
        },
        {
            keterangan: 'Tempat Lahir',
            nilai : 'Yogyakarta'
        },
        {
            keterangan: 'Tanggal Lahir',
            nilai : '12 - Februari - 2004'
        },
        {
            keterangan: 'Golongan Darah',
            nilai : 'AB+'
        }
    ]

    return(
        <div className="data-card">
            
            {(dataList.map((data) => {
                return(
                <div className='data-card-d'>
                    <div className='data-card-keterangan'>{data['keterangan']}</div>
                    <div className='data-card-nilai'>{data['nilai']}</div>
                </div>
                )
            }))}
        </div>
    )
}