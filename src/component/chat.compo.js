import React, { useEffect, useState, Fragment } from 'react'
import {read_cookie, delete_cookie} from 'sfcookies'

const Chat = () => {
    const [listChat, setChat] = useState("")
    const [sender, setSender] = useState("")
    let list = []
    const [pseudo, setPseudo] = useState("")
    const getUserPseudo = async() => {
        if (pseudo === ""){
            const getPseudoName = await fetch("/user/"+read_cookie("user_app_react"))
            const pseudoName = await getPseudoName.json()
            setPseudo(pseudoName.pseudo)
        }
    }
    const getList = async() => {
        const getListValue = await fetch("/message/getMessage/"+read_cookie("user_app_react"))
        const listValue = await getListValue.json()
        setChat(listValue)
    }
    const delog = () => {
        delete_cookie("user_app_react")
        window.location = "/"
    }
    const onChoose = async(m_id, uid, p, p_id) => {
        if (read_cookie("user_app_react") !== uid) {
            await fetch("/message/readMessage/"+m_id, {
                method: "POST",
                headers: {"Content-type":"application/json"}
            })
        }
        window.location = "/chat/"+p_id+"/"+p
    }
    useEffect(() => {
        getList()
        getUserPseudo()
    })
    if (listChat === "") {
        setChat([])
    } else {
        listChat.map(el => list.push(el))
    }
    return (
        <div>
            <div className="col-sm-3 float-left" style={{borderRight:"1px solid #cfcfcf", height:"100vh", overflowY: "auto", position: "fixed"}}>
                <div className="sticky-top pt-2 bg-light">
                    <div className="text-center pb-3">
                        Chat de conversation
                    </div>
                    <div className="text-center p-2">
                        <a href="http://localhost:3000/chat/new" className="btn btn-outline-primary btn-sm" style={{borderRadius: "150px"}}>New message +</a>
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
                            let img = <div className="text-center bg-dark text-light" style={{width: "50px", height: "50px", borderRadius: "50px", float: "left", marginRight: "15px", paddingTop: "14px"}}>{message.partner.substr(0,2).toUpperCase()}</div>
                            if (message.avatar !== "") {
                                img = <img src={message.avatar} style={{width: "50px", height: "50px", borderRadius: "50px", float: "left", marginRight: "15px"}} alt=""/>
                            }
                            return(
                                <Fragment key={message.partnerID}>
                                    <tr>
                                        <td onClick={() => onChoose(message.lastMessageId,message.lastMessageIdU,message.partner,message.partnerID)} style={styles}>
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
                <h5>
                    Bienvenue<button onClick={delog} className="btn btn-sm btn-outline-secondary float-right">Deconnexion ({pseudo})</button>
                </h5>
            </div>
            <div className="text-secondary" style={{marginLeft: "55%", fontSize: "25px",marginTop: "200px"}}>
                
            </div>
            <div className="col-sm-9 p-2" style={{backgroundColor: "white",borderTop: "1px solid #cfcfcf",marginLeft: "25%", position: "fixed", clear: "both", bottom: "0", left: "0"}}>
                <form>
                    <div className="input-group">
                        <input type="text" style={{borderRadius: "25px"}} className="form-control" placeholder="Ecrivez votre message ..." value={sender} onChange={e => setSender(e.target.value)} autoCorrect/>
                        <div className="input-group-append">
                            <button style={{borderRadius: "25px"}} className="btn btn-primary ml-2" type="submit" onClick={(e) => e.preventDefault()}>Envoyer</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Chat