/* eslint-disable no-unused-vars */
'use strict';

jest.unmock('../../src/CurrencyField');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import CurrencyField from '../../src/CurrencyField';

describe('CurrencyField', () => {
    it('parseRawValue', () => {
        const currencyField = TestUtils.renderIntoDocument(
            <CurrencyField
                precision={2}
                separator=","
                delimiter="."
                unit="R$" />
        );

        expect(currencyField.parseRawValue('R$ 1.000,00')).toEqual('1000,00');
        expect(currencyField.parseRawValue('R$ 2,20')).toEqual('2,20');
        expect(currencyField.parseRawValue('R$ 0,00')).toEqual('0,00');
    });

    // it('parseDollarRawValue', () => {
    //     let currencyField = TestUtils.renderIntoDocument(
    //         <CurrencyField
    //             precision={2}
    //             separator='.'
    //             delimiter=','
    //             unit='$'/>
    //     );
    //
    //     expect(currencyField.parseRawValue('$ 100,000.40')).toEqual(100000.40);
    //     expect(currencyField.parseRawValue('$ 2.20')).toEqual(2.20);
    //     expect(currencyField.parseRawValue('$ 0.04')).toEqual(0.04);
    // });

    it('onChange', () => {
        const currencyField = TestUtils.renderIntoDocument(
            <div>
                <CurrencyField
                    precision={2}
                    separator="."
                    delimiter=","
                    unit="US$"
                    value={1000250}
                    onChange={(raw, display) => {
                        expect(raw).toEqual(10002.50);
                    }} />
            </div>
        );

        try {
            TestUtils.Simulate.change(currencyField);
        } catch (err) {
            console.log(err);
        }
    });

    it('notifyParentWithRawValue empty', () => {
        const currencyField = TestUtils.renderIntoDocument(
            <CurrencyField
                precision={2}
                separator="."
                delimiter=","
                unit="US$"
                onChange={(raw, display) => {
                    expect(raw).toEqual(0);
                }} />
        );

        currencyField.notifyParentWithRawValue('');
    });

    it('notifyParentWithRawValue valid', () => {
        TestUtils.renderIntoDocument(
            <CurrencyField
                precision={2}
                separator="."
                delimiter=","
                unit="US$"
                value={2010014}
                onChange={(raw, display) => {
                    expect(raw).toEqual(20100.14);
                }} />
        );

        TestUtils.renderIntoDocument(
            <CurrencyField
                value={10}
                onChange={(raw, display) => {
                    expect(raw).toEqual(10);
                }} />
        );

        TestUtils.renderIntoDocument(
            <CurrencyField
                value={100}
                onChange={(raw, display) => {
                    expect(raw).toEqual(1);
                }} />
        );

        TestUtils.renderIntoDocument(
            <CurrencyField
                precision={1}
                value={100}
                onChange={(raw, display) => {
                    expect(raw).toEqual(10.00);
                }} />
        );
    });
});
