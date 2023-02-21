import { useState, useEffect } from 'react';
import { useFormik } from "formik";
import * as yup from 'yup';
import customerService from '../../services/customerService'
// import { CustomerNav } from "./customernav.jsx";
import { Box, Button, TextField, Autocomplete, Switch, Divider, Chip } from '@mui/material';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


    // VALIDATION IF ADDING A NEW CUSTOMER
    const validationSchema = yup.object({
        name: yup
        .string('Needs to be a string')
        .required('Name is required'),
        address: yup
        .string('Needs to be a string')
        .required('Address is required'),
        address2: yup
        .string('Needs to be a string'),
        city: yup
        .string('Needs to be a string')
        .required('City is required'),
        state: yup
        .string('Needs to be a string')
        .required('State is required'),
        postalcode: yup
        .string('Needs to be a string')
        .required('Zip Code is required'),
        stname: yup
        .string('Needs to be a string')
        .required('Name is required'),
        staddress: yup
        .string('Needs to be a string')
        .required('Address is required'),
        staddress2: yup
        .string('Needs to be a string'),
        stcity: yup
        .string('Needs to be a string')
        .required('City is required'),
        ststate: yup
        .string('Needs to be a string')
        .required('State is required'),
        stpostalcode: yup
        .string('Needs to be a string')
        .required('Zip Code is required'),
        stlat: yup
        .string('Needs to be a string'),
        stlong: yup
        .string('Needs to be a string'),
        phone: yup
        .string('Needs to be a string'),
        email: yup
        .string('Needs to be a string'),
        markup: yup
        .number('Needs to be a number'),
    });
    
