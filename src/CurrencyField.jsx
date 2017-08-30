'use strict';

import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';

class CurrencyField extends Component {

    constructor(props) {
        super(props);
        this.onInputType = this.onInputType.bind(this);
        this.formatRawValue = this.formatRawValue.bind(this);
        this.parseRawValue = this.parseRawValue.bind(this);
        this.defaultConverter = this.defaultConverter.bind(this);
        this.state = {
            rawValue: this.props.value,
        };
    }

    componentWillMount() {
        this.notifyParentWithRawValue(this.state.rawValue);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value) {
            this.setState({rawValue: nextProps.value});
        }
    }

    onInputType(event) {
        const input = event.target.value;

        let rawValue = this.parseRawValue(input);
        if (!rawValue) {
            rawValue = 0;
        }

        this.notifyParentWithRawValue(rawValue);

        this.setState({rawValue});
    }

    notifyParentWithRawValue(rawValue) {
        const display = this.formatRawValue(rawValue);
        const converter = this.props.converter || this.defaultConverter;
        this.props.onChange(converter(rawValue), display);
    }

    parseRawValue(displayedValue) {
        const value = displayedValue.replace(/[^0-9]/g, '');
        return parseFloat(value);
    }

    formatRawValue(rawValue) {
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

    defaultConverter(val) {
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
        return (parseFloat(`${prefix}.${sufix}`).toFixed(precision))/1;
    }

    render() {
        return (
          <MuiThemeProvider>
            <TextField
                {...this.props}
                onChange={this.onInputType}
                value={this.formatRawValue(this.state.rawValue)} />
          </MuiThemeProvider>
        );
    }

}

/**
 * @deprecated
 */
// CurrencyField.propTypes = {
//     id: React.PropTypes.string,
//     delimiter: React.PropTypes.string,
//     onChange: React.PropTypes.func,
//     precision: React.PropTypes.number,
//     separator: React.PropTypes.string,
//     unit: React.PropTypes.string,
//     value: React.PropTypes.number,
//     converter: React.PropTypes.func,
// };

CurrencyField.defaultProps = {
    id: 'currencyField-' + Math.random(),
    value: 0,
    precision: 2,
    separator: '.',
    delimiter: ',',
    unit: '',
    onChange: () => {},
};

export default CurrencyField;
