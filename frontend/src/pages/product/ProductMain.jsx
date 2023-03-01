import { useState, useEffect } from 'react';
import { useFormik } from "formik";
import * as yup from 'yup';
import productService from '../../services/productService'
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


// VALIDATION IF ADDING A NEW PRODUCT
const validationSchema = yup.object({
    upc: yup
    .string()
    .required()
    .min(11,'Needs to be at least 11 characters')
    .max(14,'Must be 14 charaters or less')
    .matches(/^[0-9]+$/,'All characters must be numeric'),
    catalognum: yup
    .string()
    .required('Catalog Number is required'),
    shortname: yup
    .string('Vendor Short Name to be a string'),
    description: yup
    .string('Needs to be a string')
    .required('Description is required'),
    picurl: yup
    .string('Needs to be a string'),
    seller: yup
    .string('Needs to be a string')
    .required('Seller is required'),
    brand: yup
    .string('Needs to be a string')
    .required('Brand is required'),
    ucc: yup
    .string()
    .required('UPC is required')
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(6, 'Must be exactly 6 digits')
    .max(6, 'Must be exactly 6 digits'),
    price_list: yup
    .number('Needs to be a number'),
    price_cost: yup
    .number('Needs to be a number')
    .required('Cost is required'),
});

export default function Product() {
    const [pn, setPn] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [value, setValue] = useState('');
    const [mode, setMode] = useState('view');
    const [options, setOptions] = useState([]); // autocoplete options
    const [auto, setAuto] = useState(''); // Which autocomplete is user in?
    const [debug, setDebug] = useState(false);
    const [open, setOpen] = useState(false);
    const [ucc, setUcc] = useState('');
 
    const formik = useFormik({
        initialValues: {
            upc: '',
            catalognum: '',
            shortname: '',
            description: '',
            picurl: '',
            seller: '',
            brand: '',
            ucc: '',
            price_list: '',
            price_cost: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            alert(JSON.stringify(values, null, 2));
            handleSubmit();
            resetForm();
            setPn('');
        }
  },
);

    // GET PRODUCT LOGIC
      const getProd = async () => {
        if (pn === '') return
        const res = await productService.get(pn)
        if (typeof res === 'undefined') {
            setPn('');
            return alert('No Product Found with id '+ pn)} 
        updateField("upc",res.upc);
        updateField("catalognum",res.catalognum);
        updateField("shortname",res.shortname);
        updateField("description",res.description);
        updateField("picurl",res.picurl);
        updateField("seller",res.seller);
        updateField("brand",res.brand);
        updateField("ucc",res.ucc);
        updateField("price_list",res.price_list);
        updateField("price_cost",res.price_cost);
    };

    useEffect(() => {
        getProd()
      }, [pn])

    useEffect(() => {
        setUcc(formik.values.upc.slice(0,6));
        formik.setFieldValue('ucc', formik.values.upc.slice(0,6))
      }, [formik.values.upc])


    // // DELETE ITEM LOGIC
    const deleteProd = async () => {
        try {
        const delProd = await productService.del(pn)
        console.log('delProd; ',delProd)
        console.log('DELETE PROD called with: ',pn);
        formik.resetForm({ values: ''});
        setPn('');
        handleClose();
        setMode('view');
        } catch (err) {
            console.log(err);
            alert(err);
            formik.resetForm({ values: ''});
            handleClose();
            setPn('');
            setMode('view');
        }
    };

    
    //AUTOCOMPLETE LOGIC FOR PRODUCT SEARCH 
    useEffect(() => {
        const getData = setTimeout(() => {     //add for debounce
            let active = true
                
            if (inputValue === '') {
                setOptions(value ? [value] : []);
                return undefined
            }

            if (auto === 'prod') {
                let res = productService.search(inputValue)
                // console.log('custSearch in useEffect',res)
                .then(res => {
                    if (active) {  
                        if (res) {
                            setOptions(res);
                        }
                    }
                })

            } else {
                // FUTURE AUTO-COMPLETE STUFF HERE
                // let url2 = getUrl()
                // fetch(url2)
                // .then(response => response.json())
                // .then(response => response.items)
                // .then(response => {
                // if (active) {  
                //     if (response) {
                //         setOptions(response);
                //         }
                //     }
                // })
                console.log('Somethign unexpected happened. I did not think we woiuld hit this line of code')
            }
            
            return () => {
                active = false;
            }
        }, 1200)  ///add for debounce
        return () => clearTimeout(getData)   ///add for debounce
    }, [inputValue])

    // UPDATE PRODUCT LOGIC    
    // UPDATE PRODUCT AND CLEAR FORM
    const handleSubmit = async (e) => {
        // e.preventDefault()
        console.log('in hadleSubmit, mode is ', mode)
        if (mode === "edit") {
            let updateData = {"_id": pn, ...formik.values }
            console.log('SAVE clicked in Product Admin UPDATE: ',updateData);
            productService.update(updateData);
            setMode('view');
        } else {
            console.log('SAVE clicked in Product Admin NEW: ',formik.values);
            productService.create(formik.values)
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
          getProd(e.target.value)
    }}

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const clearForm = () => {
        formik.resetForm({ values: ''});
        setPn('');
    }

    const changeMode = (event) => {
        if (event.target.value === "addnew") {
            formik.resetForm({ values: ''});
            setMode(event.target.value);
        } else if (mode === "addnew" && event.target.value !== "addnew" && formik.dirty) {
            setMode(mode)
        } else {
            setMode(event.target.value);
        }
      };

      return (
        <div>
            {/* FORM HEADER CONTROL BUTTONS, ETC */}
                <form onSubmit={formik.handleSubmit}>
                <Grid container mx='2rem' rowSpacing={5} columnSpacing={{ xs: 12}}>
                {/* PRODUCT SEARCH INPUT */}
                <Grid xs={7}>
                <Autocomplete
                    id="prodlookup"
                    autoFocus
                    sx={{width: '100%'}}
                    disabled={ mode==="addnew" ? true : false }
                    getOptionLabel={(option) =>
                        typeof option === 'string' ? option : ''
                    }
                    filterOptions={(x) => x}
                    options={options}
                    value={value}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    noOptionsText="No products match your search."
                    onFocus={() => clearForm()}
                    onChange={(event, newValue) => {
                        setPn(newValue._id);
                        setAuto('prod');
                        console.log('newValue: ',newValue );
                    }}
                    onInputChange={(event, newInputValue) => {
                        setAuto('prod');
                        setInputValue(newInputValue);
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Product Search" fullWidth />
                    )}
                    renderOption={(props, option) => {
                        return <p  {...props} key={option._id}>{`${typeof option === 'object' ? `${option.shortname} ${option.upc} ${option.description}` : 'No Values'}`}</p>
                    }}
                    />
                    </Grid >
                    <Grid xs={3}>
                    <TextField
                        id="pn" label="Search by Product ID" required 
                        sx={{ width: '100%' }}
                        // disabled={ mode!=="view" ? false : true }
                        disabled={mode!=="addnew" ? false : true}
                        value={pn}
                        onChange={(e) => setPn(e.target.value)}
                        onKeyDown={(e) => pressEnter(e)}
                    /></Grid>
                <Button
                    variant='contained'
                    size='small'
                    sx={{ ml: "1rem", mt: '1rem', mr: "2rem", width: '8%', height: '2.5rem' }}
                    onClick={() => { getProd(pn) }}
                    >Search
                </Button>
                <FormControl component="fieldset">
                <FormLabel component="legend">Mode</FormLabel>
                    <RadioGroup row aria-label="gender" name="gender1" value={mode} onChange={changeMode}>
                        <FormControlLabel value="view" control={<Radio />} label="View" />
                        <FormControlLabel value="edit" disabled={!pn} control={<Radio />} label="Edit" />
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
                <Button disabled={ mode==="edit" ? false : true }variant="contained" color="error" sx={{ ml: "5rem", mt: '1rem', width: '6%', height: '2.5rem' }} onClick={handleClickOpen} >
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
                    {"YOU ARE ABOUT TO DELETE A PRODUCT RECORD!"}
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to DELETE {formik.values.description}? The deletion will be permanent. 
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} autoFocus>Disagree</Button>
                    <Button onClick={deleteProd} >Agree</Button>
                    </DialogActions>
                </Dialog>
                </Grid>
                {/* MAIN PRODUCT SECTION */}
                <Divider textAlign="left" sx={{ mt: '2rem', mb: '2rem'}}>
                        <Chip icon={<MarkunreadMailboxIcon />} color="primary" variant="outlined" label="Product Information" />
                    </Divider>
                <Box sx={{ flexGrow: 1 }}>
                <Grid container mx='2rem' rowSpacing={3} columnSpacing={{ xs: 1}}>    
                        <Grid xs={6}>
                            <TextField
                            sx={{ width: '100%' }}
                            inputProps={{ style: { textTransform: "uppercase" } }} 
                            id="upc"
                            name="upc"
                            label="UPC"
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.upc}
                            onChange={formik.handleChange}
                            onBlur={formik.handleChange}
                            error={formik.touched.upc && Boolean(formik.errors.upc)}
                            helperText={formik.touched.upc && formik.errors.upc}
                        />
                        </Grid>
                        <Grid xs={6}><TextField
                            sx={{ width: '100%' }}
                            inputProps={{ style: { textTransform: "uppercase" } }} 
                            id="catalognum"
                            name="catalognum"
                            label="Catalog Number"
                            type="catalognum"
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.catalognum}
                            onChange={formik.handleChange}
                            onBlur={formik.handleChange}
                            error={formik.touched.catalognum && Boolean(formik.errors.catalognum1)}
                            helperText={formik.touched.catalognum && formik.errors.catalognum}
                        /></Grid>
                        <Grid xs={2}><TextField
                            sx={{ width: '100%' }}
                            inputProps={{ style: { textTransform: "uppercase" } }}
                            id="shortname"
                            name="shortname"
                            label="Vendor Short Name"
                            type="shortname"
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.shortname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleChange}
                            error={formik.touched.shortname && Boolean(formik.errors.shortname)}
                            helperText={formik.touched.shortname && formik.errors.shortname}
                        /></Grid>
                        <Grid xs={10}><TextField
                            sx={{ width: '100%' }}
                            inputProps={{ style: { textTransform: "uppercase" } }}
                            id="description"
                            name="description"
                            label="Description"
                            type="description"
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleChange}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        /></Grid>
                        <Grid xs={6}><TextField
                            sx={{ width: '100%' }}
                            inputProps={{ style: { textTransform: "uppercase" } }}
                            id="brand"
                            name="brand"
                            label="Brand"
                            type="brand"
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.brand}
                            onChange={formik.handleChange}
                            error={formik.touched.brand && Boolean(formik.errors.brand)}
                            helperText={formik.touched.brand && formik.errors.brand}
                        /></Grid>
                        <Grid xs={6}><TextField
                            sx={{ width: '100%' }}
                            inputProps={{ style: { textTransform: "uppercase" } }}
                            id="seller"
                            name="seller"
                            label="Seller"
                            type="seller"
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.seller}
                            onChange={formik.handleChange}
                            error={formik.touched.seller && Boolean(formik.errors.seller)}
                            helperText={formik.touched.seller && formik.errors.seller}
                        /></Grid>
                    </Grid>
                    
                    {/* PRICING SECTION */}
                    <Divider textAlign="left" sx={{ mt: '2rem', mb: '2rem'}}>
                        <Chip icon={<ManageAccountsIcon />} color="primary" variant="outlined" label="Pricing Information" />
                    </Divider>
                    <Grid container mx='2rem' rowSpacing={3} columnSpacing={{ xs: 1}}>
                    <Grid xs={7}>
                            <TextField
                            sx={{ width: '100%' }} 
                            id="price_list"
                            name="price_list"
                            label="List Price"
                            defaultChecked
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.price_list}
                            onChange={formik.handleChange}
                            onBlur={formik.handleChange}
                            error={formik.touched.price_list && Boolean(formik.errors.price_list)}
                            helperText={formik.touched.price_list && formik.errors.price_list}
                        />
                    </Grid>
                    <Grid xs={7}>
                            <TextField
                            sx={{ width: '100%' }} 
                            id="price_cost"
                            name="price_cost"
                            label="Cost"
                            defaultChecked
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.price_cost}
                            onChange={formik.handleChange}
                            onBlur={formik.handleChange}
                            error={formik.touched.price_cost && Boolean(formik.errors.price_cost)}
                            helperText={formik.touched.price_cost && formik.errors.price_cost}
                        />
                    </Grid>
                        {/* <Grid xs={7}>
                            <TextField
                            sx={{ width: '100%' }} 
                            id="multiplier"
                            name="multiplier"
                            label="Multiplier"
                            defaultChecked
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.multiplier}
                            onChange={formik.handleChange}
                            onBlur={formik.handleChange}
                            error={formik.touched.multiplier && Boolean(formik.errors.multiplier)}
                            helperText={formik.touched.multiplier && formik.errors.multiplier}
                        />
                    </Grid> */}
                    </Grid>
                    {/* SHIP TO ADDRESS SECTION */}
                    <Divider textAlign="left" sx={{ mt: '2rem', mb: '2rem'}}>
                        <Chip icon={<LocalShippingIcon />} color="primary" variant="outlined" label="Image" />
                    </Divider>
                    <Grid container mx='2rem' rowSpacing={3} columnSpacing={{ xs: 1}}>
                    <Grid xs={12}>
                            <TextField
                            sx={{ width: '100%' }} 
                            id="picurl"
                            name="picurl"
                            label="Picture URL"
                            defaultChecked
                            disabled={ mode!=="view" ? false : true }
                            value={formik.values.picurl}
                            onChange={formik.handleChange}
                            onBlur={formik.handleChange}
                            error={formik.touched.picurl && Boolean(formik.errors.picurl)}
                            helperText={formik.touched.picurl && formik.errors.picurl}
                        />
                    </Grid>
                    <div>
                        <img src={formik.values.picurl} alt='the product' height={400} width={400} style={{margin: '2rem'}} />
                    </div>
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