import { useState, useEffect } from 'react';
import { useFormik } from "formik";
import * as yup from 'yup';
import customerService from '../../services/customerService'
import { Box, Button, TextField, Autocomplete, Stack, Switch, Divider, Chip } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const TAX_RATE = 0.07;

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function priceRow(qty, unit) {
  return qty * unit;
}

function createRow(desc, qty, unit) {
  const price = priceRow(qty, unit);
  return { desc, qty, unit, price };
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const rows = [
  createRow('Paperclips (Box)', 100, 1.15),
  createRow('Paper (Case)', 10, 45.99),
  createRow('Waste Basket', 2, 17.99),
];

const invoiceSubtotal = subtotal(rows);
const invoiceTaxes = TAX_RATE * invoiceSubtotal;
const invoiceTotal = invoiceTaxes + invoiceSubtotal;

export default function Salesorder() {
    const [cn, setCn] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [value, setValue] = useState('');
    // const [customer, setCustomer] = useState(''); DELETE ME SOON
    const [mode, setMode] = useState('view');
    const [options, setOptions] = useState([]); // autocoplete options
    const [auto, setAuto] = useState(''); // Which autocomplete is user in?
    const [debug, setDebug] = useState(false);
    const [open, setOpen] = useState(false);
 
    const formik = useFormik({
        initialValues: {
            name: '',
            address: '',
            address2: '',
            city: '',
            state: '',
            postalcode: '',
            stname: '',
            staddress: '',
            staddress2: '',
            stcity: '',
            ststate: '',
            stpostalcode: '',
            stlat: '',
            stlong: '',
            phone: '',
            email: '',
            markup:'',
        },
        onSubmit: (values, { resetForm }) => {
            alert(JSON.stringify(values, null, 2));
            handleSubmit();
            resetForm();
            setCn('');
        }
  },
);

    // GET CUSTOMER LOGIC
      const getCust = async () => {
        if (cn === '') return
        const res = await customerService.get(cn)
        if (typeof res === 'undefined') {
            setCn('');
            return alert('No Customer Found with id '+ cn)} 
        updateField("name",res.name);
        updateField("address",res.address);
        if (res.address2 !== 'undefined') {updateField("address2",res.address2)}; 
        updateField("city",res.city);
        updateField("state",res.state);
        updateField("postalcode",res.postalcode);
        updateField("stname",res.stname);
        updateField("staddress",res.staddress);
        if (res.staddress2 !== 'undefined') {updateField("staddress2",res.staddress2)}; 
        updateField("stcity",res.stcity);
        updateField("ststate",res.ststate);
        updateField("stpostalcode",res.stpostalcode);
        updateField("stlat",res.stlat);
        updateField("stlong",res.stlong);
        updateField("phone",res.phone);
        updateField("email",res.email);
        updateField("markup",res.markup);
    };

    // ADDRESS VALIDATION FROM HERE.COM LOGIC
    // SET UP URL FOR FETCH TO HERE
    const getUrl = () => {
        console.log('inputValue in getAddress: ',inputValue)
        let base = 'https://autocomplete.search.hereapi.com/v1/autocomplete?q='
        let addr = encodeURIComponent(`${inputValue}`)
        let cc = '&in=countryCode:USA'
        let apiKey = '&apiKey='+process.env.REACT_APP_HERE_API_KEY;
        const url = base+addr+cc+apiKey
        return url
    }

    useEffect(() => {
      getCust()
    }, [cn])
    

    //AUTOCOMPLETE LOGIC FOR CUST SEARCH & FETCH ADDRESS MATCHES FROM HERE 
    useEffect(() => {
        const getData = setTimeout(() => {     //add for debounce
            let active = true
                
            if (inputValue === '') {
                setOptions(value ? [value] : []);
                return undefined
            }

            if (auto === 'cust') {
                let res = customerService.search(inputValue)
                // console.log('custSearch in useEffect',res)
                .then(res => {
                    if (active) {  
                        if (res) {
                            setOptions(res);
                        }
                    }
                })

            } else {
                let url2 = getUrl()
                fetch(url2)
                .then(response => response.json())
                .then(response => response.items)
                .then(response => {
                if (active) {  
                    if (response) {
                        setOptions(response);
                        }
                    }
                })
            }
            
            return () => {
                active = false;
            }
        }, 1200)  ///add for debounce
        return () => clearTimeout(getData)   ///add for debounce
    }, [inputValue])

    // SUBMIT ORDER FORM
    const handleSubmit = async (e) => {
        // e.preventDefault()
        console.log('in hadleSubmit, mode is ', mode)
        if (mode === "edit") {
            let updateData = {"_id": cn, ...formik.values }
            console.log('SAVE clicked in Customer Admin UPDATE: ',updateData);
            customerService.update(updateData);
            setMode('view');
        } else {
            console.log('SAVE clicked in Customer Admin NEW: ',formik.values);
            customerService.create(formik.values)
            setMode('view');
        }
    }

    // RANDOM UTILITY FUNCTIONS

    const toggleDebug = (event) => {
        setDebug(event.target.checked)
    };

    const updateField = (name, newval) => {
        formik.setFieldValue(name, newval)
    }
    const pressEnter = (e) => {
        if (e.key === 'Enter') {
          getCust(e.target.value)
    }}


  return (
    <>
    <h2>Order Entry</h2>
    <h3>Version 1 MUI Table</h3>
    <Paper elevation={6} sx={{m: "25px"}}>
    <Autocomplete
        id="custlookup"
        size="small"
        autoFocus
        sx={{width: '50%', p: "1%"}}
        // disabled={ mode!=="view" ? false : true }
        getOptionLabel={(option) =>
            typeof option === 'string' ? option : ''
        }
        filterOptions={(x) => x}
        options={options}
        value={value}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        noOptionsText="No customers match your search."
        onChange={(event, newValue) => {
            setCn(newValue._id);
            setAuto('cust');
            console.log('newValue: ',newValue );
        }}
        onInputChange={(event, newInputValue) => {
            setAuto('cust');
            setInputValue(newInputValue);
        }}
        renderInput={(params) => (
            <TextField {...params} label="Enter Customer" fullWidth />
        )}
        renderOption={(props, option) => {
            return <p  {...props} key={option._id}>{`${typeof option === 'object' ? `${option.name} ${option.city} ${option.state}` : 'No Values'}`}</p>
        }}
    />
    <p>Customer ID: {cn}</p>
    <p>{formik.values.name}</p>
    <p>{formik.values.address}</p>
    <p>{formik.values.address2}</p>
    <p>{formik.values.city} {formik.values.state} {formik.values.postalcode}</p>
    
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={3}>
              Details
            </TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Desc</TableCell>
            <TableCell align="right">Qty.</TableCell>
            <TableCell align="right">New Qty</TableCell>
            <TableCell align="right">Unit</TableCell>
            <TableCell align="right">Sum</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.desc}>
              <TableCell>{row.desc}</TableCell>
              <TableCell align="right">{row.qty}</TableCell>
              <TextField>{row.qty}</TextField>
              <TableCell align="right">{row.unit}</TableCell>
              <TableCell align="right">{ccyFormat(row.price)}</TableCell>
            </TableRow>
          ))}

          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Tax</TableCell>
            <TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    </Paper>

    <h3>Version 2 - React-Table</h3>
    <Paper elevation={6} sx={{m: "25px"}}>
    <Autocomplete
        id="custlookup"
        size="small"
        autoFocus
        sx={{width: '50%', p: "1%"}}
        // disabled={ mode!=="view" ? false : true }
        getOptionLabel={(option) =>
            typeof option === 'string' ? option : ''
        }
        filterOptions={(x) => x}
        options={options}
        value={value}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        noOptionsText="No customers match your search."
        onChange={(event, newValue) => {
            setCn(newValue._id);
            setAuto('cust');
            console.log('newValue: ',newValue );
        }}
        onInputChange={(event, newInputValue) => {
            setAuto('cust');
            setInputValue(newInputValue);
        }}
        renderInput={(params) => (
            <TextField {...params} label="Enter Customer" fullWidth />
        )}
        renderOption={(props, option) => {
            return <p  {...props} key={option._id}>{`${typeof option === 'object' ? `${option.name} ${option.city} ${option.state}` : 'No Values'}`}</p>
        }}
    />
    <p>Customer ID: {cn}</p>
    <p>{formik.values.name}</p>
    <p>{formik.values.address}</p>
    <p>{formik.values.address2}</p>
    <p>{formik.values.city} {formik.values.state} {formik.values.postalcode}</p>
 
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={3}>
              Details
            </TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Desc</TableCell>
            <TableCell align="right">Qty.</TableCell>
            <TableCell align="right">New Qty</TableCell>
            <TableCell align="right">Unit</TableCell>
            <TableCell align="right">Sum</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.desc}>
              <TableCell>{row.desc}</TableCell>
              <TableCell align="right">{row.qty}</TableCell>
              <TextField>{row.qty}</TextField>
              <TableCell align="right">{row.unit}</TableCell>
              <TableCell align="right">{ccyFormat(row.price)}</TableCell>
            </TableRow>
          ))}

          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Tax</TableCell>
            <TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    </Paper>
    </>
  );
}
