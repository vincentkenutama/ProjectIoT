export default function Button({links, title = 'Button'})
{   
    return(
        <div>
            <button className="button-custom" onClick={(e) => links(e)}>{title}</button>
        </div>
    )
}