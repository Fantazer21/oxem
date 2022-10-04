import 'antd/dist/antd.css';
import {Slider} from 'antd';
import 'antd/dist/antd.css';
import React, { useState } from "react";
import styles from "./App.module.scss";
import OutsideClickHandler from "react-outside-click-handler";


type InputsType = {
    carPrice: number,
    payment: number,
    rate: number,
    period: number,
    monthPayment: number,
    sumOfLeasing: number
}

function App() {

    const [inputs, setInputs] = useState<InputsType>({
        carPrice: 1000000,
        payment: 100000,
        rate: 10,
        period: 1,
        monthPayment: 931500,
        sumOfLeasing: 1031500
    });

    const monthPay = (price: number, initial: number, months: number) => {
        const pay = Math.round((price - initial) * ((0.035 * Math.pow((1 + 0.035), months)) / (Math.pow((1 + 0.035), months) - 1)))
        return pay
    }

    const sumLeasing = (payment: number, period: number, monthPayment: number) => {
        const sum = (payment + (period * monthPayment))
        return sum
    }

    const carPriceCounter = (price: number) => {
        setInputs({
            ...inputs,
            carPrice: price,
            payment: Math.round(price * (inputs.rate / 100))
        })
    }

    const rateCounter = (rate: number) => {
        setInputs({...inputs, rate: rate, payment: Math.round(inputs.carPrice * (rate / 100))})
    }

    const setPayment = (value: number) => {
        setInputs({
            ...inputs,
            payment: value
        })
    }

    const inputsChecker = (obj: InputsType) => {
        if (obj.carPrice < 1000000) {
            setInputs({...inputs, carPrice: 1000000})
        }
        if (obj.carPrice > 6000000) {
            setInputs({...inputs, carPrice: 6000000})
        }

        if (obj.payment < 100000) {
            setInputs({...inputs, payment: 100000})
        }
        if (obj.payment > 600000) {
            setInputs({...inputs, payment: 600000})
        }

        if (obj.period < 1) {
            setInputs({...inputs, period: 10})
        }
        if (obj.period > 60) {
            setInputs({...inputs, period: 60})
        }
    }

    const request = () => {
        const axios = require('axios');

        const config = {
            method: 'POST',
            url: 'https://eoj3r7f3r4ef6v4.m.pipedream.net',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({inputs})
        };

        axios(config)
            .then(function (response: { [key: string]: string | number }) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error: string) {
                console.log(error);
            });
    }

    return (
        <div className={styles.app}>
            <div className={styles.title}>
                Рассчитайте стоимость автомобиля в лизинг
            </div>
            <div className={styles.blockInputs}>
                <div className={styles.inputSection}>
                    <div className={styles.inputTitle}>Стоимость автомобиля</div>
                    <div className={styles.inputWrapper}>
                        <OutsideClickHandler onOutsideClick={() => {
                            inputsChecker(inputs)
                        }}>
                            <div className={styles.leftData}>
                                <input
                                    min={1000000}
                                    max={6000000} maxLength={7} type="text" onChange={(e) => setInputs({
                                    ...inputs, carPrice: +e.currentTarget.value.replace(/[^\d.]/g, '')
                                })} value={inputs.carPrice} className={styles.input}/>

                            </div>
                        </OutsideClickHandler>
                        <div className={styles.rightData}>₽</div>
                    </div>
                    <Slider style={{width: "90%", height: "2px", marginTop: "-8px", marginLeft: "18px"}}
                            trackStyle={{background: "orange", height: "3px"}}
                            handleStyle={{background: "orange", border: "none"}}
                            min={1000000}
                            max={6000000}
                            defaultValue={inputs.carPrice}
                            onChange={(e) => carPriceCounter(e)}
                            disabled={false}/>
                </div>
                <div className={styles.inputSection}>
                    <div className={styles.inputTitle}>Первоначальный взнос</div>
                    <OutsideClickHandler onOutsideClick={() => {
                        inputsChecker(inputs)
                    }}>
                    <div className={styles.inputWrapper}>
                        <div className={styles.leftData}>
                            <input maxLength={7}
                                   onChange={(e) => setPayment(+e.currentTarget.value.replace(/[^\d.]/g, ''))}
                                   value={inputs.payment} className={styles.input}
                                   type="text"/>
                        </div>
                        <div className={styles.rightDataTab}>{inputs.rate}%</div>
                    </div>
                    <Slider style={{width: "90%", height: "2px", marginTop: "-8px", marginLeft: "18px"}}
                            trackStyle={{background: "orange", height: "3px"}}
                            handleStyle={{background: "orange", border: "none"}}
                            min={10}
                            max={60}
                            defaultValue={inputs.rate}
                            onChange={(e) => rateCounter(e)}
                            disabled={false}/>
                    </OutsideClickHandler>
                </div>
                <div className={styles.inputSection}>
                    <div className={styles.inputTitle}>Срок лизинга</div>
                    <div className={styles.inputWrapper}>
                        <OutsideClickHandler onOutsideClick={() => {
                            inputsChecker(inputs)
                        }}>
                        <div className={styles.leftData}>
                            <input maxLength={2} value={inputs.period} className={styles.input}
                                   onChange={(e) => {
                                       setInputs({...inputs, period: +e.currentTarget.value.replace(/[^\d.]/g, '')})
                                   }}
                                   type="text"/>
                        </div>
                        </OutsideClickHandler>
                        <div className={styles.rightData}>мес.</div>
                    </div>
                    <Slider style={{width: "90%", height: "2px", marginTop: "-8px", marginLeft: "18px"}}
                            trackStyle={{background: "orange", height: "3px"}}
                            handleStyle={{background: "orange", border: "none"}}
                            min={1}
                            max={60}
                            defaultValue={inputs.period}
                            onChange={(e) => setInputs({...inputs, period: e})}
                            disabled={false}/>

                </div>
            </div>
            <div className={styles.blockResults}>
                <div className={styles.results}>
                    <div className={styles.inputTitle}>Сумма договора лизинга</div>
                    <div
                        className={styles.leasingAmount}>{sumLeasing(inputs.payment, inputs.period, monthPay(inputs.carPrice, inputs.payment, inputs.period))}</div>
                </div>
                <div className={styles.results}>
                    <div className={styles.inputTitle}>Ежемесячный платеж от</div>
                    <div
                        className={styles.leasingAmount}>{monthPay(inputs.carPrice, inputs.payment, inputs.period)}</div>
                </div>
                <div className={styles.request} onClick={() => request()}>Оставить заявку</div>
                <div></div>
            </div>
        </div>
    )

}

export default App;
