'use strict';

import React, {Component} from 'react';
// import {withStyles} from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';

// const styles = (theme) => ({
//     container: {
//         display: 'flex',
//         flexWrap: 'wrap',
//     },
//     textField: {
//         marginLeft: theme.spacing.unit,
//         marginRight: theme.spacing.unit,
//     },
// });

class CurrencyField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rawValue: this.props.value,
        };
    }

    /**
     * componentWillMount
     */
    componentWillMount() {
        this.notifyParentWithRawValue(this.state.rawValue);
    }

    /**
     * componentWillReceiveProps
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.value) {
            this.setState({rawValue: nextProps.value});
        }
    }

    /**
     * onInputType
     */
    onInputType = (event) => {
        const input = event.target.value;

        let rawValue = this.parseRawValue(input);
        if (!rawValue) {
            rawValue = 0;
        }

        this.notifyParentWithRawValue(rawValue);

        this.setState({rawValue});
    }

    /**
     * notifyParentWithRawValue
     */
    notifyParentWithRawValue(rawValue) {
        const display = this.formatRawValue(rawValue);
        const converter = this.props.converter || this.defaultConverter;
        this.props.onChange(converter(rawValue), display);
    }

    /**
     * parseRawValue
     */
     parseRawValue = (displayedValue) => {
         const value = displayedValue.replace(/[^0-9]/g, '');
         if (this.props.separator === '.') {
             return parseFloat(value);
         } else {
             return this.applyPrecisionToRawValue(value);
         }
     }

    /**
     * applyPrecisionToRawValue
     * Handles applying the precision decimal to a raw value
     */
    applyPrecisionToRawValue = (rawValue) => {
        const minChars = '0'.length + this.props.precision;

        let result = `${rawValue}`;

        if (result.length < minChars) {
            const numbers = minChars - result.length;
            const leftZeroPad = new String(0).repeat(numbers);
            result = `${leftZeroPad}${result}`;
        }

        const beforeSeparator = result.slice(0, result.length - this.props.precision);
        const afterSeparator = result.slice(result.length - this.props.precision);

        result = beforeSeparator + this.props.separator + afterSeparator;

        if (this.props.separator === '.') {
            return parseFloat(result, this.props.precision);
        } else {
            return result;
        }
    }

    /**
     * formatRawValue
     */
     formatRawValue = (rawValue) => {
         const minChars = '0'.length + this.props.precision;

         let result = `${rawValue}`;

         if (result.length < minChars) {
             const numbers = minChars - result.length;
             const leftZeroPad = new String(0).repeat(numbers);
             result = `${leftZeroPad}${result}`;
         }

         let beforeSeparator = result.slice(0, result.length - this.props.precision);
         const afterSeparator = result.slice(result.length - this.props.precision);

         if (beforeSeparator.length > 3) {
             const chars = beforeSeparator.split('').reverse();
             let withDots = '';

             for (let i = chars.length - 1; i >= 0; i--) {
                 const char = chars[i];
                 const dot = i % 3 === 0 ? this.props.delimiter : '';
                 withDots = `${withDots}${char}${dot}`;
             }

             withDots = withDots.substring(0, withDots.length - 1);
             beforeSeparator = withDots;
         }

         result = beforeSeparator + this.props.separator + afterSeparator;

         if (this.props.unit) {
             result = `${this.props.unit} ${result}`;
         }

         return result;
     }

    /**
     * defaultConverter
     */
    defaultConverter = (val) => {
        const {precision} = this.props;
        const raw = val.toString();

        if (Number.isNaN(parseFloat(raw))) {
            return 0;
        }

        if (!raw.length) {
            return parseFloat(raw);
        }

        if (precision >= raw.length) {
            return parseFloat(raw);
        }

        const prefix = raw.slice(0, raw.length - precision);
        const sufix = raw.slice(raw.length - precision, raw.length);
        return (parseFloat(`${prefix}.${sufix}`).toFixed(precision)) / 1;
    }

    render() {
        const {id, hintText, underlineShow, required} = this.props;
        return (
            <TextField
                id={id}
                onChange={this.onInputType}
                hinttext={hintText}
                underlinestyle={(underlineShow) ? {display: 'none'} : {}}
                required={required}
                value={this.formatRawValue(this.state.rawValue)}
            />
        );
    }
}

CurrencyField.defaultProps = {
    id: `currencyField-${Math.random()}`,
    value: 0,
    hintText: '',
    precision: 2,
    separator: '.',
    underlineShow: false,
    delimiter: ',',
    required: false,
    unit: '',
    onChange: () => {},
};

CurrencyField.propTypes = {
    id: PropTypes.string,
    value: PropTypes.number,
    hintText: PropTypes.string,
    precision: PropTypes.number,
    separator: PropTypes.string,
    underlineShow: PropTypes.bool,
    delimiter: PropTypes.string,
    required: PropTypes.bool,
    unit: PropTypes.string,
    onChange: PropTypes.func,
};

export default CurrencyField;
