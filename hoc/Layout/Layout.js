import React, {Component} from 'react';

import Aux from '../Auxiliary/Auxilary';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import Head from "next/head";
import Router from "next/router";

import classes from './Layout.module.css';
import LoadingIndicator from "../../components/UI/LoadingIndicator/LoadingIndicator";

class Layout extends Component {

    state = {
        pageLoading: false
    }

    //Setup listeners on route start, complete, and error
    //to display loading indicator inbetween pages
	componentDidMount () {
		Router.events.on("routeChangeStart", () => {
			this.setState({pageLoading: true});
		});

		Router.events.on("routeChangeComplete", () => {
            this.setState({pageLoading: false});
		});

		Router.events.on("routeChangeError", () => {
			this.setState({pageLoading: false});
		});
    };

    componentWillUnmount () {
        //Clear state to prevent unmount error
        this.setState = (state,callback)=>{
            return;
        };
    };
    

    render(props) {

        return (
            <Aux>
                <NavigationBar authenticated={this.props.authenticated}/>

                <div className={[classes.Content, 'container'].join(' ')}>
                    {this.state.pageLoading ? <LoadingIndicator/> : this.props.children}
                </div>
            </Aux>

         
        );
    }
}


export default Layout;