export default function Customer() {
    const [cn, setCn] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [value, setValue] = useState('');
    const [customer, setCustomer] = useState('');
    const [mode, setMode] = useState('view');
    const [options, setOptions] = useState([]); // autocoplete options
    const [auto, setAuto] = useState(''); // Which autocomplete is user in?
    const [edit, setEdit] = useState(false);
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
        validationSchema: validationSchema,
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

    // // DELETE ITEM LOGIC
    const deleteCust = async () => {
        try {
        const delCus = await customerService.del(cn)
        console.log('delCus; ',delCus)
        console.log('DELETE CUST called with: ',cn);
        formik.resetForm({ values: ''});
        setCn('');
        handleClose();
        } catch (err) {
            console.log(err);
            alert(err);
            formik.resetForm({ values: ''});
            handleClose();
            setCn('');
        }
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

    const setAddrs = (newValue) => {
        if (newValue) {
        // setLabel(newValue.address.label);
        updateField("address",newValue.address.houseNumber + ' ' + newValue.address.street);
        updateField("city",newValue.address.city);
        updateField("state",newValue.address.stateCode);
        updateField("postalcode",newValue.address.postalCode);
        }
    }
    const setAddrsST = (newValue) => {
        if (newValue) {
        // setLabel(newValue.address.label);
        updateField("staddress",newValue.address.houseNumber + ' ' + newValue.address.street);
        updateField("stcity",newValue.address.city);
        updateField("ststate",newValue.address.stateCode);
        updateField("stpostalcode",newValue.address.postalCode);
        }
    }

    const copyAddr2ST = () => {
        updateField("stname",formik.values.name);
        updateField("staddress",formik.values.address);
        updateField("staddress2",formik.values.address2);
        updateField("stcity",formik.values.city);
        updateField("ststate",formik.values.state);
        updateField("stpostalcode",formik.values.postalcode);
    }

    // GET GEOCODE FOR LOCATION - NEED IF ADDRESS IS CHANGED
    const updateGeo = () => {
        let base = 'https://geocode.search.hereapi.com/v1/geocode?q='
        let addr = encodeURIComponent(`${formik.values.address},${formik.values.address2},${formik.values.city},${formik.values.state},${formik.values.postalcode}`)
        let apiKey = '&apiKey='+process.env.REACT_APP_HERE_API_KEY;
        const url = base+addr+apiKey
        fetch(url)
        .then(response => response.json())
        .then(info => {
            formik.setFieldValue('stlat', info.items[0].position.lat)
            formik.setFieldValue('stlong',info.items[0].position.lng)
            })
        .catch(err => console.log(err))
    }

    // UPDATE CUSTOMER LOGIC    
    // UPDATE CUSTOMER AND CLEAR FORM
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

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        setMode(event.target.value);
      };
        
    return (
        <div>
            {/* <CustomerNav/> */}
            {/* FORM HEADER CONTROL BUTTONS, ETC */}
                <form onSubmit={formik.handleSubmit}>
                <TextField
                        id="cn" label="Search by Customer Number" required margin='normal' 
                        sx={{ width: '30%' }}
                        // inputRef={input => input && input.focus()}
                        // autoFocus
                        disabled={mode!=="addnew" ? false : true}
                        value={cn}
                        onChange={(e) => setCn(e.target.value)}
                        onKeyDown={(e) => pressEnter(e)}
                    />
                <Button
                    variant='contained'
                    size='small'
                    sx={{ ml: "1rem", mt: '1rem', mr: "2rem", width: '8%', height: '2.5rem' }}
                    onClick={() => { getCust(cn) }}
                    >Search
                </Button>
                {/* NEW CUSTOMER SEARCH INPUT */}
                <Autocomplete
                            id="custlookup"
                            autoFocus
                            sx={{width: '80%'}}
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
                                <TextField {...params} label="Customer Search" fullWidth />
                            )}
                            renderOption={(props, option) => {
                                return <p  {...props} key={option._id}>{`${typeof option === 'object' ? `${option.name} ${option.city} ${option.state}` : 'No Values'}`}</p>
                            }}
                            />
                <FormControl component="fieldset">
                <FormLabel component="legend">Mode</FormLabel>
                    <RadioGroup row aria-label="gender" name="gender1" value={mode} onChange={handleChange}>
                        <FormControlLabel value="view" control={<Radio />} label="View" />
                        <FormControlLabel value="edit" control={<Radio />} label="Edit" />
                        <FormControlLabel value="addnew" control={<Radio />} label="Add New" />
                    </RadioGroup>
                </FormControl>
                <Button 
                    color="primary"
                    variant="contained"
                    sx={{ ml: "1rem", mt: '1rem', width: '14%', height: '2.5rem' }} fullWidth
                    type="submit"
                    disabled={mode!=="view" ? false : true}
                    // onClick={formik.handleSubmit}
                    >
                    {mode==="addnew" ? "Add New" : "Save"}
                </Button>
                <Button variant="contained" color="error" sx={{ ml: "5rem", mt: '1rem', width: '6%', height: '2.5rem' }}onClick={handleClickOpen}>
                Delete
                </Button>
                <Dialog
                    open={open}
                    // maxWidth={"lg"}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                    {"YOU ARE ABOUT TO DELETE A CUSTOMER RECORD!"}
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to DELETE {formik.values.name}? The deletion will be permanent. 
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} autoFocus>Disagree</Button>
                    <Button onClick={deleteCust} >Agree</Button>
                    </DialogActions>
                </Dialog>
                {/* MAILING ADDRESS SECTION */}
                <Divider textAlign="left" sx={{ mt: '2rem', mb: '2rem'}}>
                        <Chip icon={<MarkunreadMailboxIcon />} color="primary" variant="outlined" label="Mailing Address" />
                    </Divider>
                <Box sx={{ flexGrow: 1 }}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1}}>    
                        <Grid xs={12}>
                            <TextField
                            sx={{ width: '80%', textTransform: 'uppercase' }} 
                            id="name"
                            name="name"
                            label="Name"
                            defaultChecked
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.name.toUpperCase()}
                            onChange={formik.handleChange}
                            onBlur={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        </Grid>
                        <Grid xs={12}>
                        <Autocomplete
                            id="addresslookup"
                            sx={{width: '80%', textTransform: 'uppercase'}}
                            disabled={ mode!=="view" ? false : true }
                            getOptionLabel={(option) =>
                                typeof option === 'string' ? option : ''
                            }
                            filterOptions={(x) => x}
                            options={options}
                            value={value}
                            noOptionsText="No locations"
                            onChange={(event, newValue) => {
                                setAddrs(newValue);
                            }}
                            onInputChange={(event, newInputValue) => {
                                setAuto('address');
                                setInputValue(newInputValue);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Look up address" fullWidth />
                            )}
                            renderOption={(props, option) => {
                                return <p  {...props} key={option.id}>{`${typeof option === 'object' ? `${option.address.label}` : 'No Values'}`}</p>
                            }}
                            /></Grid>
                        <Grid xs={12}><TextField
                            sx={{ width: '80%', textTransform: 'uppercase' }} 
                            id="address"
                            name="address"
                            label="Address"
                            type="address"
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.address.toUpperCase()}
                            onChange={formik.handleChange}
                            onBlur={formik.handleChange}
                            error={formik.touched.address && Boolean(formik.errors.address1)}
                            helperText={formik.touched.address && formik.errors.address}
                        /></Grid>
                        <Grid xs={12}><TextField
                            sx={{ width: '80%', textTransform: 'uppercase' }} 
                            id="address2"
                            name="address2"
                            label="Address Line 2 (optional)"
                            type="address2"
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.address2}
                            onChange={formik.handleChange}
                            onBlur={formik.handleChange}
                            error={formik.touched.address2 && Boolean(formik.errors.address2)}
                            helperText={formik.touched.address2 && formik.errors.address2}
                        /></Grid>
                        <Grid xs={4}><TextField
                            sx={{ width: '100%', textTransform: 'uppercase' }} 
                            id="city"
                            name="city"
                            label="City"
                            type="city"
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.city.toUpperCase()}
                            onChange={formik.handleChange}
                            onBlur={formik.handleChange}
                            error={formik.touched.city && Boolean(formik.errors.city)}
                            helperText={formik.touched.city && formik.errors.city}
                        /></Grid>
                        <Grid xs={3}><TextField
                            sx={{ width: '100%', textTransform: 'uppercase' }}
                            id="state"
                            name="state"
                            label="State"
                            type="state"
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.state}
                            onChange={formik.handleChange}
                            error={formik.touched.state && Boolean(formik.errors.state)}
                            helperText={formik.touched.state && formik.errors.state}
                        /></Grid>
                        <Grid xs={3}><TextField
                            fullWidth
                            id="postalcode"
                            name="postalcode"
                            label="Zip Code"
                            type="postalcode"
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.postalcode}
                            onChange={formik.handleChange}
                            error={formik.touched.postalcode && Boolean(formik.errors.postalcode)}
                            helperText={formik.touched.postalcode && formik.errors.postalcode}
                        /></Grid>
                    </Grid>
                    {/* SHIP TO ADDRESS SECTION */}
                    <Divider textAlign="left" sx={{ mt: '2rem', mb: '2rem'}}>
                        <Chip icon={<LocalShippingIcon />} color="primary" variant="outlined" label="Ship To Address" />
                    </Divider>
                    <Button
                        variant='contained'
                        disabled={ mode!=="view" ? false : true }
                        size='small'
                        sx={{ mt: "0rem", mb: '1rem', width: '35%', height: '2.5rem' }}
                        onClick={() => { copyAddr2ST() }}
                        >Copy Mailing Address to Ship To Address
                    </Button>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1}}>    
                        <Grid xs={12}>
                            <TextField
                            sx={{ width: '80%', textTransform: 'uppercase' }} 
                            id="stname"
                            name="stname"
                            label="Ship To Name"
                            defaultChecked
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.stname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleChange}
                            error={formik.touched.stname && Boolean(formik.errors.stname)}
                            helperText={formik.touched.stname && formik.errors.stname}
                        />
                        </Grid>
                        <Grid xs={12}>
                        <Autocomplete
                            id="staddresslookup"
                            sx={{width: '80%'}}
                            disabled={ mode!=="view" ? false : true }
                            getOptionLabel={(option) =>
                                typeof option === 'string' ? option : ''  //no idea what this line does
                            }
                            filterOptions={(x) => x}
                            options={options}
                            value={value}
                            noOptionsText="No locations"
                            onChange={(event, newValue) => {
                                setAddrsST(newValue);
                            }}
                            onInputChange={(event, newInputValue) => {
                                setAuto('address');
                                setInputValue(newInputValue);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Look up address" fullWidth />
                            )}
                            renderOption={(props, option) => {
                                return <p  {...props} key={option.id}>{`${typeof option === 'object' ? `${option.address.label}` : 'No Values'}`}</p>
                            }}
                            /></Grid>
                        <Grid xs={12}><TextField
                            sx={{ width: '80%', textTransform: 'uppercase' }} 
                            id="staddress"
                            name="staddress"
                            label="Ship To Address"
                            type="staddress"
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.staddress}
                            onChange={formik.handleChange}
                            onBlur={formik.handleChange}
                            error={formik.touched.staddress && Boolean(formik.errors.staddress)}
                            helperText={formik.touched.staddress && formik.errors.staddress}
                        /></Grid>
                        <Grid xs={12}><TextField
                            sx={{ width: '80%', textTransform: 'uppercase' }} 
                            id="staddress2"
                            name="staddress2"
                            label="Ship To Address Line 2 (optional)"
                            type="staddress2"
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.staddress2}
                            // value={typeof formik.values.staddress2!=='undefined' ? formik.values.staddress2 : ''}
                            onChange={formik.handleChange}
                            onBlur={formik.handleChange}
                            error={formik.touched.staddress2 && Boolean(formik.errors.staddress2)}
                            helperText={formik.touched.staddress2 && formik.errors.staddress2}
                        /></Grid>
                        <Grid xs={4}><TextField
                            sx={{ width: '100%', textTransform: 'uppercase' }}
                            id="stcity"
                            name="stcity"
                            label="Ship To City"
                            type="stcity"
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.stcity}
                            onChange={formik.handleChange}
                            onBlur={formik.handleChange}
                            error={formik.touched.stcity && Boolean(formik.errors.stcity)}
                            helperText={formik.touched.stcity && formik.errors.stcity}
                        /></Grid>
                        <Grid xs={3}><TextField
                            sx={{ width: '100%', textTransform: 'uppercase' }}
                            id="ststate"
                            name="ststate"
                            label="Ship To State"
                            type="ststate"
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.ststate}
                            onChange={formik.handleChange}
                            error={formik.touched.ststate && Boolean(formik.errors.ststate)}
                            helperText={formik.touched.ststate && formik.errors.ststate}
                        /></Grid>
                        <Grid xs={3}><TextField
                            fullWidth
                            id="stpostalcode"
                            name="stpostalcode"
                            label="Ship To Zip Code"
                            type="stpostalcode"
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.stpostalcode}
                            onChange={formik.handleChange}
                            error={formik.touched.stpostalcode && Boolean(formik.errors.stpostalcode)}
                            helperText={formik.touched.stpostalcode && formik.errors.stpostalcode}
                        /></Grid>
                        <Grid xs={5}><TextField
                            fullWidth
                            id="stlat"
                            name="stlat"
                            label="Ship To Latitude"
                            type="stlat"
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.stlat}
                            onChange={formik.handleChange}
                            error={formik.touched.stlat && Boolean(formik.errors.stlat)}
                            helperText={formik.touched.stlat && formik.errors.stlat}
                        /></Grid>
                        <Grid xs={5}><TextField
                            fullWidth
                            id="stlong"
                            name="stlong"
                            label="Ship To Longitude"
                            type="stlong"
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.stlong}
                            onChange={formik.handleChange}
                            error={formik.touched.stlong && Boolean(formik.errors.stlong)}
                            helperText={formik.touched.stlong && formik.errors.stlong}
                        /></Grid>
                        <Grid xs={12}><Button
                            variant='contained'
                            disabled={mode!=="view" ? false : true}
                            sx={{width: '25%', mt:'1rem', mb: '2rem' }}
                            onClick={() => { updateGeo() }}
                            >Get Lat / Long</Button></Grid>
                        </Grid>
                    {/* CUSTOMER SETTINGS SECTION */}
                    <Divider textAlign="left" sx={{ mt: '2rem', mb: '2rem'}}>
                        <Chip icon={<ManageAccountsIcon />} color="primary" variant="outlined" label="Additional Settings" />
                    </Divider>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1}}>
                    <Grid xs={7}>
                            <TextField
                            sx={{ width: '100%' }} 
                            id="phone"
                            name="phone"
                            label="Phone Number"
                            defaultChecked
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleChange}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                        />
                    </Grid>
                    <Grid xs={7}>
                            <TextField
                            sx={{ width: '100%' }} 
                            id="email"
                            name="email"
                            label="Email"
                            defaultChecked
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                    </Grid>
                        <Grid xs={7}>
                            <TextField
                            sx={{ width: '100%' }} 
                            id="markup"
                            name="markup"
                            label="Sales Markup %"
                            defaultChecked
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.markup}
                            onChange={formik.handleChange}
                            onBlur={formik.handleChange}
                            error={formik.touched.markup && Boolean(formik.errors.markup)}
                            helperText={formik.touched.markup && formik.errors.markup}
                        />
                    </Grid>
                    </Grid>
                    
                    <Switch
                    checked={debug}
                    onChange={toggleDebug}
                    sx={{ ml: '2rem', mt: '2rem'}}
                    color="warning"
                    inputProps={{ 'aria-label': 'Toggle Edit' }}
                    />Debug
                    { debug ? <pre>{JSON.stringify({ formik }, null, 4)}</pre> : null}
                </Box>
                </form>
        </div>
    );
}