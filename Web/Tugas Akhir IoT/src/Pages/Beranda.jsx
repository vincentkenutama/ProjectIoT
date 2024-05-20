import UserCard from "../Component/UserCard"
import Menu from "../Component/Menu"
import '../Styles/globalstyle.css'

export default function Beranda()
{
    return(
        <div className="beranda-background">
            <div className="beranda-container">
                <div>
                    <UserCard/>  

                    <div className="menu-wrapper">
                        <Menu   title="Monitoring"
                                image='https://i.pinimg.com/originals/4f/c6/40/4fc640bbb3667abc13806a5fcd6cdaf1.jpg'
                                links='/monitoring'/>  

                        <Menu   title="Pasien"
                                image='https://assets-global.website-files.com/6364b6fd26e298b11fb9391f/6364b6fd26e2986929b93ce6_DrawKit0089_Diversity_%26_Inclusivity_Thumbnail-min.png'/> 
                        
                        <Menu   title="Kalender"
                                image='https://cdn4.iconfinder.com/data/icons/small-n-flat/24/calendar-512.png'/> 
                    </div>
                    
                </div>
            </div>
        </div>
    )
}