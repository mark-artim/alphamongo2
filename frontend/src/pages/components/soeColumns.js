// Create an editable cell renderer
const EditableNumberCell = ({
    cell: { value },
    row: { index },
    column: { id },
    updateMyData // This is a custom function that we supplied to our table instance
  }) => {
    const onChange = e => {
      updateMyData(index, id, parseInt(e.target.value, 10));
    };
  
    return <input value={value} onChange={onChange} type="number" />;
  };

  
  

export const COLUMNS = [
    {
        Header: 'Quantity',
        // Cell: EditableNumberCell
    },
    {
        Header: 'Description',
        // Cell: EditableNumberCell
    },
    {
        Header: 'Cost',
        // Cell: EditableNumberCell
    },
    {
        Header: 'Markup',
        // Cell: EditableNumberCell
    },
    {
        Header: 'Sell Price',
        // Cell: EditableNumberCell
    },
    {
        Header: 'Extended Sell',
        // Cell: EditableNumberCell
    },

]