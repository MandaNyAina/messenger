import React, { Fragment, useState } from 'react'
import './style.css'
import Path from 'path'

const AddUser = (props) => {
    const [avatar, setAvatar] = useState("")
    const [pseudo, setPseudo] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const [errorPseudo, setErrorPseudo] = useState("")
    const [errorPseudoF, setErrorPseudoF] = useState("form-control bg-dark text-light")
    const [errorUsername, setErrorUsername] = useState("")
    const [errorUsernameF, setErrorUsernameF] = useState("form-control bg-dark text-light")
    const [errorPassword, setErrorPassword] = useState("")
    const [errorPasswordF, setErrorPasswordF] = useState("form-control bg-dark text-light")

    const getPseudo = () => {
        let i =0
        props.listuser.map(user => {
            if(user.pseudo === pseudo){
                i = 1
            } 
        })
        if(i === 1){
            setErrorPseudo("Le pseudo '"+pseudo+"' existe déjà")
            setErrorPseudoF("form-control bg-dark text-light is-invalid")
        } else if (i === 0 && pseudo !==""){
            setErrorPseudo("")
            setErrorPseudoF("form-control bg-dark text-light is-valid")
        } else if (pseudo === ""){
            setErrorPseudo("Ce champs est obligatoire")
            setErrorPseudoF("form-control bg-dark text-light is-invalid")
        }
    }

    const getUsername = () => {
        let i = 0
        props.listuser.map(user => {
            if(user.username === username){
                i = 1
            }
        })
        if(i === 1){
            setErrorUsername("L'utilisateur '"+username+"' existe déjà")
            setErrorUsernameF("form-control bg-dark text-light is-invalid")
        } else if (i === 0 && username !== ""){
            setErrorUsername("")
            setErrorUsernameF("form-control bg-dark text-light is-valid")
        } else if (username === ""){
            setErrorUsername("Ce champs est obligatoire")
            setErrorUsernameF("form-control bg-dark text-light is-invalid")
        }
    }

    const getPassword = () => {
        if(password.length < 8){
            setErrorPassword("Le mot de passe doit contenir plus de 8 caractères minimuns")
            setErrorPasswordF("form-control bg-dark text-light is-invalid")
        } else {
            setErrorPassword("")
            setErrorPasswordF("form-control bg-dark text-light is-valid")
        }
    }

    const onSubmit = async(e) => {
        e.preventDefault()
        getPseudo()
        getUsername()
        getPassword()
        if ((!errorPseudo && !errorUsername && !errorPassword) && (pseudo !== "" && username !== "" && password !== "")) {
            const newUser = {
                pseudo,
                username,
                password,
                avatar
            }
            const saveNewUser = await fetch("/user/add",{
                method: "POST",
                headers: {"Content-type":"application/json"},
                body: JSON.stringify(newUser)
            })
            window.location = "/"
        }
    }
    const getAvatar = (e) => {
        const ext = [".png",".jpg",".jpeg"]
        const sizeMax = 4096000
        const file = e.target
        setAvatar("")
        if (file.value !== ""){
            if (ext.includes(Path.extname(file.value).toLowerCase())) {
                if (file.files[0].size <= sizeMax) {
                    let data = new FileReader()
                    data.readAsDataURL(file.files[0])
                    data.onloadend = (rep) => {
                        setAvatar(rep.target.result)
                    }
                } else {
                    alert("Taille de l'image supérieur à 4Mo")
                }
            } else {
                alert("Fichier non prise en charge")
            }
        }
    }
    let img = <div><label htmlFor="avatar" className="bg-light text-dark avatar" style={{paddingTop:"38px"}}>Photo</label><br/></div>
    if (avatar !== "") {
        img = <div><label htmlFor="avatar"><img src={avatar} className="avatar" alt=""/></label><br/></div>
    }
    return (
        <Fragment>
        <button type="button" className="btn btn-link" data-toggle="modal" data-target="#exampleModal">
            Crée un compte
        </button>

        <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" style={{width: "350px"}} role="document">
            <div className="modal-content bg-dark text-light">
                <div className="modal-body text-left">
                    <div className="text-center">
                        <h3>Crée votre compte gratuitement</h3>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className="text-center">
                            {img}
                            <label htmlFor="avatar" className="btn btn-primary btn-sm">
                                Importer une image
                            </label>
                            <input type="file" id="avatar" onChange={getAvatar} style={{opacity: "0", position: "absolute", zIndex: "-1"}}/>
                        </div>
                        <div className="form-group">
                            <label>Pseudo</label>
                            <input 
                                type="text"
                                className={errorPseudoF}
                                placeholder="Votre pseudo"
                                value={pseudo}
                                onChange={e => setPseudo(e.target.value)}
                                onBlur={getPseudo}
                            />
                            <span className="text-danger" style={{fontSize: "12px"}}>{errorPseudo}</span>
                        </div>
                        <div className="form-group">
                            <label>Username</label>
                            <input 
                                type="text"
                                className={errorUsernameF}
                                value={username}
                                placeholder="Votre nom d'utilisateur"
                                onChange={e => setUsername(e.target.value)}
                                onBlur={getUsername}
                            />
                            <span className="text-danger" style={{fontSize: "12px"}}>{errorUsername}</span>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input 
                                type="password"
                                className={errorPasswordF}
                                placeholder="Votre mot de passe"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onBlur={getPassword}
                            />
                            <span className="text-danger" style={{fontSize: "12px"}}>{errorPassword}</span>
                        </div>
                        <div className="text-center">
                            <button className="btn btn-success btn-sm">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </div>
        </Fragment>
    )
}

export default AddUser
