import React, { Fragment } from 'react'
import moment from './moment'

const MainMessage = (props) => {
    let vu = props.vu
    let a = 0
    props.msg.map(ligne => {
        if(ligne["Receive"] === undefined && ligne["isRead"] === undefined){
            a = 1
        } else if (ligne["Send"] === undefined && ligne["isRead"] === undefined){
            a = 0
        }
    })
    if (a === 0){
        vu= ""
    }
    return (
        <Fragment>
            <table className="table table-borderless" style={{marginBottom: "50px", bottom:"0px"}}>
                <tbody>
                {props.msg.map(ligne => {
                    if(ligne["Send"] === undefined && ligne["isRead"] === undefined){
                        return (
                            <tr key={ligne["date"]}>
                                <td style={{width: "50%",paddingRight: "15%"}}>
                                    {props.avatar}
                                    <div className="float-left" style={{maxWidth: "60%"}}>
                                        <p className="bg-light p-1 pl-3 pr-3" style={{borderRadius: "20px"}}>{ligne["Receive"]}</p> 
                                        <p className="align-right float-right" style={{fontSize: "10px",marginTop:"-15px",marginBottom:"-15px"}}>
                                            {moment(ligne["date"]).calendar()}                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )
                    } else if (ligne["Receive"] === undefined  && ligne["isRead"] === undefined){
                        return (
                            <tr key={ligne["date"]}>
                                <td style={{width: "50%"}}>
                                    <div className="float-right" style={{maxWidth: "60%"}}>
                                        <p className="bg-primary p-1 pl-3 pr-3" style={{borderRadius: "20px"}}>{ligne["Send"]}</p> 
                                        <p className="align-right float-right" style={{fontSize: "10px",marginTop:"-15px",marginBottom:"-15px"}}>
                                            {moment(ligne["date"]).calendar()}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )
                    }
                })}
                </tbody>
                <span className="float-right mr-3 p-0 mb-2" style={{fontSize: "12px",marginTop: "-15px"}}>
                    {vu}
                </span>
            </table>
        </Fragment>
    )
}

export default MainMessage