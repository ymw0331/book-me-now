import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { DatePicker, Select } from 'antd';
import { read } from '../actions/hotel';
import { useSelector } from 'react-redux';

const { Option } = Select;

const EditHotel = () =>
{
  useEffect( () =>
  {

    console.log({match})
  }, [] );


};

export default EditHotel;