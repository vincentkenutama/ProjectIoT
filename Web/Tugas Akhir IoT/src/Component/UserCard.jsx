import UserProfilePicture from "./UserProfilePicture"
import { useNavigate } from "react-router-dom"

export default function UserCard({username, fullname, links = '/', linksText = 'Sign out'}){

    const navigate = useNavigate()

    const nav = () => {
        navigate(links)
    }

    return(
        <div className="user-card"> 
            <UserProfilePicture/>
            <span className="user-greetings">Vincent Kenutama Prasetyo</span>
            <span className="sign-out" onClick={nav} >{linksText}</span>
        </div>
    )
}