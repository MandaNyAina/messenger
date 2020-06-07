import React, { useState, useEffect } from 'react'
import AddUser from './addUser.compo'
import { bake_cookie } from 'sfcookies'

const LoginUser = () => {
    const [user, setUser] = useState("")
    const [username, setUsername] = useState("")
    const [pass, setPass] = useState("")
    const [errorForm, setErrorForm] = useState("")
    let usernames = []
    const styleForm = {
        width: "300px",
        borderRadius: "5px",
        padding: "10px",
        marginTop: "9%",
        boxShadow: "0px 1px 15px 1px #d9d9d9"
    }
    const errorStyle = {
        width: "300px",
        height: "30px",
        padding: "2px",
        fontSize: "16px"
    }
    const getUser = async() => {
        const getAllUser = await fetch("/user")
        const allUser = await getAllUser.json()
        setUser(allUser)
    }
    useEffect(() => {
        getUser()
    }, [])
    if (user === "") {
        usernames = []
    } else {
        usernames = user
    }
    const onSubmit = async(e) => {
        e.preventDefault()
        const getTestUser = await fetch("/user/connect/"+username+"/"+pass)
        const testUser = await getTestUser.json()
        if (testUser === "InvalidAccount") {
            setErrorForm(<div className='alert alert-danger mx-auto mt-3 text-center' style={errorStyle}>Compte invalide</div>)
        } else if (testUser === "InvalidPassword") {
            setErrorForm(<div className='alert alert-danger mx-auto mt-3 text-center' style={errorStyle}>Mot de passe incorrect</div>)
        } else if (testUser === "Connected"){
            const getId = await fetch("/user/getIdU/"+username)
            const Id = await getId.json()
            bake_cookie("user_app_react",Id)
            window.location = "/chat"
        }
    }
    return (
        <div>
            <form onSubmit={onSubmit} className="mx-auto pt-3" style={styleForm}>
                <h3 className="text-center pb-4">Connectez-vous</h3>
                <div className="form-group">
                    <label>Username</label>
                    <input 
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password"
                        className="form-control"
                        value={pass}
                        onChange={e => setPass(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-success btn-block mb-2">Connexion</button>
                <div className="text-center pb-2">
                    <button className="btn btn-link"><AddUser listuser={usernames}/></button>
                </div>
            </form>
            {errorForm}
        </div>
    )
}

export default LoginUser