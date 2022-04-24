import React from 'react';
import TableWithPagination from '../../components/table/TableWithPagination';
import TextField from '@mui/material/TextField';
import { inputObjChange } from '../../commont tools/object';

const modalChildren = (data, setData) => (
  <div>
    <TextField
      fullWidth
      label="Name"
      id="filled-hidden-label-small"
      size="small"
      value={data.name}
      onChange={(e) => inputObjChange(e, 'name', setData)}
    />
    <br />
    <br />
    <TextField
      fullWidth
      type="number"
      label="Age"
      id="filled-hidden-label-small"
      size="small"
      value={data.age}
      onChange={(e) => inputObjChange(e, 'age', setData)}
    />
    <br />
    <br />
    <TextField
      fullWidth
      type="number"
      label="Price"
      id="filled-hidden-label-small"
      size="small"
      value={data.price}
      onChange={(e) => inputObjChange(e, 'price', setData)}
    />
  </div>
);

const filter = (data, setData, onSubmit) => (
  <form onSubmit={onSubmit}>
    <TextField
      label="Search"
      id="filled-hidden-label-small"
      size="small"
      value={data.search}
      onChange={(e) => inputObjChange(e, 'search', setData)}
    />
    <TextField
      type="number"
      label="Price from"
      id="filled-hidden-label-small"
      size="small"
      value={data.priceFrom}
      onChange={(e) => inputObjChange(e, 'priceFrom', setData)}
    />
    <TextField
      type="number"
      label="Price to"
      id="filled-hidden-label-small"
      size="small"
      value={data.priceTo}
      onChange={(e) => inputObjChange(e, 'priceTo', setData)}
    />

    <input hidden type="submit" />
  </form>
);
const defaultFilterValue = {
  search: '',
  priceFrom: '',
  priceTo: '',
};

export default function Index() {
  const headers = [
    { title: 'Uid', value: 'uid', width: '100px' },
    { title: 'Name', value: 'name' },
    { title: 'Image', render: (a) => <img src={a.image} alt="" height={30} width={30} />, notSortable: true },
    { title: 'Age', render: (a) => a.age + '(used ages)', value: 'age' },
    { title: 'Price', value: 'price', render: (a) => a.price + '₾' },
  ];

  const validateModalData = (data) => {
    const { name, age, price } = data;
    if (name && String(age).length && price) return true;
    return false;
  };

  const defaultTableData = {
    name: '',
    age: '',
    price: '',
  };

  return (
    <>
      <br />
      <TableWithPagination
        validateModalData={validateModalData}
        headers={headers}
        modalChildren={modalChildren}
        axiosUrl="table"
        defaultTableData={defaultTableData}
        deleteModalObjName="name"
        itemName="user"
      />
    </>
  );
}
