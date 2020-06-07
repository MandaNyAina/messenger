import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery'
import 'bootstrap/dist/js/bootstrap'

import Login from './component/login.compo'
import Chat from './component/chat.compo'
import Conversation from './component/conversation.compo'
import NewMessage from './component/newMessage.compo'

const App = () => {
    return (
        <Router>
            <Route path="/" exact component={Login}/>
            <Route path="/chat" exact component={Chat}/>
            <Route path="/chat/:pid/:ps" exact component={Conversation}/>
            <Route path="/chat/new" exact component={NewMessage}/>
        </Router>
    )
}

export default App