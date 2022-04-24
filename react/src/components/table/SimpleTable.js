import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ThreeDotMenu from '../input/ThreeDotMenu';
import './style.css';

export default function SimpleTable({ data = [], headers = [], color = 'white' }) {
  return (
    <TableContainer component={Paper} style={{ borderRadius: 0 }}>
      <Table aria-label="caption table">
        <TableHead style={{ background: color }}>
          <TableRow style={{ display: 'flex' }}>
            {headers.map((a, b) => {
              const headerProps = {
                key: b,
                style: {
                  padding: '20px 9px',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 16,
                  flex: a.flex || 1,
                  maxWidth: a.width || 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: a.center ? 'center' : 'initial',
                },
                align: b === 0 ? 'left' : 'right',
              };

              if (a.renderTitle)
                return (
                  <TableCell {...headerProps}>
                    {a.titlePre && a.titlePre()}
                    {a.renderTitle()}
                  </TableCell>
                );

              return (
                <TableCell
                  className="tableHeader"
                  {...headerProps}
                  onClick={() => (a.onClick ? a.onClick() : () => {})}
                >
                  {a.isHandle ? 'Actions' : a.title}
                  {a.titlePre && a.titlePre()}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, c) => (
            <TableRow style={{ display: 'flex' }} key={row.uid}>
              {headers.map((a, b) => {
                const props = b === 0 ? { component: 'th', scope: 'row' } : { align: 'right' };
                const defaultTdProps = {
                  style: {
                    padding: 9,
                    flex: a.flex || 1,
                    maxWidth: a.width || 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: a.center ? 'center' : 'initial',
                  },
                };
                if (c % 2 === 1) defaultTdProps.style.background = '#f3f3f37d';

                if (a.isHandle)
                  return (
                    <TableCell {...defaultTdProps} key={b} {...props}>
                      <ThreeDotMenu data={a.data.map((b) => ({ ...b, onClick: () => b.onClick(row) }))} />
                    </TableCell>
                  );

                if (a.render)
                  return (
                    <TableCell {...defaultTdProps} key={b} {...props}>
                      {a.render(row)}
                    </TableCell>
                  );

                return (
                  <TableCell {...defaultTdProps} key={b} {...props}>
                    {row[a.value]}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

//   const data = [
//     { uid: 1, name: 'tazo1' },
//     { uid: 2, name: 'tazo2' },
//     { uid: 3, name: 'tazo3' },
//   ];

//   const headers = [
//     { title: 'Uid', value: 'uid' },
//     { title: 'Name', value: 'name' },
//   ];
