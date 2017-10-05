'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TextField = require('material-ui/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import {withStyles} from 'material-ui/styles';


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

var CurrencyField = function (_Component) {
    _inherits(CurrencyField, _Component);

    function CurrencyField(props) {
        _classCallCheck(this, CurrencyField);

        var _this = _possibleConstructorReturn(this, (CurrencyField.__proto__ || Object.getPrototypeOf(CurrencyField)).call(this, props));

        _this.onInputType = function (event) {
            var input = event.target.value;

            var rawValue = _this.parseRawValue(input);
            if (!rawValue) {
                rawValue = 0;
            }

            _this.notifyParentWithRawValue(rawValue);

            _this.setState({ rawValue: rawValue });
        };

        _this.parseRawValue = function (displayedValue) {
            var value = displayedValue.replace(/[^0-9]/g, '');
            if (_this.props.separator === '.') {
                return parseFloat(value);
            } else {
                return _this.applyPrecisionToRawValue(value);
            }
        };

        _this.applyPrecisionToRawValue = function (rawValue) {
            var minChars = '0'.length + _this.props.precision;

            var result = '' + rawValue;

            if (result.length < minChars) {
                var numbers = minChars - result.length;
                var leftZeroPad = new String(0).repeat(numbers);
                result = '' + leftZeroPad + result;
            }

            var beforeSeparator = result.slice(0, result.length - _this.props.precision);
            var afterSeparator = result.slice(result.length - _this.props.precision);

            result = beforeSeparator + _this.props.separator + afterSeparator;

            if (_this.props.separator === '.') {
                return parseFloat(result, _this.props.precision);
            } else {
                return result;
            }
        };

        _this.formatRawValue = function (rawValue) {
            var minChars = '0'.length + _this.props.precision;

            var result = '' + rawValue;

            if (result.length < minChars) {
                var numbers = minChars - result.length;
                var leftZeroPad = new String(0).repeat(numbers);
                result = '' + leftZeroPad + result;
            }

            var beforeSeparator = result.slice(0, result.length - _this.props.precision);
            var afterSeparator = result.slice(result.length - _this.props.precision);

            if (beforeSeparator.length > 3) {
                var chars = beforeSeparator.split('').reverse();
                var withDots = '';

                for (var i = chars.length - 1; i >= 0; i--) {
                    var char = chars[i];
                    var dot = i % 3 === 0 ? _this.props.delimiter : '';
                    withDots = '' + withDots + char + dot;
                }

                withDots = withDots.substring(0, withDots.length - 1);
                beforeSeparator = withDots;
            }

            result = beforeSeparator + _this.props.separator + afterSeparator;

            if (_this.props.unit) {
                result = _this.props.unit + ' ' + result;
            }

            return result;
        };

        _this.defaultConverter = function (val) {
            var precision = _this.props.precision;

            var raw = val.toString();

            if (Number.isNaN(parseFloat(raw))) {
                return 0;
            }

            if (!raw.length) {
                return parseFloat(raw);
            }

            if (precision >= raw.length) {
                return parseFloat(raw);
            }

            var prefix = raw.slice(0, raw.length - precision);
            var sufix = raw.slice(raw.length - precision, raw.length);
            return parseFloat(prefix + '.' + sufix).toFixed(precision) / 1;
        };

        _this.state = {
            rawValue: _this.props.value
        };
        return _this;
    }

    /**
     * componentWillMount
     */


    _createClass(CurrencyField, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.notifyParentWithRawValue(this.state.rawValue);
        }

        /**
         * componentWillReceiveProps
         */

    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.value) {
                this.setState({ rawValue: nextProps.value });
            }
        }

        /**
         * onInputType
         */

    }, {
        key: 'notifyParentWithRawValue',


        /**
         * notifyParentWithRawValue
         */
        value: function notifyParentWithRawValue(rawValue) {
            var display = this.formatRawValue(rawValue);
            var converter = this.props.converter || this.defaultConverter;
            this.props.onChange(converter(rawValue), display);
        }

        /**
         * parseRawValue
         */


        /**
         * applyPrecisionToRawValue
         * Handles applying the precision decimal to a raw value
         */


        /**
         * formatRawValue
         */


        /**
         * defaultConverter
         */

    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                id = _props.id,
                hintText = _props.hintText,
                underlineShow = _props.underlineShow,
                required = _props.required;

            return _react2.default.createElement(_TextField2.default, {
                id: id,
                onChange: this.onInputType,
                hinttext: hintText,
                underlinestyle: underlineShow ? { display: 'none' } : {},
                required: required,
                value: this.formatRawValue(this.state.rawValue)
            });
        }
    }]);

    return CurrencyField;
}(_react.Component);

CurrencyField.defaultProps = {
    id: 'currencyField-' + Math.random(),
    value: 0,
    hintText: '',
    precision: 2,
    separator: '.',
    underlineShow: false,
    delimiter: ',',
    required: false,
    unit: '',
    onChange: function onChange() {}
};

CurrencyField.propTypes = {
    id: _propTypes2.default.string,
    value: _propTypes2.default.number,
    hintText: _propTypes2.default.string,
    precision: _propTypes2.default.number,
    separator: _propTypes2.default.string,
    underlineShow: _propTypes2.default.bool,
    delimiter: _propTypes2.default.string,
    required: _propTypes2.default.bool,
    unit: _propTypes2.default.string,
    onChange: _propTypes2.default.func
};

exports.default = CurrencyField;