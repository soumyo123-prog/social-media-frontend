import React from 'react';
import classes from './Layout.module.css';
import {Route, Switch} from 'react-router-dom';

import Home from '../../Components/Home/Home';
import Login from '../../Components/Auth/sign_in';
import Create from '../../Components/Auth/sign_up';
import Profile from '../../Components/Profile/Profile';
import Settings from '../../Components/ProfileSettings/settings';
import NewPost from '../../Components/NewPost/NewPost';
import Search from '../../Components/Search/Search';
import Other from '../../Components/OtherProfile/OtherProfile';
import Fullpost from '../../Components/FullPost/FullPost';

const Layout = (props) => {
    return (
        <div className={classes.Layout}>
            <Switch>
                <Route path = '/' exact component = {Home} />
                <Route path = '/profile/me' exact component = {Profile} />
                <Route path = '/profile/settings' exact component = {Settings} />
                <Route path = '/posts/add' exact component = {NewPost} />
                <Route path = '/search' exact component = {Search} />
                <Route path = '/profile/:id' exact component = {Other} />
                <Route path = '/posts/:id' exact component = {Fullpost} />
                {/* <Route path = '*' render = {() => {
                    return (
                        <div>
                            404 error
                        </div>
                    )
                }} /> */}
            </Switch>
        </div>
    )
}

export default Layout;