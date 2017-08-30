/* eslint-disable no-unused-vars */
'use strict';

jest.unmock('../../src/CurrencyField');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import CurrencyField from '../../src/CurrencyField';

describe('CurrencyField', () => {

    it('parseRawValue', () => {
        let currencyField = TestUtils.renderIntoDocument(
            <CurrencyField
                precision={2}
                separator=','
                delimiter='.'
                unit='R$'/>
        );

        expect(currencyField.parseRawValue('R$ 1.000,00')).toEqual(100000);
        expect(currencyField.parseRawValue('R$ 2,20')).toEqual(220);
        expect(currencyField.parseRawValue('R$ 0,00')).toEqual(0);
    });

    it('parseDollarRawValue', () => {
        let currencyField = TestUtils.renderIntoDocument(
            <CurrencyField
                precision={2}
                separator='.'
                delimiter=','
                unit='US$'/>
        );

        expect(currencyField.parseRawValue('US$ 100,000.40')).toEqual(100000.4);
        expect(currencyField.parseRawValue('US$ 2.20')).toEqual(2.2);
        expect(currencyField.parseRawValue('US$ 0.04')).toEqual(0.04);
    });

    it('onChange', () => {
        let currencyField = TestUtils.renderIntoDocument(
            <CurrencyField
                precision={2}
                separator='.'
                delimiter=','
                unit='US$'
                value={1000250}
                onChange={(raw, display) => {
                    console.log(raw);
                    console.log(display);
                    expect(raw).toEqual(10002.5);
                }}/>
        );

        TestUtils.Simulate.change(currencyField);
    });

    it('notifyParentWithRawValue empty', () => {
        let currencyField = TestUtils.renderIntoDocument(
            <CurrencyField
                precision={2}
                separator='.'
                delimiter=','
                unit='US$'
                onChange={(raw, display) => {
                    expect(raw).toEqual(0);
                }}/>
        );

        currencyField.notifyParentWithRawValue('');
    });

    it('notifyParentWithRawValue valid', () => {
        TestUtils.renderIntoDocument(
            <CurrencyField
                precision={2}
                separator='.'
                delimiter=','
                unit='US$'
                value={2010014}
                onChange={(raw, display) => {
                    expect(raw).toEqual(20100.14);
                }}/>
        );

        TestUtils.renderIntoDocument(
            <CurrencyField
                value={10}
                onChange={(raw, display) => {
                    expect(raw).toEqual(10);
                }}/>
        );

        TestUtils.renderIntoDocument(
            <CurrencyField
                value={100}
                onChange={(raw, display) => {
                    expect(raw).toEqual(1);
                }}/>
        );

        TestUtils.renderIntoDocument(
            <CurrencyField
                precision={1}
                value={100}
                onChange={(raw, display) => {
                    expect(raw).toEqual(10.00);
                }}/>
        );
    });

});
