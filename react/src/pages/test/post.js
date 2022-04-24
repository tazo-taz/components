import React from 'react';
import { beautifyDateTime, dateToDateTime } from '../../commont tools/date';
import TableWithPagination from '../../components/table/TableWithPagination';
import ModalChildren from './ModalChildren';

export default function Post() {
  const headers = [
    { title: 'Uid', value: 'uid', width: 100 },
    { title: 'Title', value: 'title' },
    { title: 'date', value: 'date', render: (a) => beautifyDateTime(a.date), width: 210 },
  ];

  const validateModalData = (data) => {
    const { title, date, uid } = data;

    const formData = new FormData();

    formData.append('title', title);
    formData.append('date', date);

    // for (let k of data.images.filter((a) => a.type !== 'uploaded')) {
    //   formData.append('oldImages', k);
    // }
    // for (let k of data.images.filter((a) => a.type === 'uploaded').map((a) => a.file)) {
    //   formData.append('images', k);
    // }
    for (let k of data.deletedImages || []) {
      formData.append('deletedImages', k);
    }

    formData.append(
      'imagesSorted',
      data.images.map((a) => a.file?.name || a.imageUrl),
    );

    if (title && date) return { newData: formData, uid };
    return false;
  };

  const defaultTableData = {
    title: '',
    date: dateToDateTime(new Date()),
    images: [],
  };

  return (
    <div>
      <TableWithPagination
        headers={headers}
        validateModalData={validateModalData}
        defaultTableData={defaultTableData}
        modalChildren={ModalChildren}
        axiosUrl={'post'}
        deleteModalObjName="title"
        itemName="post"
        filter={true}
        modifyData={(a) => a.map((a) => ({ ...a, date: dateToDateTime(a.date) }))}
      />
    </div>
  );
}
