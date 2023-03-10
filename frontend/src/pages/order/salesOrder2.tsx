import * as React from 'react'
import ReactDOM from 'react-dom/client'

// import './index.css'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

type Person = {
  quantity: number
  product: string
  cost: number
  markup: number
  sell: number
  extendedSell: number
}

const defaultData: Person[] = [
  {
    quantity: 1,
    product: 'hammer',
    cost: 24.00,
    markup: 1.75,
    sell: 99,
    extendedSell: 50,
  },
  {
    quantity: 3,
    product: 'nail',
    cost: .25,
    markup: 2.0,
    sell: 99,
    extendedSell: 80,
  },
  {
    quantity: 25,
    product: 'band aid',
    cost: .45,
    markup: 1.75,
    sell: 99,
    extendedSell: 10,
  },
  {
    quantity: 2,
    product: 'glue',
    cost: 5.99,
    markup: 1.75,
    sell: 99,
    extendedSell: 90,
  },
]

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.accessor('quantity', {
    cell: info => info.getValue(),
    header: () => <span>First Name</span>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor(row => row.product, {
    id: 'product',
    cell: info => <span>{info.getValue()}</span>,
    header: () => <span>Product</span>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor('cost', {
    header: () => 'Cost',
    cell: info => info.renderValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor('markup', {
    header: () => <span>Mark Up</span>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor('sell', {
    header: 'Unit Price',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('extendedSell', {
    header: 'Extended Sell',
    footer: info => info.column.id,
  }),
]

export default function Salesorder() {
  const [data, setData] = React.useState(() => [...defaultData])
  const rerender = React.useReducer(() => ({}), {})[1]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-2">
        <h3>Version 3 - React-Table v8</h3>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
    </div>
  )
}

// const rootElement = document.getElementById('root')
// if (!rootElement) throw new Error('Failed to find the root element')

// ReactDOM.createRoot(rootElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// )
