import React, {Component} from 'react';
import './styles.scss';

import PropTypes from 'prop-types';

const ANIMATION_EASING = 'cubic-bezier(.17,.67,.9,1.42)';

class Button extends Component {
    render() {
        return (
            <div
                className={`button ${this.props.className}`}
                onMouseDown={this._handleMouseDown}
                onTouchStart={this._handleMouseDown}
                onClick={this._handleClick}
            >
                {this.props.buttonKey}
                {
                    !this.props.disabled && (
                        <div ref={this._ref} className="wave"/>
                    )
                }
            </div>
        );
    }

    _handleMouseDown = () => {
        if (this.props.disabled) {
            return;
        }

        if (this._animation) {
            this._animation.cancel();
            this._animation = null;
        }

        this._animation = this._element
            .animate([{
                width: '0',
                height: '0',
                easing: ANIMATION_EASING,
                offset: 0
            }, {
                width: '120%',
                height: '120%',
                easing: ANIMATION_EASING,
                offset: 0.999
            }, {
                width: '0',
                height: '0',
                offset: 1
            }], {
                duration: 300
            });

        this._animation.onfinish = () => {
            this._animation = null;
        };
    };

    _handleClick = () => {
        if (this.props.disabled) {
            return;
        }

        this.props.onClick(this.props.buttonKey);
    };

    _ref = el => {
        this._element = el;
    };
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
