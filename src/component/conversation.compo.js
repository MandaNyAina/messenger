import React, { useEffect, useState, Fragment } from 'react'
import {read_cookie, delete_cookie} from 'sfcookies'
import MainMessage from './mainMessage.compo'
import Scroll from 'react-scroll'
let scroll = Scroll.animateScroll

const Conversation = (props) => {
    const [listChat, setChat] = useState("")
    const [sender, setSender] = useState("")
    const [valueMsg, setValue] = useState(0)
    const [convers, setConvers] = useState([])
    const [pseudo, setPseudo] = useState("")
    const [avatar, setAvatar] = useState("")
    let list = []
    let test = false
    const [vu, setVu] = useState("")
    const onChoose = async(key) => {
        const getMessages = await fetch("/message/view/"+read_cookie("user_app_react")+"/"+key)
        const Messages = await getMessages.json()
        for (let i of Messages) {
            test = i.isRead
        }
        if (Messages.length !== valueMsg){
            const msg = []
            test = false
            Messages.map(message => {
                msg.push(message)
            })
            setConvers(msg)
            setValue(Messages.length)
            scroll.scrollToBottom()
        }
        if (test === true ) {
            setVu("Vu")
        } else {
            setVu("")
        }
    }
    const onSelect = async(m_id, uid, p, p_id) => {
        if (read_cookie("user_app_react") !== uid) {
            await fetch("/message/readMessage/"+m_id, {
                method: "POST",
                headers: {"Content-type":"application/json"}
            })
        }
        window.location = "/chat/"+p_id+"/"+p
    }
    const getUserPseudo = async() => {
        if (pseudo === ""){
            const getPseudoName = await fetch("/user/"+read_cookie("user_app_react"))
            const pseudoName = await getPseudoName.json()
            setPseudo(pseudoName.pseudo)
        }
    }
    const getAvatar = async() => {
        if (avatar === ""){
            const getAvatarImg = await fetch("/user/"+props.match.params.pid)
            const avatarImg = await getAvatarImg.json()
            if (avatarImg.avatar !== "") {
                setAvatar(<img src={avatarImg.avatar} alt="" style={{width: "30px", height: "30px", borderRadius: "50px", float: "left", marginRight: "10px"}}/>)
            } else {
                setAvatar(<span className="bg-dark text-light text-center" style={{width: "30px", height: "30px", borderRadius: "50px", float: "left", marginRight: "10px",paddingTop:"3px"}}>{props.match.params.ps.substr(0,2)}</span>)
            }
        } 
    }
    const onSubmit = async(e) => {
        e.preventDefault()
        const newMessage = {
            "content": sender,
            "userIDSend": read_cookie("user_app_react"),
            "userIDReceive": props.match.params.pid
        }
        if (sender !== "") {
            await fetch("/message/send",{
                method: "POST",
                headers: {"Content-type":"application/json"},
                body: JSON.stringify(newMessage)
            })
            setSender("")
            scroll.scrollToBottom()
        }
    }
    const delog = () => {
        delete_cookie("user_app_react")
        window.location = "/"
    }
    const getList = async() => {
        const getListValue = await fetch("/message/getMessage/"+read_cookie("user_app_react"))
        const listValue = await getListValue.json()
        setChat(listValue)
    }
    useEffect(() => {
        onChoose(props.match.params.pid)
        getUserPseudo()
        getAvatar()
        getList()
    })
    if (listChat === "") {
        setChat([])
    } else {
        listChat.map(async(el) => {
            list.push(el)
        })
    }
    return (
        <div>
            <div className="col-sm-3 float-left" style={{borderRight:"1px solid #cfcfcf", height:"100vh", overflowY: "auto", position: "fixed"}}>
                <div className="sticky-top pt-2 bg-light">
                    <div className="text-center pb-3">
                        Chat de conversation
                    </div>
                    <div className="text-center p-2">
                        <a href="http://192.168.8.12:3000/chat/new" className="btn btn-outline-primary btn-sm" style={{borderRadius: "150px"}}>New message +</a>
                    </div>
                </div>
                <div className="p-2">
                    <table className="table table-borderless table-hover">
                        <tbody>
                            {list.map(message => {
                            let styles = {width: "500px", padding: "5px", borderRadius: "15px"}
                            if (!message.isRead && message.lastMessageIdU !== read_cookie("user_app_react")) {
                                styles = {background : "#d9d9d9",width: "500px", padding: "5px", borderRadius: "15px"}
                            }
                            let img = <div className="text-center bg-dark text-light" style={{width: "50px", height: "50px", borderRadius: "50px", float: "left", marginRight: "15px", paddingTop: "14px"}}>{props.match.params.ps.substr(0,2).toUpperCase()}</div>
                            if (message.avatar !== "") {
                                img = <img src={message.avatar} style={{width: "50px", height: "50px", borderRadius: "50px", float: "left", marginRight: "15px"}} alt=""/>
                            }
                            return(
                                <Fragment key={message.partnerID}>
                                    <tr>
                                        <td onClick={() => onSelect(message.lastMessageId,message.lastMessageIdU,message.partner,message.partnerID)} style={styles}>
                                            {img}
                                            <b>{message.partner}</b>
                                            <p style={{fontSize: "12px"}}>{message.lastMessage.substr(0,35)}</p>
                                        </td>
                                    </tr>
                                    <hr style={{margin: "5px"}}/>
                                </Fragment>
                            )})}
                        </tbody>
                    </table>   
                </div>
            </div>
            <div className="col-sm-9 p-2 sticky-top" style={{backgroundColor: "white", borderBottom:"1px solid #cfcfcf", marginLeft: "25%"}}>
                {avatar}
                <h5>
                    {props.match.params.ps}<button onClick={delog} className="btn btn-sm btn-outline-secondary float-right">Deconnexion ({pseudo})</button>
                </h5>
            </div>
            <table className="col-sm-9" style={{marginLeft: "25%"}}>
                <tbody>
                    <tr>
                        <td className="align-bottom" style={{height: "90vh"}}>
                            <MainMessage msg={convers} vu ={vu} pseudo={props.match.params.ps} avatar={avatar}/>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="col-sm-9 p-2" style={{backgroundColor: "white",borderTop: "1px solid #cfcfcf",marginLeft: "25%", position: "fixed", clear: "both", bottom: "0", left: "0"}}>
                <form onSubmit={onSubmit}>
                    <div className="input-group">
                        <input type="text" style={{borderRadius: "25px"}} className="form-control" placeholder="Ecrivez votre message ..." value={sender} onChange={e => setSender(e.target.value)} autoCorrect/>
                        <div className="input-group-append">
                            <button style={{borderRadius: "25px"}} className="btn btn-primary ml-2" type="submit">Envoyer</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Conversation