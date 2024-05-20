import { useNavigate } from "react-router-dom"

export default function Menu({image = 'https://i.pinimg.com/originals/4f/c6/40/4fc640bbb3667abc13806a5fcd6cdaf1.jpg', title = 'Statistics', links})
{

    const navigate = useNavigate()

    const handleOnClick = () => {
        navigate(links)
    }

    return(
        <div className="menu-container" onClick={handleOnClick}>
            <img src={image} alt="" />
            <span >{title}</span>
        </div>
    )
}