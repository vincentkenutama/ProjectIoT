import '../Styles/globalstyle.css'

export default function ProfilePasien({nama, picture = "https://imgx.sonora.id/crop/0x0:0x0/360x240/photo/2024/04/19/2-orang-jawa-freepikjpg-20240419024506.jpg", umur, jeniskelamin, sensorid})
{
    return(
        <div className="profile-pasien-container">
            <img src={picture} alt="" />
            <div className='profile-pasien-identity-wrapper'>
                <span className='profile-pasien-nama'>{nama}</span>
                <span className='profile-pasien-umur'>332603090903001</span>
                <span className='profile-pasien-umur'>Laki-laki</span>
                {/* <span className='profile-pasien-umur'>19 - Februari - 1998</span> */}
            </div>
        </div>
    )
}