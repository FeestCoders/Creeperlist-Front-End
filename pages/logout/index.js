import React, {Component} from "react";
import { wrapper } from "../../redux";
import {
	checkServerSideCookie,
	deauthenticate,
} from "../../redux/actions/auth";

import { connect } from "react-redux";

import {withRouter} from "next/router";

class LogoutIndex extends Component  {



    componentDidMount() {
        this.props.doLogout();

        console.log(this.props);

        this.props.router.replace('/');
    }


  
    render() {
        return null;
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        doLogout: () => dispatch(deauthenticate())
    }
}

export default connect(null, mapDispatchToProps)(withRouter(LogoutIndex));
