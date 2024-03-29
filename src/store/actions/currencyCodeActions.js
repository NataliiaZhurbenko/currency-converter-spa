import Axios from "axios";
import {
  GET_CODES,
  GET_RATE,
  GET_ALL_RATES,
  GET_ALL_RATES_ERROR,
  GET_ALL_RATES_UNKNOWN_ERROR,
  GET_CODES_UNKNOWN_ERROR,
  GET_RATE_UNKNOWN_ERROR,
} from "../types";

const CURRENCY_CONVERTER_API_KEY =
  process.env.REACT_APP_CURRENCY_CONVERTER_API_KEY;
const ALL_CURRENCIES_LIST_API_KEY =
  process.env.REACT_APP_ALL_CURRENCIES_LIST_API_KEY;

export async function getCountryCodes(dispatch) {
  try {
    const result = await Axios.get(
      `https://free.currconv.com/api/v7/currencies?apiKey=${CURRENCY_CONVERTER_API_KEY}`
    );
    dispatch({
      type: GET_CODES,
      payload: Object.keys(result.data.results),
    });
  } catch (error) {
    dispatch({
      type: GET_CODES_UNKNOWN_ERROR,
      payload: error,
    });
  }
}

export async function getConvertRate(dispatch, countryCodeFrom, countryCodeTo) {
  try {
    const url = `https://free.currconv.com/api/v7/convert?apiKey=${CURRENCY_CONVERTER_API_KEY}&q=${countryCodeFrom}_${countryCodeTo}&compact=ultra`;
    const result = await Axios.get(url);
    const rate = result.data[`${countryCodeFrom}_${countryCodeTo}`];

    dispatch({
      type: GET_RATE,
      payload: rate,
    });
  } catch (error) {
    dispatch({
      type: GET_RATE_UNKNOWN_ERROR,
      payload: error,
    });
  }
}

export async function getAllConvertRates(dispatch, currencyCodeFrom) {
  try {
    const result = await Axios.get(
      `https://currencyapi.net/api/v1/rates?key=${ALL_CURRENCIES_LIST_API_KEY}&base=${currencyCodeFrom}`
    );
    dispatch({
      type: GET_ALL_RATES,
      payload: {
        base: result.data.base,
        rates: result.data.rates,
      },
    });
  } catch (error) {
    if (error.response.data.error && error.response.data.error.code === 408) {
      dispatch({
        type: GET_ALL_RATES_ERROR,
        payload: error.response.data.error,
      });
    } else {
      dispatch({
        type: GET_ALL_RATES_UNKNOWN_ERROR,
        payload: error,
      });
    }
  }
}
