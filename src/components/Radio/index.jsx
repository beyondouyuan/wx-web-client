import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';

class Radio extends Component {
    render() {
        const { name, selectedValue, onChange } = this.context.radioGroup;
        const { children, disabled } = this.props;
        const optional = {};
        if (selectedValue !== undefined) {
            optional.checked = (this.props.value === selectedValue);
        }
        if (disabled !== undefined) {
            optional.disabled = (this.props.disabled === disabled);
        }
        if (typeof onChange === 'function') {
            optional.onChange = onChange.bind(null, this.props.value);
        }

        return (
            <span className="normal-radio">
                <input type="radio" name={name} {...optional} className="radio-input" />
                <i className="box"></i>{children}
            </span>
        );
    }
}

Radio.contextTypes = {
    radioGroup: PropTypes.object
}


class RadioGroup extends Component {

    getChildContext() {
        const { name, selectedValue, onChange } = this.props;
        return {
            radioGroup: {
                name, selectedValue, onChange
            }
        }
    }

    render() {
        const { Component, name, selectedValue, onChange, children, ...rest } = this.props;
        return (<Component {...rest} className='radio-container'>{children}</Component>);
    }
}

RadioGroup.childContextTypes = {
    radioGroup: PropTypes.object
}
RadioGroup.defaultProps = {
    Component: 'div'
}

RadioGroup.propTypes = {
    name: PropTypes.string,
    selectedValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
    ]),
    onChange: PropTypes.func,
    children: PropTypes.node.isRequired,
    Component: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.object
    ])
}

export { RadioGroup, Radio }