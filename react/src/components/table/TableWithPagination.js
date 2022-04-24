import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SimpleModal from '../modal/SimpleModal';
import SimpleTable from './SimpleTable';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import { SpaceBetween } from '../styledComponents';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TextField from '@mui/material/TextField';
import { clone, copyObj, inputObjChange } from '../../commont tools/object';

export default function Index({
  headers,
  modalChildren,
  validateModalData,
  axiosUrl,
  defaultTableData,
  deleteModalObjName,
  filter = false,
  defaultFilterValue,
  color = '#4cbbff',
  itemName = 'item',
  modifyData = (a) => a,
}) {
  const [tableData, setTableData] = useState([]);
  const [orderBy, setOrderBy] = useState({ title: 'uid', type: 'desc' });
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState(filter === true ? { search: '' } : filter ? defaultFilterValue : {});

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState(defaultTableData);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteData, setDeleteData] = useState([]);

  const getItems = async (defaultPage) => {
    const {
      data: { data },
    } = await select(defaultPage);
    if (data) setItemsInState(data);
  };

  const modalOnSave = async (e) => {
    e.preventDefault();
    let sendData = modalData;
    let validated = validateModalData(modalData);
    let uid = sendData.uid;

    if (!validated) return;
    else if (validated !== true) {
      const { newData, uid: Uid } = validated;
      uid = Uid;
      sendData = newData;
    }
    if (modalType === 'update') {
      const {
        data: { data, error },
      } = await update(uid, sendData);
      if (data) {
        setItemsInState(data);
        setModalOpen(false);
      } else if (error) alert(error);
    } else if (modalType === 'create') {
      const {
        data: { data, error },
      } = await insert(sendData);
      if (data) {
        setItemsInState(data);
        if (page !== 0) setPage(0);
        setModalOpen(false);
      } else if (error) alert(error);
    }
  };

  const deleteOnSave = async () => {
    const {
      data: { data, error },
    } = await deleteF(deleteData.map((a) => a.uid));
    if (data) {
      setItemsInState(data);
      setDeleteOpen(false);
    } else if (error) alert(error);
  };

  const filterOnSubmit = (e) => {
    e.preventDefault();
    page0();
  };
  let filterDiv;

  if (filter === true)
    filterDiv = (
      <form onSubmit={filterOnSubmit}>
        <TextField
          label="Search"
          id="filled-hidden-label-small"
          size="small"
          value={filterValue.search}
          onChange={(e) => inputObjChange(e, 'search', setFilterValue)}
        />
      </form>
    );
  else if (filter) filterDiv = filter(filterValue, setFilterValue, filterOnSubmit);

  useEffect(() => {
    getItems();
  }, [page, rowsPerPage]);

  useEffect(() => {
    page0();
  }, [orderBy]);

  // additional

  const page0 = () => {
    if (page !== 0) setPage(0);
    else getItems(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const setItemsInState = (data) => {
    const { items, count } = data;
    if (!items.length && count > 0) {
      setPage(page - 1);
    } else {
      setTableData(modifyData(items));
      setCount(count);
    }
  };

  const filterQeury = Object.keys(filterValue)
    .map((a) => [a + 'Filter'] + '=' + filterValue[a])
    .join('&');

  const apiGeneralQuery = `?limit=${rowsPerPage}&order=${orderBy.title}&orderType=${orderBy.type}&${filterQeury}`;
  const apiQuery = apiGeneralQuery + `&page=${page}`;
  const apiQueryForInsert = apiGeneralQuery + `&page=0`;
  const apiQueryForSelect = (defaultPage) => apiGeneralQuery + `&page=${defaultPage || page}`;

  const select = (defaultPage) => axios.get('/api/' + axiosUrl + apiQueryForSelect(defaultPage));

  const update = (uid, data) => axios.put('/api/' + axiosUrl + '/' + uid + apiQuery, data);

  const insert = (data) => axios.post('/api/' + axiosUrl + apiQueryForInsert, data);

  const deleteF = (uidsArr) => axios.delete('/api/' + axiosUrl + apiQuery, { data: uidsArr });

  const modalHeaders = {
    create: 'Create',
    update: 'Update',
  };

  const orderTypes = ['desc', 'asc'];
  return (
    <div>
      <SpaceBetween>
        <h2
          style={{
            textTransform: 'uppercase',
            padding: '0px 15px',
            borderRadius: '4px',
            color,
            fontSize: '20px',
          }}
        >
          {itemName}s
        </h2>
        <div>
          {tableData.find((a) => a.checked) && (
            <Button
              variant="contained"
              style={{ background: '#ff4c4c', marginRight: 10 }}
              onClick={() => {
                setDeleteData(
                  tableData.reduce(
                    (a, b) => (b.checked ? [...a, { [deleteModalObjName]: b[deleteModalObjName], uid: b.uid }] : a),
                    [],
                  ),
                );
                setDeleteOpen(true);
              }}
            >
              Remove {itemName}
            </Button>
          )}
          <Button
            variant="contained"
            style={{ background: color, marginRight: 10 }}
            onClick={() => {
              setModalType('create');
              setModalOpen(true);
              setModalData(defaultTableData);
            }}
          >
            Add {itemName}
          </Button>

          <Button
            variant="contained"
            style={{ background: color }}
            onClick={() => {
              if (!tableData.length) return alert('No ' + itemName);
              let csvContent =
                'data:text/csv;charset=utf-8,' +
                [Object.keys(tableData[0]), ...tableData.map((a) => Object.values(a))]
                  .map((e) => e.join(','))
                  .join('\n');
              var encodedUri = encodeURI(csvContent);

              var link = document.createElement('a');
              link.setAttribute('href', encodedUri);
              link.setAttribute('download', `${itemName}data.csv`);
              document.body.appendChild(link);

              link.click();
            }}
          >
            <CloudDownloadIcon style={{ marginRight: 5 }} /> Download as cvc
          </Button>
        </div>
      </SpaceBetween>
      {filterDiv}
      <br />
      <SimpleModal
        open={modalOpen}
        setOpen={setModalOpen}
        data={modalData}
        setData={setModalData}
        onSave={modalOnSave}
        color={color}
        header={modalHeaders[modalType] + ' ' + itemName}
      >
        {modalChildren(modalData, setModalData, modalOpen)}
      </SimpleModal>

      <SimpleModal
        open={deleteOpen}
        setOpen={setDeleteOpen}
        onSave={deleteOnSave}
        color={color}
        header={'Delete ' + itemName}
      >
        <div>
          Are you sure you want to delete
          {deleteData.map((a, b) => (
            <strong key={b}> {a[deleteModalObjName] + (b + 1 !== deleteData.length ? ',' : '')}</strong>
          ))}
          ?
        </div>
      </SimpleModal>

      <SimpleTable
        color={color}
        data={tableData.map((a) => ({ checked: false, ...a }))}
        headers={[
          {
            renderTitle: () => (
              <input
                type="checkbox"
                checked={tableData.every((a) => a.checked)}
                onChange={() => {
                  const newTableData = (boolean) => [...tableData].map((a) => ({ ...a, checked: boolean }));

                  if (!tableData.every((a) => a.checked)) setTableData(newTableData(true));
                  else setTableData(newTableData(false));
                }}
              />
            ),
            render: (a) => (
              <input
                type="checkbox"
                checked={a.checked}
                onChange={(e) => {
                  const oldTableData = [...tableData];
                  oldTableData.find((b) => b.uid === a.uid).checked = e.target.checked;
                  setTableData(oldTableData);
                }}
              />
            ),
            center: true,
            width: 70,
          },
          ...headers.map((a) => {
            const additionalProps = a.notSortable
              ? {}
              : {
                  titlePre: () => {
                    if (orderBy.title === a.value && orderBy.type === 'asc') return <ArrowUpwardIcon className="" />;
                    return <ArrowDownwardIcon className={orderBy.title === a.value ? '' : 'tableOnlyOnHover'} />;
                  },
                  onClick: () => {
                    if (orderBy.title === a.value)
                      setOrderBy({ title: a.value, type: orderTypes.filter((a) => a !== orderBy.type)[0] });
                    else setOrderBy({ title: a.value, type: 'desc' });
                  },
                };
            return { ...a, ...additionalProps };
          }),
          {
            width: 120,
            center: true,
            isHandle: true,
            data: [
              {
                title: 'Update',
                onClick: (a) => {
                  setModalType('update');
                  setModalOpen(true);
                  setModalData({ ...defaultTableData, ...a });
                },
              },
              {
                title: 'Delete',
                onClick: (a) => {
                  setDeleteOpen(true);
                  setDeleteData([{ uid: a.uid, [deleteModalObjName]: a[deleteModalObjName] }]);
                },
              },
            ],
          },
        ]}
      />

      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
