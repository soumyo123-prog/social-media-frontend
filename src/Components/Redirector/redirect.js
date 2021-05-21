import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import * as types from '../../Store/Actions/index';

const redirect = props => {
    let redirector = null;
    if (!props.token) {
        redirector = <Redirect to='/' />;
    }
    return redirector; 
}

const mapStateToProps = state => {
    return {
        token : state.auth.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        redirected : () => dispatch(types.redirected())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(redirect);