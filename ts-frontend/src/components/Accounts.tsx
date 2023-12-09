import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';




interface IPROPS{
  accounts: any[]
}
let Accounts: React.FC<IPROPS>= ({accounts}) =>{
  return (
    <React.Fragment>
      <Title>Bank Accounts</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Bank Institution</TableCell>
            <TableCell>Account Name</TableCell>
            <TableCell>Account Mask</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {accounts.map((acc) => (
            
            <TableRow key={acc['account_id']}>
              <TableCell>{acc['institution_name']}</TableCell>
              <TableCell>{acc['account_name']}</TableCell>
              <TableCell>{acc['account_mask']}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
export default Accounts