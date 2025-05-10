import { Paper, TableContainer } from '@mui/material';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

const TransactionTable = ({ transactions, onEdit, onDelete }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                overflow: 'hidden'
            }}
        >
            <TableContainer>
                <TableHeader />
                <TableBody
                    transactions={transactions}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </TableContainer>
        </Paper>
    );
};

export default TransactionTable;