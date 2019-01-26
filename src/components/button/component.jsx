import React, {Component} from 'react';
import './styles.scss';

import PropTypes from 'prop-types';

class Button extends Component {
    constructor(props) {
        super(props);

        this._handleClick = this._handleClick.bind(this);
    }

    render() {
        return (
            <button
                type="button"
                className={`button ${this.props.className} waves-effect waves-purple white`}
                disabled={this.props.disabled}
                onClick={this._handleClick}
            >
                {this.props.buttonKey}
            </button>
        );
    }

    _handleClick() {
        console.log(this.props);
        this.props.onClick(this.props.buttonKey);
    }
}

Button.propTypes = {
    className: PropTypes.string.isRequired,
    buttonKey: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

Button.defaultProps = {
    disabled: false
};

export default Button;
