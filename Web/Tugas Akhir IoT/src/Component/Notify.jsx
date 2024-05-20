import '../Styles/globalstyle.css'

export default function Notify({message = 'Notification message', type = 'ok', visibility}){

    const visibleClass = {
        visible : 'notify-visible',
        hidden: 'notify-hidden'
    }

    const colorType = {
        ok : '#357a38',
        warning : '#ffcd38',
        danger : '#f44336'
    }

    return(
        <div    className={visibleClass[visibility]}
                style={{backgroundColor:colorType[type]}}>
            {message}
        </div>
    )
}